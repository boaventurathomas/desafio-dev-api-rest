import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContaService } from './conta.service';
import { CreateContaDto } from './dto/create-conta.dto';
import { UpdateContaDto } from './dto/update-conta.dto';

@Controller('conta')
@ApiTags('conta')
export class ContaController {
  constructor(private readonly contaService: ContaService) { }

  @Post()
  create(@Body() createContaDto: CreateContaDto) {
    return this.contaService.create(createContaDto);
  }

  @Get(':agencia/:conta')
  findOne(@Param('agencia') agencia: string, @Param('conta') conta: string) {
    return this.contaService.findOne(agencia, conta);
  }

  @Patch(':agencia/:conta')
  update(@Param('agencia') agencia: string, @Param('conta') conta: string, @Body() updateContaDto: UpdateContaDto) {
    return this.contaService.update(agencia, conta, updateContaDto);
  }

  @Delete(':agencia/:conta')
  remove(@Param('agencia') agencia: string, @Param('conta') conta: string) {
    return this.contaService.remove(agencia, conta);
  }
}
