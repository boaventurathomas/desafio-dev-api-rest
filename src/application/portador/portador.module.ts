import { Module } from '@nestjs/common';
import { PortadorService } from './portador.service';
import { PortadorController } from './portador.controller';

@Module({
  controllers: [PortadorController],
  providers: [PortadorService]
})
export class PortadorModule {}
