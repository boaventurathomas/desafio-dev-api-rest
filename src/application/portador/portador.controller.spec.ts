import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from './../../factories/repository-mock.factory';
import { created, ok } from './../../helpers/http.helper';
import { UpdatePortadorDto } from './dto/update-portador.dto';
import { Portador } from './entities/portador.entity';
import { PortadorController } from './portador.controller';
import { PortadorService } from './portador.service';

describe('PortadorController', () => {
  let controller: PortadorController
  let service: PortadorService

  const res = {
    send: function (d?: any) { return d },
    status: function (s: number) { this.statusCode = s; return this; }
  };

  const portador: Portador = {
    "nomeCompleto": "Thomas Boa Ventura",
    "cpf": "65329530083"
  }

  const portadores: Portador[] = [
    {
      "nomeCompleto": "Thomas Boa Ventura",
      "cpf": "01159115028"
    },
    {
      "nomeCompleto": "Thomas Boa Ventura",
      "cpf": "54483012070"
    }
  ]

  const updatedPortador = {
    "nomeCompleto": "Nome Alterado",
    "cpf": "01159115028"
  }

  beforeEach(async () => {

    const PORTADOR_REPOSITORY_TOKEN = getRepositoryToken(Portador)

    const mockPortadorService = {
      create: jest.fn(dto => {
        return created(portador)
      }),
      findAll: jest.fn(dto => {
        return ok(portadores)
      }),
      findOne: jest.fn(dto => {
        return ok(portador)
      }),
      update: jest.fn(dto => {
        return ok(updatedPortador)
      }),
      remove: jest.fn(dto => {
        return ok({})
      }),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PortadorController],
      providers: [
        {
          provide: PortadorService,
          useValue: mockPortadorService
        },
        {
          provide: PORTADOR_REPOSITORY_TOKEN,
          useFactory: repositoryMockFactory
        },
      ],
    }).compile();

    controller = module.get<PortadorController>(PortadorController);
    service = module.get<PortadorService>(PortadorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create portador', async () => {
    expect(await controller.create(res, portador)).toEqual(created(portador));
    expect(service.create).toHaveBeenCalledTimes(1);
  });

  it('should find all portadores', async () => {
    expect(await controller.findAll(res)).toEqual(ok(portadores));
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });

  it('should find one portador', async () => {
    const cpf = portador.cpf;
    const result = await controller.findOne(res, cpf);
    expect(result).toEqual(ok(portador));
    expect(service.findOne).toHaveBeenCalledTimes(1);
    expect(result.data.cpf).toEqual(cpf);
  });

  it('should update portador', async () => {
    const cpf = portador.cpf;
    const dto: UpdatePortadorDto = { nomeCompleto: updatedPortador.nomeCompleto }
    const result = await controller.update(res, cpf, dto);
    expect(result).toEqual(ok(updatedPortador));
    expect(service.update).toHaveBeenCalledTimes(1);
    expect(result.data.nomeCompleto).toEqual(dto.nomeCompleto);
  });

  it('should remove portador', async () => {
    const cpf = portador.cpf;
    const result = await controller.remove(res, cpf);
    expect(result).toEqual(ok({}));
    expect(service.remove).toHaveBeenCalledTimes(1);
  });
});


