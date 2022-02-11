import { Injectable } from '@nestjs/common';
import { CreatePortadorDto } from './dto/create-portador.dto';
import { UpdatePortadorDto } from './dto/update-portador.dto';

@Injectable()
export class PortadorService {
  create(createPortadorDto: CreatePortadorDto) {
    return 'This action adds a new portadora';
  }

  findAll() {
    return `This action returns all portador`;
  }

  findOne(id: number) {
    return `This action returns a #${id} portador`;
  }

  update(id: number, updatePortadorDto: UpdatePortadorDto) {
    return `This action updates a #${id} portador`;
  }

  remove(id: number) {
    return `This action removes a #${id} portador`;
  }
}
