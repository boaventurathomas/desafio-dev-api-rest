import { Controller, Get, Post, Body, Query, Res } from '@nestjs/common';
import { TransacaoService } from './transacao.service';
import { ExtratoTransacoesDto } from './dto/extrato-transacoes.dto';
import { CreateTransacaoDto } from './dto/create-transacao.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('transacao')
@ApiTags('transacao')
export class TransacaoController {
  constructor(private readonly transacaoService: TransacaoService) { }

  @Post('/deposito')
  async deposito(@Res() res, @Body() depositoDto: CreateTransacaoDto) {
    const response = await this.transacaoService.deposito(depositoDto);
    return res.status(response.statusCode).send(response);
  }

  @Post('/saque')
  async saque(@Res() res, @Body() saqueDto: CreateTransacaoDto) {
    const response = await this.transacaoService.saque(saqueDto);
    return res.status(response.statusCode).send(response);
  }

  @Get('/extrato')
  async extrato(@Res() res, @Query() extratoTransacoesDTO: ExtratoTransacoesDto) {
    const response = await this.transacaoService.extrato(extratoTransacoesDTO);
    return res.status(response.statusCode).send(response);
  }
}
