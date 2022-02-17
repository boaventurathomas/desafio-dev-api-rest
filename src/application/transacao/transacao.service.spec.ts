import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Connection, getConnection, QueryRunner, Repository } from 'typeorm';
import * as typeorm from 'typeorm';
import { ContaModule } from '../conta/conta.module';
import { Conta } from '../conta/entities/conta.entity';
import { CreateTrasacaoContaDto } from './dto/create-transacao-conta.dto copy';
import { Transacao } from './entities/transacao.entity';
import { TransacaoService } from './transacao.service';
import { ExtratoTransacoesDto } from './dto/extrato-transacoes.dto';
import { ok, serverError } from './../../helpers/http.helper';

jest.mock('typeorm', () => {
  const actual = jest.requireActual('typeorm');
  return {
    ...actual,
    getConnection: jest.fn()
  }
});

class ConnectionMock {
  createQueryRunner(mode?: "master" | "slave"): QueryRunner {
    const qr = {
      manager: {},
    } as QueryRunner;
    qr.manager;
    Object.assign(qr.manager, {
      save: jest.fn()
    });
    qr.connect = jest.fn();
    qr.release = jest.fn();
    qr.startTransaction = jest.fn();
    qr.commitTransaction = jest.fn();
    qr.rollbackTransaction = jest.fn();
    qr.release = jest.fn();
    return qr;
  }
}

// const extrato: Transacao = plainToClass(Transacao, {
//   "idTransacao": "043f96e1-1f4c-4ada-9b50-d4f0edff964f",
//   "valor": "-1.00",
//   "dataTransacao": "2022-02-14T19:24:36.000Z"
// });

describe('TransacaoService', () => {
  const TRANSACAO_REPOSITORY_TOKEN = getRepositoryToken(Transacao)
  const CONTA_REPOSITORY_TOKEN = getRepositoryToken(Conta)
  let service: TransacaoService;
  let transacaoRepoMock: Repository<Transacao>;
  let contaRepoMock: Repository<Conta>;
  let connection: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransacaoService,
        {
          provide: TRANSACAO_REPOSITORY_TOKEN,
          useFactory: repositoryMockFactory
        },
        {
          provide: CONTA_REPOSITORY_TOKEN,
          useFactory: repositoryMockFactory
        },
        {
          provide: Connection,
          useClass: ConnectionMock,
        },
        ContaModule
      ],
    }).compile();

    service = module.get<TransacaoService>(TransacaoService);

    transacaoRepoMock = module.get(TRANSACAO_REPOSITORY_TOKEN);
    contaRepoMock = module.get(TRANSACAO_REPOSITORY_TOKEN);

    connection = module.get<Connection>(Connection);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('should consultaValorSaqueDia return a sum value', async () => {

  //   const resultMock = 3000;
  //   jest.spyOn(service, 'consultaValorSaqueDia').mockImplementation(async () => Promise.resolve(resultMock));

  //   const result = await service.consultaValorSaqueDia('0000', '00000000', '2022-02-14');

  //   expect(result).toBe(resultMock);

  // });

  it('should validaLimite return a true value', async () => {
    const conta: Conta = { limiteSaqueDiario: 2000 }

    const result = service.validaLimite(conta, 1000, 500);

    expect(result).toBe(true)
  });

  it('should validaLimite return a false value', async () => {
    const conta: Conta = { limiteSaqueDiario: 2000 }

    const result = service.validaLimite(conta, 1000, 1500);

    expect(result).toBe(false)
  });

  it('should contaAtiva return a true value', async () => {
    const conta: Conta = { ativo: true }

    const result = service.contaAtiva(conta);

    expect(result).toBe(true)
  });

  it('should contaAtiva return a false value', async () => {
    const conta: Conta = { ativo: false }

    const result = service.contaAtiva(conta);

    expect(result).toBe(false)
  });

  it('should validaSaldoContaTransacao return a true value', async () => {
    const conta: Conta = { saldo: 1000 }

    const result = service.validaSaldoContaTransacao(conta, 1000);

    expect(result).toBe(true)
  });

  it('should validaSaldoContaTransacao return a false value', async () => {
    const conta: Conta = { saldo: 500 }

    const result = service.validaSaldoContaTransacao(conta, 1000);

    expect(result).toBe(false)
  });

  it('should buscaConta valid conta repository', async () => {
    const contaResponse: Conta = {
      agencia: '0000',
      conta: '00000000',
      ativo: true,
      saldo: 3000
    }

    jest.spyOn(typeorm, "getRepository").mockImplementation(() => {
      const original = jest.requireActual("typeorm");
      // You need all functions used in your Query builder  
      return {
        ...original,
        findOne: jest
          .fn()
          .mockResolvedValue(contaResponse) as unknown,
      };
    });
  })

  it('should buscaConta return a valid conta', async () => {

    const contaRequest: CreateTrasacaoContaDto = {
      agencia: '0000',
      conta: '00000000'
    }

    const contaResponse: Conta = {
      agencia: '0000',
      conta: '00000000',
      ativo: true,
      saldo: 3000
    }

    jest.spyOn(contaRepoMock, 'findOne').mockReturnValue(Promise.resolve(contaResponse))

    let result = await service.buscaConta(contaRequest, contaRepoMock);

    expect(result).toEqual(contaResponse);

  })

  it('should buscaConta return a undefined conta', async () => {

    const contaRequest: CreateTrasacaoContaDto = {
      agencia: '0000',
      conta: '00000000'
    }

    jest.spyOn(contaRepoMock, 'findOne').mockReturnValue(undefined)

    let result = await service.buscaConta(contaRequest, contaRepoMock);

    expect(result).toEqual(undefined);

  })

  it('should buscaConta return a undefined conta', async () => {

    const contaRequest: CreateTrasacaoContaDto = {
      agencia: '0000',
      conta: '00000000'
    }

    jest.spyOn(contaRepoMock, 'findOne').mockReturnValue(undefined)

    let result = await service.buscaConta(contaRequest, contaRepoMock);

    expect(result).toEqual(undefined);

  })

  it('should atualizaSaldoConta do update is called', async () => {

    const contaRequest: CreateTrasacaoContaDto = {
      agencia: '0000',
      conta: '00000000'
    }

    const updateSpy = jest.spyOn(contaRepoMock, 'update')

    await service.atualizaSaldoConta(contaRequest, 1000, contaRepoMock);

    expect(updateSpy).toHaveBeenCalled()

  })

  it('should extrato return ok response', async () => {

    const extratoTransacoesDTO: ExtratoTransacoesDto = {
      agencia: '0000',
      conta: '00000000',
      dataInicialPeriodo: '2022-02-11',
      dataFinalPeriodo: '2022-02-14'
    }

    const response = [{
      "idTransacao": "043f96e1-1f4c-4ada-9b50-d4f0edff964f",
      "valor": "-1.00",
      "dataTransacao": "2022-02-14T19:24:36.000Z"
    },
    {
      "idTransacao": "0f267834-9e50-4a96-959c-a13b564e8819",
      "valor": "-1.00",
      "dataTransacao": "2022-02-14T19:23:50.000Z"
    }];

    const createQueryBuilder: any = {
      select: () => createQueryBuilder,
      where: () => createQueryBuilder,
      andWhere: () => createQueryBuilder,
      getMany: () => response,
    };

    jest.spyOn(transacaoRepoMock, 'createQueryBuilder').mockImplementation(() => createQueryBuilder);

    const result = service.extrato(extratoTransacoesDTO);

    expect(result).resolves.toEqual(ok(response));
  })

  it('should extrato return server error throw queryBuilder', async () => {
    const extratoTransacoesDTO: any = {
      conta: '00000000',
      dataInicialPeriodo: '2022-02-11',
      dataFinalPeriodo: '2022-02-14'
    }

    const result = service.extrato(extratoTransacoesDTO);
    expect(result).resolves.toEqual(serverError());
  })

  it('should if has transaction in the date in consultaValorSaqueDia', async () => {

    const agencia = '0000'
    const conta = '00000000'
    const data = '2022-02-11'

    const response = { totalDia: 2000 };

    const createQueryBuilder: any = {
      select: () => createQueryBuilder,
      where: () => createQueryBuilder,
      andWhere: () => createQueryBuilder,
      getRawOne: () => response,
    };

    jest.spyOn(transacaoRepoMock, 'createQueryBuilder').mockImplementation(() => createQueryBuilder);

    const result = await service.consultaValorSaqueDia(agencia, conta, data);

    expect(result).toBe((response.totalDia * -1));
  })

  // it('should if no has transaction in the date in consultaValorSaqueDia', async () => {

  //   const agencia = '0000'
  //   const conta = '00000000'
  //   const data = '2022-02-11'

  //   const response = null;

  //   const createQueryBuilder: any = {
  //     select: () => createQueryBuilder,
  //     where: () => createQueryBuilder,
  //     andWhere: () => createQueryBuilder,
  //     getRawOne: () => response,
  //   };

  //   jest.spyOn(transacaoRepoMock, 'createQueryBuilder').mockImplementation(() => createQueryBuilder);

  //   const result = service.consultaValorSaqueDia(agencia, conta, data);

  //   expect(result).toBe(0);
  // })



});


export const repositoryMockFactory: () => Repository<any> = jest.fn(() => {
  const original = jest.requireActual("typeorm");
  return {
    ...original,
    findOne: jest.fn(),
    update: jest.fn()
  }
});
