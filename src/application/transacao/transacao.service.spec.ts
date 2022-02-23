import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, QueryRunner, Repository } from 'typeorm';
import * as typeorm from 'typeorm';
import { ContaModule } from '../conta/conta.module';
import { Conta } from '../conta/entities/conta.entity';
import { CreateTrasacaoContaDto } from './dto/create-transacao-conta.dto copy';
import { Transacao } from './entities/transacao.entity';
import { TransacaoService } from './transacao.service';
import { ExtratoTransacoesDto } from './dto/extrato-transacoes.dto';
import { created, ok, serverError } from './../../helpers/http.helper';
import { CreateTransacaoDto } from './dto/create-transacao.dto';
import { ResponseCreateTransacaoDto } from './dto/response-create-transacao.dto';
import { repositoryMockFactory } from './../../factories/repository-mock.factory';

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
  getRepository = jest.fn()
}

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

  it('should buscaConta has valid conta repository', async () => {
    const contaResponse: Conta = {
      agencia: '0000',
      conta: '00000000',
      ativo: true,
      saldo: 3000
    }

    jest.spyOn(typeorm, "getRepository").mockImplementation(() => {
      const original = jest.requireActual("typeorm");
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

  it('should atualizaSaldoConta do update is called', async () => {

    const contaRequest: CreateTrasacaoContaDto = {
      agencia: '0000',
      conta: '00000000'
    }

    const updateSpy = jest.spyOn(contaRepoMock, 'update')

    await service.atualizaSaldoConta(contaRequest, 1000, contaRepoMock);

    expect(updateSpy).toHaveBeenCalled()

  })

  it('should extrato returns ok', async () => {

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

  it('should extrato returns server error 500', async () => {
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

  it('should if no has transaction in the date in consultaValorSaqueDia returning 0', async () => {
    const agencia = '0000'
    const conta = '00000000'
    const data = '2022-02-11'

    const response = { totalDia: null };

    const createQueryBuilder: any = {
      select: () => createQueryBuilder,
      where: () => createQueryBuilder,
      andWhere: () => createQueryBuilder,
      getRawOne: () => response,
    };

    jest.spyOn(transacaoRepoMock, 'createQueryBuilder').mockImplementation(() => createQueryBuilder);

    const result = await service.consultaValorSaqueDia(agencia, conta, data);

    expect(result).toBe(0);
  })

  it('should if conta to deposito not found 404', async () => {
    const depositoDto: CreateTransacaoDto = {
      "valor": 1.37,
      "conta": {
        "agencia": "0000",
        "conta": "00000000"
      }
    }

    jest.spyOn(typeorm, "getConnection").mockImplementation(() => connection);

    const qr = connection.createQueryRunner()
    qr.connect()
    qr.startTransaction()

    jest.spyOn(connection, "getRepository").mockImplementation(() => transacaoRepoMock);
    jest.spyOn(connection, "getRepository").mockImplementation(() => contaRepoMock);

    const buscaContaSpy = jest.spyOn(service, 'buscaConta');
    buscaContaSpy.mockImplementation(() => Promise.resolve(undefined));

    const result = await service.deposito(depositoDto);

    expect(result.statusCode).toBe(404)
  })

  it('should if conta to deposito is inactive returns bad request 400', async () => {
    const depositoDto: CreateTransacaoDto = {
      "valor": 1.37,
      "conta": {
        "agencia": "0000",
        "conta": "00000000"
      }
    }

    const contaResponse: Conta = {
      agencia: depositoDto.conta.agencia,
      conta: depositoDto.conta.conta,
      ativo: true,
      saldo: 0
    }

    jest.spyOn(typeorm, "getConnection").mockImplementation(() => connection);

    const qr = connection.createQueryRunner()
    qr.connect()
    qr.startTransaction()

    jest.spyOn(connection, "getRepository").mockImplementation(() => transacaoRepoMock);
    jest.spyOn(connection, "getRepository").mockImplementation(() => contaRepoMock);

    const buscaContaSpy = jest.spyOn(service, 'buscaConta');
    buscaContaSpy.mockImplementation(() => Promise.resolve(contaResponse));

    const contaAtivaSpy = jest.spyOn(service, 'contaAtiva')
    contaAtivaSpy.mockImplementation(() => false)

    const result = await service.deposito(depositoDto);

    expect(result.statusCode).toBe(400)
  })

  it('should deposito return server error 500', async () => {
    const depositoDto: any = {
      "conta": {
        "agencia": "0000",
        "conta": "00000000"
      }
    }

    const result = service.deposito(depositoDto);
    expect(result).resolves.toEqual(serverError());
  })

  it('should deposito is correct', async () => {
    const depositoDto: CreateTransacaoDto = {
      "valor": 1.37,
      "conta": {
        "agencia": "0000",
        "conta": "00000000"
      }
    }

    const contaResponse: Conta = {
      agencia: depositoDto.conta.agencia,
      conta: depositoDto.conta.conta,
      ativo: true,
      saldo: 0
    }

    const transacao: Transacao = {
      idTransacao: '1',
      valor: depositoDto.valor,
      dataTransacao: new Date('2022-07-05'),
      conta: {
        conta: contaResponse.conta,
        agencia: contaResponse.agencia,
        saldo: contaResponse.saldo
      }
    }

    const response: ResponseCreateTransacaoDto = {
      transacao: {
        idTransacao: transacao.idTransacao,
        dataTransacao: transacao.dataTransacao,
        valor: transacao.valor
      },
      conta: {
        conta: contaResponse.conta,
        agencia: contaResponse.agencia,
        saldo: contaResponse.saldo + transacao.valor
      }
    }

    jest.spyOn(typeorm, "getConnection").mockImplementation(() => connection);

    const qr = connection.createQueryRunner()
    qr.connect()
    qr.startTransaction()

    jest.spyOn(connection, "getRepository").mockImplementation(() => transacaoRepoMock);
    jest.spyOn(connection, "getRepository").mockImplementation(() => contaRepoMock);

    jest.spyOn(typeorm, "getConnection").mockImplementation(() => connection);

    const buscaContaSpy = jest.spyOn(service, 'buscaConta');
    buscaContaSpy.mockImplementation(() => Promise.resolve(contaResponse));

    const contaAtivaSpy = jest.spyOn(service, 'contaAtiva')
    contaAtivaSpy.mockImplementation(() => true)

    const createSpy = jest.spyOn(transacaoRepoMock, 'create')
    createSpy.mockImplementation(() => transacao)

    const saveSpy = jest.spyOn(transacaoRepoMock, 'save')

    const atualizaSaldoContaSpy = jest.spyOn(service, 'atualizaSaldoConta');

    const result = await service.deposito(depositoDto);

    expect(buscaContaSpy).toHaveBeenCalled()
    expect(contaAtivaSpy).toHaveBeenCalled()
    expect(createSpy).toHaveBeenCalled()
    expect(saveSpy).toHaveBeenCalled()
    expect(atualizaSaldoContaSpy).toHaveBeenCalled()

    expect(result.statusCode).toBe(201)
    expect(result).toStrictEqual(created(response));
  })

  it('should if conta to SAQUE not found 404', async () => {
    const saqueDto: CreateTransacaoDto = {
      "valor": 1.37,
      "conta": {
        "agencia": "0000",
        "conta": "00000000"
      }
    }

    jest.spyOn(typeorm, "getConnection").mockImplementation(() => connection);

    const qr = connection.createQueryRunner()
    qr.connect()
    qr.startTransaction()

    jest.spyOn(connection, "getRepository").mockImplementation(() => transacaoRepoMock);
    jest.spyOn(connection, "getRepository").mockImplementation(() => contaRepoMock);

    const buscaContaSpy = jest.spyOn(service, 'buscaConta');
    buscaContaSpy.mockImplementation(() => Promise.resolve(undefined));

    const result = await service.saque(saqueDto);

    expect(result.statusCode).toBe(404)
  })

  it('should if conta to SAQUE is inactive returns bad request 400', async () => {
    const saqueDto: CreateTransacaoDto = {
      "valor": 1.37,
      "conta": {
        "agencia": "0000",
        "conta": "00000000"
      }
    }

    const contaResponse: Conta = {
      agencia: saqueDto.conta.agencia,
      conta: saqueDto.conta.conta,
      ativo: false,
      saldo: 0
    }

    jest.spyOn(typeorm, "getConnection").mockImplementation(() => connection);

    const qr = connection.createQueryRunner()
    qr.connect()
    qr.startTransaction()

    jest.spyOn(connection, "getRepository").mockImplementation(() => transacaoRepoMock);
    jest.spyOn(connection, "getRepository").mockImplementation(() => contaRepoMock);

    const buscaContaSpy = jest.spyOn(service, 'buscaConta');
    buscaContaSpy.mockImplementation(() => Promise.resolve(contaResponse));

    const contaAtivaSpy = jest.spyOn(service, 'contaAtiva')

    const result = await service.saque(saqueDto);

    expect(result.statusCode).toBe(400)
    expect(buscaContaSpy).toHaveBeenCalled()
    expect(contaAtivaSpy).toHaveBeenCalled()
  })

  it('should if conta to SAQUE no has enough saldo returns bad request 400', async () => {
    const saqueDto: CreateTransacaoDto = {
      "valor": 1.37,
      "conta": {
        "agencia": "0000",
        "conta": "00000000"
      }
    }

    const contaResponse: Conta = {
      agencia: saqueDto.conta.agencia,
      conta: saqueDto.conta.conta,
      ativo: true,
      saldo: 0
    }

    jest.spyOn(typeorm, "getConnection").mockImplementation(() => connection);

    const qr = connection.createQueryRunner()
    qr.connect()
    qr.startTransaction()

    jest.spyOn(connection, "getRepository").mockImplementation(() => transacaoRepoMock);
    jest.spyOn(connection, "getRepository").mockImplementation(() => contaRepoMock);

    const buscaContaSpy = jest.spyOn(service, 'buscaConta');
    buscaContaSpy.mockImplementation(() => Promise.resolve(contaResponse));

    const contaAtivaSpy = jest.spyOn(service, 'contaAtiva')

    const validaSaldoContaTransacaoSpy = jest.spyOn(service, 'validaSaldoContaTransacao')
    validaSaldoContaTransacaoSpy.mockImplementation(() => false)

    const result = await service.saque(saqueDto);

    expect(result.statusCode).toBe(400)
    expect(result.data).toBe('Saldo insuficiente')
    expect(buscaContaSpy).toHaveBeenCalled()
    expect(contaAtivaSpy).toHaveBeenCalled()
    expect(validaSaldoContaTransacaoSpy).toHaveBeenCalled()
  })

  it('should if daily account limit reached to SAQUE', async () => {

    const saqueDto: CreateTransacaoDto = {
      "valor": 1.37,
      "conta": {
        "agencia": "0000",
        "conta": "00000000"
      }
    }

    const contaResponse: Conta = {
      agencia: saqueDto.conta.agencia,
      conta: saqueDto.conta.conta,
      ativo: true,
      saldo: 0,
      limiteSaqueDiario: 2000
    }

    jest.spyOn(typeorm, "getConnection").mockImplementation(() => connection);

    const qr = connection.createQueryRunner()
    qr.connect()
    qr.startTransaction()

    jest.spyOn(connection, "getRepository").mockImplementation(() => transacaoRepoMock);
    jest.spyOn(connection, "getRepository").mockImplementation(() => contaRepoMock);

    const buscaContaSpy = jest.spyOn(service, 'buscaConta');
    buscaContaSpy.mockImplementation(() => Promise.resolve(contaResponse));

    const contaAtivaSpy = jest.spyOn(service, 'contaAtiva')

    const validaSaldoContaTransacaoSpy = jest.spyOn(service, 'validaSaldoContaTransacao')
    validaSaldoContaTransacaoSpy.mockImplementation(() => true)

    const consultaValorSaqueDiaSpy = jest.spyOn(service, 'consultaValorSaqueDia')
    consultaValorSaqueDiaSpy.mockImplementation(() => Promise.resolve(3000))

    const validaLimiteSpy = jest.spyOn(service, 'validaLimite')
    validaLimiteSpy.mockImplementation(() => false)

    const result = await service.saque(saqueDto);

    expect(result.statusCode).toBe(400)
    expect(result.data).toBe('Limite diário atingido')
    expect(buscaContaSpy).toHaveBeenCalled()
    expect(contaAtivaSpy).toHaveBeenCalled()
    expect(validaSaldoContaTransacaoSpy).toHaveBeenCalled()
    expect(consultaValorSaqueDiaSpy).toHaveBeenCalled()
    expect(validaLimiteSpy).toHaveBeenCalled()
  })

  it('should SAQUE return server error 500', async () => {
    const saqueDto: any = {
      "conta": {
        "agencia": "0000",
        "conta": "00000000"
      }
    }

    const result = service.saque(saqueDto);
    expect(result).resolves.toEqual(serverError());
  })

  it('should SAQUE is correct', async () => {
    const saqueDto: CreateTransacaoDto = {
      "valor": 1.37,
      "conta": {
        "agencia": "0000",
        "conta": "00000000"
      }
    }

    const contaResponse: Conta = {
      agencia: saqueDto.conta.agencia,
      conta: saqueDto.conta.conta,
      ativo: true,
      saldo: 0
    }

    const transacao: Transacao = {
      idTransacao: '1',
      valor: saqueDto.valor,
      dataTransacao: new Date('2022-07-05'),
      conta: {
        conta: contaResponse.conta,
        agencia: contaResponse.agencia,
        saldo: contaResponse.saldo
      }
    }

    const response: ResponseCreateTransacaoDto = {
      transacao: {
        idTransacao: transacao.idTransacao,
        dataTransacao: transacao.dataTransacao,
        valor: transacao.valor
      },
      conta: {
        conta: contaResponse.conta,
        agencia: contaResponse.agencia,
        saldo: contaResponse.saldo - transacao.valor
      }
    }

    jest.spyOn(typeorm, "getConnection").mockImplementation(() => connection);

    const qr = connection.createQueryRunner()
    qr.connect()
    qr.startTransaction()

    jest.spyOn(connection, "getRepository").mockImplementation(() => transacaoRepoMock);
    jest.spyOn(connection, "getRepository").mockImplementation(() => contaRepoMock);

    jest.spyOn(typeorm, "getConnection").mockImplementation(() => connection);

    const buscaContaSpy = jest.spyOn(service, 'buscaConta');
    buscaContaSpy.mockImplementation(() => Promise.resolve(contaResponse));

    const contaAtivaSpy = jest.spyOn(service, 'contaAtiva')
    contaAtivaSpy.mockImplementation(() => true)

    const validaSaldoContaTransacaoSpy = jest.spyOn(service, 'validaSaldoContaTransacao')
    validaSaldoContaTransacaoSpy.mockImplementation(() => true)

    const consultaValorSaqueDiaSpy = jest.spyOn(service, 'consultaValorSaqueDia')
    consultaValorSaqueDiaSpy.mockImplementation(() => Promise.resolve(1000))

    const validaLimiteSpy = jest.spyOn(service, 'validaLimite')
    validaLimiteSpy.mockImplementation(() => true)

    const createSpy = jest.spyOn(transacaoRepoMock, 'create')
    createSpy.mockImplementation(() => transacao)

    const saveSpy = jest.spyOn(transacaoRepoMock, 'save')

    const atualizaSaldoContaSpy = jest.spyOn(service, 'atualizaSaldoConta');

    const result = await service.saque(saqueDto);

    expect(buscaContaSpy).toHaveBeenCalled()
    expect(contaAtivaSpy).toHaveBeenCalled()
    expect(validaSaldoContaTransacaoSpy).toHaveBeenCalled()
    expect(consultaValorSaqueDiaSpy).toHaveBeenCalled()
    expect(validaLimiteSpy).toHaveBeenCalled()
    expect(createSpy).toHaveBeenCalled()
    expect(saveSpy).toHaveBeenCalled()
    expect(atualizaSaldoContaSpy).toHaveBeenCalled()

    expect(result.statusCode).toBe(201)
    expect(result).toStrictEqual(created(response));
  })

});
