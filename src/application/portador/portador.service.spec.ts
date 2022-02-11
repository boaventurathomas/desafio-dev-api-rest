import { Test, TestingModule } from '@nestjs/testing';
import { PortadorService } from './portador.service';

describe('PortadorService', () => {
  let service: PortadorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PortadorService],
    }).compile();

    service = module.get<PortadorService>(PortadorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
