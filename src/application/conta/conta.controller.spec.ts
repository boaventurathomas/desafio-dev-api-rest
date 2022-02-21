import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { created, ok } from './../../helpers/http.helper';
import { repositoryMockFactory } from './../../factories/repository-mock.factory';
import { ContaController } from './conta.controller';
import { ContaService } from './conta.service';
import { Conta } from './entities/conta.entity';
import { CreateContaDto } from './dto/create-conta.dto';
import { UpdateContaDto } from './dto/update-conta.dto';

describe('ContaController', () => {
  let controller: ContaController;
  let service: ContaService

  const createContaDto: CreateContaDto = {
    agencia: '',
    conta: '',
    portador: {
      cpf: '01159115028'
    }
  }

  const conta: Conta = {
    agencia: "0000",
    conta: "00000000",
    ativo: true,
    limiteSaqueDiario: 2000,
    saldo: 0
  }

  const updatedConta = {
    agencia: "0000",
    conta: "00000000",
    ativo: false,
    limiteSaqueDiario: 2000,
    saldo: 0
  }

  beforeEach(async () => {

    const CONTA_REPOSITORY_TOKEN = getRepositoryToken(Conta)

    const mockContaService = {
      create: jest.fn(dto => {
        return created(conta)
      }),
      findOne: jest.fn(dto => {
        return ok(conta)
      }),
      update: jest.fn(dto => {
        return ok(updatedConta)
      }),
      remove: jest.fn(dto => {
        return ok({})
      }),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContaController],
      providers: [
        {
          provide: ContaService,
          useValue: mockContaService
        },
        {
          provide: CONTA_REPOSITORY_TOKEN,
          useFactory: repositoryMockFactory
        },
      ],
    }).compile();

    controller = module.get<ContaController>(ContaController);
    service = module.get<ContaService>(ContaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create conta', async () => {
    expect(await controller.create(createContaDto)).toEqual(created(conta));
    expect(service.create).toHaveBeenCalledTimes(1);
  });

  it('should find one conta', async () => {
    const agenciaReq = conta.agencia;
    const contaReq = conta.conta;
    const result = await controller.findOne(agenciaReq, contaReq);
    expect(result).toEqual(ok(conta));
    expect(service.findOne).toHaveBeenCalledTimes(1);
  });

  it('should update conta', async () => {
    const agenciaReq = conta.agencia;
    const contaReq = conta.conta;
    const dto: UpdateContaDto = { ativo: false }
    const result = await controller.update(agenciaReq, contaReq, dto);
    expect(result).toEqual(ok(Object.assign({}, conta, dto)));
    expect(service.update).toHaveBeenCalledTimes(1);
    expect(result.data.ativo).toBe(false);
  });

  it('should remove conta', async () => {
    const agenciaReq = conta.agencia;
    const contaReq = conta.conta;
    const result = await controller.remove(agenciaReq, contaReq);
    expect(result).toEqual(ok({}));
    expect(service.remove).toHaveBeenCalledTimes(1);
  });

});
