import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { badRequest, created, notFound, ok, serverError } from './../../helpers/http.helper';
import { getDateNowToDB } from './../../utils/date-format';
import { Connection, getConnection, Repository } from 'typeorm';
import { Conta } from '../conta/entities/conta.entity';
import { ExtratoTransacoesDto } from './dto/extrato-transacoes.dto';
import { Transacao } from './entities/transacao.entity';
import { CreateTransacaoDto } from './dto/create-transacao.dto';
import { ResponseCreateTransacaoDto } from './dto/response-create-transacao.dto';
import { CreateTrasacaoContaDto } from './dto/create-transacao-conta.dto copy';

@Injectable()
export class TransacaoService {

  constructor(
    @InjectRepository(Transacao)
    private readonly repository: Repository<Transacao>
  ) { }

  async consultaValorSaqueDia(agencia: string, conta: string, data: string): Promise<number> {
    const transacoesDia = await this.repository.createQueryBuilder('saquesDia')
      .select('SUM(valor)', 'totalDia')
      .where('conta = :conta', { conta })
      .andWhere('agencia = :agencia', { agencia })
      .andWhere('DATE_FORMAT(data_transacao, "%Y-%m-%d") = :data', { data })
      .andWhere('valor < 0')
      .getRawOne()

    return transacoesDia.totalDia === null ? 0 : transacoesDia.totalDia * -1;
  }

  validaLimite(conta: Conta, valorTransacao: number, valorTotalResgatadoDia: number): boolean {
    return (valorTotalResgatadoDia + valorTransacao) <= conta.limiteSaqueDiario
  }

  contaAtiva(conta: Conta): boolean {
    return conta.ativo
  }

  validaSaldoContaTransacao(conta: Conta, valorTransacao: number): boolean {
    const saldoConta = +conta.saldo;
    return saldoConta >= valorTransacao
  }

  async buscaConta(conta: CreateTrasacaoContaDto, contaRepository: Repository<Conta>): Promise<Conta> {
    const contaCadastrada = await contaRepository.findOne({ agencia: conta.agencia, conta: conta.conta });

    if (!contaCadastrada) {
      return undefined
    }

    return contaCadastrada
  }

  async atualizaSaldoConta(conta: Conta, novoSaldo: number, contaRepository: Repository<Conta>) {
    await contaRepository.update({ conta: conta.conta, agencia: conta.agencia }, { saldo: novoSaldo });
  }

  async extrato(extratoTransacoesDTO: ExtratoTransacoesDto) {

    try {
      const contaData = extratoTransacoesDTO.conta
      const agenciaData = extratoTransacoesDTO.agencia
      const dataInicialPeriodoData = extratoTransacoesDTO.dataInicialPeriodo
      const dataFinalPeriodoData = extratoTransacoesDTO.dataFinalPeriodo

      const transacoes = await this.repository
        .createQueryBuilder()
        .select()
        .where('conta = :contaData', { contaData })
        .andWhere('agencia = :agenciaData', { agenciaData })
        .andWhere('STR_TO_DATE(data_transacao, "%Y-%m-%d") BETWEEN STR_TO_DATE(:dataInicialPeriodoData,"%Y-%m-%d") AND STR_TO_DATE(:dataFinalPeriodoData,"%Y-%m-%d")', { dataInicialPeriodoData, dataFinalPeriodoData })
        .getMany()

      return ok(transacoes);
    } catch (e) {
      Logger.error(e);
      return serverError();
    }
  }

  async saque(saqueDto: CreateTransacaoDto) {

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const transacaoRepository = connection.getRepository(Transacao);
      const contaRepository = connection.getRepository(Conta);
      const valorSaque = +saqueDto.valor;

      const conta = await contaRepository.findOne({ agencia: saqueDto.conta.agencia, conta: saqueDto.conta.conta });

      if (!conta) {
        return notFound(`Agência ${saqueDto.conta.agencia} e conta ${saqueDto.conta.conta} não cadastrada`)
      }

      if (!this.contaAtiva(conta)) {
        return badRequest(`Agência ${conta.agencia} e conta ${conta.conta} inativa`)
      }

      if (!this.validaSaldoContaTransacao(conta, valorSaque)) {
        return badRequest('Saldo insuficiente')
      }

      const valorTotalResgatadoDia = await this.consultaValorSaqueDia(conta.agencia, conta.conta, getDateNowToDB());

      if (!this.validaLimite(conta, valorSaque, valorTotalResgatadoDia)) {
        return badRequest('Limite diário atingido')
      }

      saqueDto.valor *= -1;

      const createdTransacao = transacaoRepository.create(saqueDto)
      await transacaoRepository.save(createdTransacao)

      const novoSaldo = (+conta.saldo) - valorSaque;

      await contaRepository.update({
        conta: conta.conta,
        agencia: conta.agencia
      }, { saldo: novoSaldo });

      await queryRunner.commitTransaction();

      const response: ResponseCreateTransacaoDto = {
        transacao: {
          idTransacao: createdTransacao.idTransacao,
          dataTransacao: createdTransacao.dataTransacao,
          valor: createdTransacao.valor
        },
        conta: {
          conta: conta.conta,
          agencia: conta.agencia,
          saldo: novoSaldo
        }
      }

      return created(response)

    } catch (e) {
      Logger.error(e);
      await queryRunner.rollbackTransaction();
      return serverError();
    }
  }

  async deposito(depositoDto: CreateTransacaoDto) {

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      const transacaoRepository = connection.getRepository(Transacao);
      const contaRepository: Repository<Conta> = connection.getRepository(Conta);
      const contaCadastrada = await this.buscaConta(depositoDto.conta, contaRepository);

      if (!contaCadastrada) {
        return notFound(`Agência ${depositoDto.conta.agencia} e conta ${depositoDto.conta.conta} não cadastrada`)
      }

      if (!this.contaAtiva(contaCadastrada)) {
        return badRequest(`Agência ${contaCadastrada.agencia} e conta ${contaCadastrada.conta} inativa`)
      }

      const novoSaldo = (+contaCadastrada.saldo) + (+depositoDto.valor);

      const createdTransacao = transacaoRepository.create(depositoDto)
      await transacaoRepository.save(createdTransacao)

      await this.atualizaSaldoConta(contaCadastrada, novoSaldo, contaRepository)

      await queryRunner.commitTransaction();

      const response: ResponseCreateTransacaoDto = {
        transacao: {
          idTransacao: createdTransacao.idTransacao,
          dataTransacao: createdTransacao.dataTransacao,
          valor: createdTransacao.valor
        },
        conta: {
          conta: contaCadastrada.conta,
          agencia: contaCadastrada.agencia,
          saldo: novoSaldo
        }
      }

      return created(response)

    } catch (e) {
      Logger.error(e);
      await queryRunner.rollbackTransaction();
      return serverError();
    }
  }

}
