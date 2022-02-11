import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PortadorModule } from './application/portador/portador.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'desafio-dev-api-rest',
      entities: [],
      synchronize: true,
    }),
    PortadorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
