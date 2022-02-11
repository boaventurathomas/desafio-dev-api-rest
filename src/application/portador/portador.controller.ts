import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PortadorService } from './portador.service';
import { CreatePortadorDto } from './dto/create-portador.dto';
import { UpdatePortadorDto } from './dto/update-portador.dto';

@Controller('portador')
export class PortadorController {
  constructor(private readonly portadorService: PortadorService) {}

  @Post()
  create(@Body() createPortadorDto: CreatePortadorDto) {
    return this.portadorService.create(createPortadorDto);
  }

  @Get()
  findAll() {
    return this.portadorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.portadorService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePortadorDto: UpdatePortadorDto,
  ) {
    return this.portadorService.update(+id, updatePortadorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.portadorService.remove(+id);
  }
}
