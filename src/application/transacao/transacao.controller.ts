import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { TransacaoService } from './transacao.service';
import { ExtratoTransacoesDto } from './dto/extrato-transacoes.dto';
import { CreateTransacaoDto } from './dto/create-transacao.dto';

@Controller('transacao')
export class TransacaoController {
  constructor(private readonly transacaoService: TransacaoService) { }

  @Post('/deposito')
  deposito(@Body() depositoDto: CreateTransacaoDto) {
    return this.transacaoService.deposito(depositoDto);
  }

  @Post('/saque')
  saque(@Body() saqueDto: CreateTransacaoDto) {
    return this.transacaoService.saque(saqueDto);
  }

  @Get('/extrato')
  async extrato(@Query() extratoTransacoesDTO: ExtratoTransacoesDto) {
    return this.transacaoService.extrato(extratoTransacoesDTO);
  }
}
