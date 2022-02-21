import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from './../../factories/repository-mock.factory';
import { Repository, UpdateResult } from 'typeorm';
import { ContaService } from './conta.service';
import { Conta } from './entities/conta.entity';
import { created, ok, serverError } from './../../helpers/http.helper';
import { CreateContaDto } from './dto/create-conta.dto';
import { UpdateContaDto } from './dto/update-conta.dto';

describe('ContaService', () => {
  let service: ContaService;
  let contaRepoMock: Repository<Conta>
  const CONTA_REPOSITORY_TOKEN = getRepositoryToken(Conta)

  const conta: Conta = {
    agencia: "0000",
    conta: "00000000",
    ativo: true,
    limiteSaqueDiario: 2000,
    saldo: 0
  }

  const createContaDto: CreateContaDto = {
    agencia: '0000',
    conta: '00000000',
    portador: {
      cpf: '01159115028'
    }
  }

  const updateContaDto: UpdateContaDto = {
    ativo: false
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContaService,
        {
          provide: CONTA_REPOSITORY_TOKEN,
          useFactory: repositoryMockFactory
        },
      ],
    }).compile();

    service = module.get<ContaService>(ContaService);
    contaRepoMock = module.get<Repository<Conta>>(CONTA_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findContaByIndex', () => {
    it('should findContaByIndex found a conta', async () => {

      jest.spyOn(contaRepoMock, 'findOne').mockReturnValue(Promise.resolve(conta))

      const result = await service.findContaByIndex(conta.agencia, conta.conta)

      expect(result).toEqual(conta)
    });
  });

  describe('create', () => {
    it('should created conta', async () => {

      const spyFindContaByIndex = jest.spyOn(service, 'findContaByIndex')
      spyFindContaByIndex.mockReturnValue(Promise.resolve(null))

      const spyCreate = jest.spyOn(contaRepoMock, 'create')
      spyCreate.mockReturnValue(conta)

      const spySave = jest.spyOn(contaRepoMock, 'save')

      const result = await service.create(createContaDto)

      expect(result).toEqual(created(conta))
      expect(spyFindContaByIndex).toHaveBeenCalled()
      expect(spyCreate).toHaveBeenCalled()
      expect(spySave).toHaveBeenCalled()
    });

    it('should not created conta because already exist', async () => {

      const spyFindOne = jest.spyOn(service, 'findContaByIndex')
      spyFindOne.mockReturnValue(Promise.resolve(conta))

      const result = await service.create(createContaDto)

      expect(result.statusCode).toBe(400)
      expect(spyFindOne).toHaveBeenCalled()

    });
  });

  describe('findOne', () => {
    it('should findOne conta', async () => {

      const spyFindContaByIndex = jest.spyOn(service, 'findContaByIndex')
      spyFindContaByIndex.mockReturnValue(Promise.resolve(conta))

      const result = await service.findOne(conta.agencia, conta.conta)

      expect(result).toEqual(ok(conta))
      expect(spyFindContaByIndex).toHaveBeenCalled()

    });

    it('should not findOne conta because not exist', async () => {

      const spyFindContaByIndex = jest.spyOn(service, 'findContaByIndex')
      spyFindContaByIndex.mockReturnValue(Promise.resolve(null))

      const result = await service.findOne(conta.agencia, conta.conta)

      expect(result.statusCode).toBe(404)
      expect(spyFindContaByIndex).toHaveBeenCalled()

    });
  });

  describe('update', () => {
    it('should updated conta', async () => {

      const updateResponse: UpdateResult = {
        raw: 1,
        affected: 1,
        generatedMaps: []
      }

      const spyFindContaByIndex = jest.spyOn(service, 'findContaByIndex')
      spyFindContaByIndex.mockReturnValue(Promise.resolve(conta))

      const spyUpdate = jest.spyOn(contaRepoMock, 'update')
      spyUpdate.mockReturnValue(Promise.resolve(updateResponse))

      const result = await service.update(conta.agencia, conta.conta, updateContaDto)

      expect(result).toEqual(ok(Object.assign({}, conta, updateContaDto)))
      expect(result.data.ativo).toEqual(false)
      expect(spyFindContaByIndex).toHaveBeenCalled()
      expect(spyUpdate).toHaveBeenCalled()

    });

    it('should not update conta because not exist', async () => {

      const spyFindContaByIndex = jest.spyOn(service, 'findContaByIndex')
      spyFindContaByIndex.mockReturnValue(Promise.resolve(null))

      const result = await service.update(conta.agencia, conta.conta, updateContaDto)

      expect(result.statusCode).toBe(404)
      expect(spyFindContaByIndex).toHaveBeenCalled()

    });

    it('should not update conta because no rows affected', async () => {

      const updateResponse: UpdateResult = {
        raw: 1,
        affected: 0,
        generatedMaps: []
      }

      const spyFindContaByIndex = jest.spyOn(service, 'findContaByIndex')
      spyFindContaByIndex.mockReturnValue(Promise.resolve(conta))

      const spyUpdate = jest.spyOn(contaRepoMock, 'update')
      spyUpdate.mockReturnValue(Promise.resolve(updateResponse))

      const result = await service.update(conta.agencia, conta.conta, updateContaDto)

      expect(result).toEqual(serverError())
      expect(spyFindContaByIndex).toHaveBeenCalled()
      expect(spyUpdate).toHaveBeenCalled()

    });

  });

  describe('remove', () => {
    it('should remove conta', async () => {

      const spyFindContaByIndex = jest.spyOn(service, 'findContaByIndex')
      spyFindContaByIndex.mockReturnValue(Promise.resolve(conta))

      const spyRemove = jest.spyOn(contaRepoMock, 'remove')

      const result = await service.remove(conta.agencia, conta.conta)

      expect(result).toEqual(ok({}))
      expect(spyFindContaByIndex).toHaveBeenCalled()
      expect(spyRemove).toHaveBeenCalled()

    });

    it('should not remove conta because not exist', async () => {

      const spyFindContaByIndex = jest.spyOn(service, 'findContaByIndex')
      spyFindContaByIndex.mockReturnValue(Promise.resolve(null))

      const result = await service.remove(conta.agencia, conta.conta)

      expect(result.statusCode).toBe(404)
      expect(spyFindContaByIndex).toHaveBeenCalled()

    });

  });

});
