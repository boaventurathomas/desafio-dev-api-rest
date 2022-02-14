import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContaModule } from './application/conta/conta.module';
import { Conta } from './application/conta/entities/conta.entity';
import { Portador } from './application/portador/entities/portador.entity';
import { PortadorModule } from './application/portador/portador.module';
import { Transacao } from './application/transacao/entities/transacao.entity';
import { TransacaoModule } from './application/transacao/transacao.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      logging: JSON.parse(process.env.DB_LOGGING),
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        Portador,
        Conta,
        Transacao
      ],
      synchronize: JSON.parse(process.env.DB_SYNCHRONIZE),
    }),
    PortadorModule,
    ContaModule,
    TransacaoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
