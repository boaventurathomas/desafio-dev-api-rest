import { Module } from '@nestjs/common';
import { PortadorService } from './portador.service';
import { PortadorController } from './portador.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portador } from './entities/portador.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Portador])],
  controllers: [PortadorController],
  providers: [PortadorService],
})
export class PortadorModule {}
