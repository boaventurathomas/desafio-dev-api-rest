import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { created, ok } from './../../helpers/http.helper';
import { Transacao } from './entities/transacao.entity';
import { TransacaoController } from './transacao.controller';
import { TransacaoService } from './transacao.service';
import { ResponseCreateTransacaoDto } from './dto/response-create-transacao.dto';
import { CreateTransacaoDto } from './dto/create-transacao.dto';
import { ExtratoTransacoesDto } from './dto/extrato-transacoes.dto';
import { repositoryMockFactory } from './../../factories/repository-mock.factory';
import { HttpStatus } from '@nestjs/common';

const transactionResponse: ResponseCreateTransacaoDto = {
  transacao: {
    idTransacao: '1ee8044a-aff9-4c00-8bc5-f5d266431ded',
    dataTransacao: new Date('2022-02-20'),
    valor: 1.37
  },
  conta: {
    conta: '00000000',
    agencia: '0000',
    saldo: 2000
  }
}

const extratoResponse = [{
  "idTransacao": "043f96e1-1f4c-4ada-9b50-d4f0edff964f",
  "valor": -1.00,
  "dataTransacao": new Date('2022-02-14')
},
{
  "idTransacao": "0f267834-9e50-4a96-959c-a13b564e8819",
  "valor": -1.00,
  "dataTransacao": new Date('2022-02-14')
}]

describe('TransacaoController', () => {
  const TRANSACAO_REPOSITORY_TOKEN = getRepositoryToken(Transacao)
  let controller: TransacaoController
  let service: TransacaoService
  const res = {
    send: function (d?: any) { return d },
    status: function (s: number) { this.statusCode = s; return this; }
  };

  const mockTransacaoService = {
    deposito: jest.fn(dto => {
      return created(transactionResponse)
    }),
    saque: jest.fn(dto => {
      return created(transactionResponse)
    }),
    extrato: jest.fn(dto => {
      return ok(extratoResponse)
    }),
  }

  beforeEach(async () => {


    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransacaoController],
      providers: [
        {
          provide: TransacaoService,
          useValue: mockTransacaoService
        },
        {
          provide: TRANSACAO_REPOSITORY_TOKEN,
          useFactory: repositoryMockFactory
        },
      ],
    }).compile();

    controller = module.get<TransacaoController>(TransacaoController);
    service = module.get<TransacaoService>(TransacaoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should do deposito', async () => {

    const depositoRequest: CreateTransacaoDto = {
      "valor": 1.37,
      "conta": {
        "agencia": "0000",
        "conta": "00000000"
      }
    }
    expect(await controller.deposito(res, depositoRequest)).toEqual(created(transactionResponse));
    expect(service.deposito).toHaveBeenCalledTimes(1);
  });

  it('should do extrato', async () => {
    const extratoRequest: ExtratoTransacoesDto = {
      agencia: '0000',
      conta: '00000000',
      dataInicialPeriodo: '2022-02-11',
      dataFinalPeriodo: '2022-02-14'
    }
    expect(await controller.extrato(res, extratoRequest)).toEqual(ok(extratoResponse));
    expect(service.extrato).toHaveBeenCalledTimes(1);
  });

  it('should do saque', async () => {
    const saqueRequest: CreateTransacaoDto = {
      "valor": 1.37,
      "conta": {
        "agencia": "0000",
        "conta": "00000000"
      }
    }
    expect(await controller.saque(res, saqueRequest)).toEqual(created(transactionResponse));
    expect(service.saque).toHaveBeenCalledTimes(1);
  });

});
