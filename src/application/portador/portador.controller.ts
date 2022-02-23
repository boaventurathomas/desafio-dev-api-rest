import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { PortadorService } from './portador.service';
import { CreatePortadorDto } from './dto/create-portador.dto';
import { UpdatePortadorDto } from './dto/update-portador.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('portador')
@ApiTags('portador')
export class PortadorController {
  constructor(private readonly portadorService: PortadorService) { }

  @Post()
  async create(@Res() res, @Body() createPortadorDto: CreatePortadorDto) {
    const response = await this.portadorService.create(createPortadorDto);
    return res.status(response.statusCode).send(response);
  }

  @Get()
  async findAll(@Res() res) {
    const response = await this.portadorService.findAll()
    return res.status(response.statusCode).send(response);
  }

  @Get(':id')
  async findOne(@Res() res, @Param('id') id: string) {
    const response = await this.portadorService.findOne(id);
    return res.status(response.statusCode).send(response);
  }

  @Patch(':id')
  async update(
    @Res() res,
    @Param('id') id: string,
    @Body() updatePortadorDto: UpdatePortadorDto,
  ) {
    const response = await this.portadorService.update(id, updatePortadorDto);
    return res.status(response.statusCode).send(response);
  }

  @Delete(':id')
  async remove(@Res() res, @Param('id') id: string) {
    const response = await this.portadorService.remove(id);
    return res.status(response.statusCode).send(response);
  }
}
