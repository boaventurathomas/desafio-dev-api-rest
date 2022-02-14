import { Module } from '@nestjs/common';
import { TransacaoService } from './transacao.service';
import { TransacaoController } from './transacao.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transacao } from './entities/transacao.entity';
import { ContaModule } from '../conta/conta.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transacao]),
    ContaModule
  ],
  controllers: [TransacaoController],
  providers: [TransacaoService]
})
export class TransacaoModule { }
