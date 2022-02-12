import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContaModule } from './application/conta/conta.module';
import { Conta } from './application/conta/entities/conta.entity';
import { Portador } from './application/portador/entities/portador.entity';
import { PortadorModule } from './application/portador/portador.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        Portador,
        Conta
      ],
      synchronize: JSON.parse(process.env.DB_SYNCHRONIZE),
    }),
    PortadorModule,
    ContaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
