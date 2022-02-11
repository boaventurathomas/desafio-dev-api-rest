import { Test, TestingModule } from '@nestjs/testing';
import { PortadorController } from './portador.controller';
import { PortadorService } from './portador.service';

describe('PortadorController', () => {
  let controller: PortadorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PortadorController],
      providers: [PortadorService],
    }).compile();

    controller = module.get<PortadorController>(PortadorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
