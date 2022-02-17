import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContaModule } from './application/conta/conta.module';
import { PortadorModule } from './application/portador/portador.module';
import { TransacaoModule } from './application/transacao/transacao.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    PortadorModule,
    ContaModule,
    TransacaoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
