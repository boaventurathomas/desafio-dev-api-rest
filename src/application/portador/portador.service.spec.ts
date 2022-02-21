import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from './../../factories/repository-mock.factory';
import { PortadorService } from './portador.service';
import { Portador } from './entities/portador.entity';
import { Repository, UpdateResult } from 'typeorm';
import { created, ok, serverError } from './../../helpers/http.helper';
import { UpdatePortadorDto } from './dto/update-portador.dto';

describe('PortadorService', () => {
  let service: PortadorService
  let portadorRepoMock: Repository<Portador>
  const PORTADOR_REPOSITORY_TOKEN = getRepositoryToken(Portador)

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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortadorService,
        {
          provide: PORTADOR_REPOSITORY_TOKEN,
          useFactory: repositoryMockFactory
        },
      ],
    }).compile();

    service = module.get<PortadorService>(PortadorService);
    portadorRepoMock = module.get<Repository<Portador>>(PORTADOR_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should findOne found a portador', async () => {

      jest.spyOn(portadorRepoMock, 'findOne').mockReturnValue(Promise.resolve(portador))

      const result = await service.findOne(portador.cpf)

      expect(result).toEqual(ok(portador))
    });

    it('should findOne not found a portador', async () => {

      jest.spyOn(portadorRepoMock, 'findOne').mockReturnValue(Promise.resolve(null))

      const result = await service.findOne(portador.cpf)

      expect(result.statusCode).toBe(404);
    });

  });

  describe('findAll', () => {
    it('should findAll found portadores', async () => {

      jest.spyOn(portadorRepoMock, 'find').mockReturnValue(Promise.resolve(portadores))

      const result = await service.findAll()

      expect(result).toEqual(ok(portadores))
    });

    it('should findAll not found a portador', async () => {

      jest.spyOn(portadorRepoMock, 'find').mockReturnValue(Promise.resolve([]))

      const result = await service.findAll()

      expect(result.statusCode).toBe(404);
    });
  });

  describe('create', () => {
    it('should created portador', async () => {

      const spyFindOne = jest.spyOn(portadorRepoMock, 'findOne')
      spyFindOne.mockReturnValue(Promise.resolve(null))

      const spyCreate = jest.spyOn(portadorRepoMock, 'create')
      spyCreate.mockReturnValue(portador)

      const spySave = jest.spyOn(portadorRepoMock, 'save')

      const result = await service.create(portador)

      expect(result).toEqual(created(portador))
      expect(spyFindOne).toHaveBeenCalled()
      expect(spyFindOne).toHaveBeenCalled()
      expect(spySave).toHaveBeenCalled()
    });

    it('should not created portador because is already exist', async () => {

      const spyFindOne = jest.spyOn(portadorRepoMock, 'findOne')
      spyFindOne.mockReturnValue(Promise.resolve(portador))

      const result = await service.create(portador)

      expect(result.statusCode).toBe(400)
      expect(spyFindOne).toHaveBeenCalled()

    });
  });

  describe('update', () => {
    it('should update portador', async () => {

      const updatePortadorDto: UpdatePortadorDto = {
        nomeCompleto: 'TESTE'
      }

      const updateResponse: UpdateResult = {
        raw: 1,
        affected: 1,
        generatedMaps: []
      }

      const spyFindOne = jest.spyOn(portadorRepoMock, 'findOne')
      spyFindOne.mockReturnValue(Promise.resolve(portador))

      const spyUpdate = jest.spyOn(portadorRepoMock, 'update')
      spyUpdate.mockReturnValue(Promise.resolve(updateResponse))

      const result = await service.update(portador.cpf, updatePortadorDto)

      expect(result).toEqual(ok(Object.assign({}, portador, updatePortadorDto)))
      expect(spyFindOne).toHaveBeenCalled()
      expect(spyUpdate).toHaveBeenCalled()
    });

    it('should not update portador because not exist', async () => {

      const updatePortadorDto: UpdatePortadorDto = {
        nomeCompleto: 'TESTE'
      }

      const spyFindOne = jest.spyOn(portadorRepoMock, 'findOne')
      spyFindOne.mockReturnValue(Promise.resolve(null))

      const result = await service.update(portador.cpf, updatePortadorDto)

      expect(result.statusCode).toBe(404)
      expect(spyFindOne).toHaveBeenCalled()

    });

    it('should not update portador because no rows affected', async () => {

      const updatePortadorDto: UpdatePortadorDto = {
        nomeCompleto: 'TESTE'
      }

      const updateResponse: UpdateResult = {
        raw: 1,
        affected: 0,
        generatedMaps: []
      }

      const spyFindOne = jest.spyOn(portadorRepoMock, 'findOne')
      spyFindOne.mockReturnValue(Promise.resolve(portador))

      const spyUpdate = jest.spyOn(portadorRepoMock, 'update')
      spyUpdate.mockReturnValue(Promise.resolve(updateResponse))

      const result = await service.update(portador.cpf, updatePortadorDto)

      expect(result).toEqual(serverError())
      expect(spyFindOne).toHaveBeenCalled()
      expect(spyUpdate).toHaveBeenCalled()

    });
  });

  describe('remove', () => {
    it('should remove portador', async () => {

      const spyFindOne = jest.spyOn(portadorRepoMock, 'findOne')
      spyFindOne.mockReturnValue(Promise.resolve(portador))

      const spyRemove = jest.spyOn(portadorRepoMock, 'remove')

      const result = await service.remove(portador.cpf)

      expect(result).toEqual(ok({}))
      expect(spyFindOne).toHaveBeenCalled()
      expect(spyRemove).toHaveBeenCalled()
    });

    it('should not remove portador because not exist', async () => {

      const spyFindOne = jest.spyOn(portadorRepoMock, 'findOne')
      spyFindOne.mockReturnValue(Promise.resolve(null))

      const result = await service.remove(portador.cpf)

      expect(result.statusCode).toBe(404)
      expect(spyFindOne).toHaveBeenCalled()

    });
  });


});
