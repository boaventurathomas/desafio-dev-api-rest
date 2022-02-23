import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContaService } from './conta.service';
import { CreateContaDto } from './dto/create-conta.dto';
import { UpdateContaDto } from './dto/update-conta.dto';

@Controller('conta')
@ApiTags('conta')
export class ContaController {
  constructor(private readonly contaService: ContaService) { }

  @Post()
  async create(@Res() res, @Body() createContaDto: CreateContaDto) {
    const response = await this.contaService.create(createContaDto);
    return res.status(response.statusCode).send(response);
  }

  @Get(':agencia/:conta')
  async findOne(@Res() res, @Param('agencia') agencia: string, @Param('conta') conta: string) {
    const response = await this.contaService.findOne(agencia, conta);
    return res.status(response.statusCode).send(response);
  }

  @Patch(':agencia/:conta')
  async update(@Res() res, @Param('agencia') agencia: string, @Param('conta') conta: string, @Body() updateContaDto: UpdateContaDto) {
    const response = await this.contaService.update(agencia, conta, updateContaDto);
    return res.status(response.statusCode).send(response);
  }

  @Delete(':agencia/:conta')
  async remove(@Res() res, @Param('agencia') agencia: string, @Param('conta') conta: string) {
    const response = await this.contaService.remove(agencia, conta);
    return res.status(response.statusCode).send(response);
  }
}
