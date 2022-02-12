import { Module } from '@nestjs/common';
import { ContaService } from './conta.service';
import { ContaController } from './conta.controller';
import { Conta } from './entities/conta.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Conta])],
  controllers: [ContaController],
  providers: [ContaService]
})
export class ContaModule { }
