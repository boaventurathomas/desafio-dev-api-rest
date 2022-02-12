import {
  BadRequestException,
  HttpCode,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePortadorDto } from './dto/create-portador.dto';
import { UpdatePortadorDto } from './dto/update-portador.dto';
import { Portador } from './entities/portador.entity';
import { Response } from './../../interfaces/response.interface';
import { badRequest, created, notFound, ok, serverError } from 'src/helpers/http.helper';

@Injectable()
export class PortadorService {
  constructor(
    @InjectRepository(Portador)
    private readonly repository: Repository<Portador>,
  ) {}

  async create(createPortadorDto: CreatePortadorDto): Promise<Response> {
    const portador = await this.repository.findOne(createPortadorDto.cpf);
    if (portador) {
      return badRequest(`Portador ${portador.cpf} já existente`);        
    } else {
      const createdPortador = await this.repository.create(createPortadorDto)
      return created(await this.repository.save(createdPortador))
    }
  }

  async findAll(): Promise<Response> {
    const portadores = await this.repository.find();
    if (portadores.length > 0) {
      return ok(portadores)
    } else {
      return notFound('Nenhum portador cadastrado');
    }
  }

  async findOne(id: string) {
    const portador = await this.repository.findOne(id);
    if (!portador) {
      return notFound(`Portador ${id} não encontrado`)
    } else {
      return ok(portador)
    }
  }

  async update(id: string, updatePortadorDto: UpdatePortadorDto) {
    const portador = await this.repository.findOne(id);
    if (!portador) {
      return notFound(`Portador ${id} não encontrado`);
    }
    const updateResponse = await this.repository.update(id, updatePortadorDto);
    if (updateResponse.affected > 0) {
      return ok(Object.assign({}, portador, updatePortadorDto))
    } else {
     return serverError()
    }
  }

  async remove(id: string) {
    const portador = await this.repository.findOne(id);
    if (!portador) {
      return notFound(`Portador ${id} não encontrado`);
    }
    await this.repository.remove(portador);
    return ok({})
  }
}
