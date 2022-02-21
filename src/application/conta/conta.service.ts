import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { badRequest, created, notFound, ok, serverError } from './../../helpers/http.helper';
import { Repository } from 'typeorm';
import { CreateContaDto } from './dto/create-conta.dto';
import { UpdateContaDto } from './dto/update-conta.dto';
import { Conta } from './entities/conta.entity';

@Injectable()
export class ContaService {

  constructor(
    @InjectRepository(Conta)
    private readonly repository: Repository<Conta>,
  ) { }

  async findContaByIndex(agencia: string, conta: string) {
    return await this.repository.findOne({
      where: {
        agencia: agencia,
        conta: conta
      }
    });
  }

  async create(createContaDto: CreateContaDto) {
    const contaCadastrada = await this.findContaByIndex(createContaDto.agencia, createContaDto.conta)

    if (contaCadastrada) {
      return badRequest(`Agência ${createContaDto.agencia} e conta ${createContaDto.conta} já cadastrada`);
    } else {
      const createdconta = await this.repository.create(createContaDto)
      await this.repository.save(createdconta);
      return created(createdconta)
    }
  }

  async findOne(agencia: string, conta: string) {
    const contaCadastrada = await this.findContaByIndex(agencia, conta)
    if (contaCadastrada) {
      return ok(contaCadastrada);
    } else {
      return notFound(`Agência ${agencia} e conta ${conta} não cadastrada`)
    }
  }

  async update(agencia: string, conta: string, updateContaDto: UpdateContaDto) {
    const contaCadastrada = await this.findContaByIndex(agencia, conta)

    if (!contaCadastrada) {
      return notFound(`Agência ${agencia} e conta ${conta} não cadastrada`)
    }

    const updateResponse = await this.repository.update(contaCadastrada, updateContaDto);
    if (updateResponse.affected > 0) {
      return ok(Object.assign({}, contaCadastrada, updateContaDto))
    } else {
      return serverError()
    }
  }

  async remove(agencia: string, conta: string) {
    const contaCadastrada = await this.findContaByIndex(agencia, conta)

    if (!contaCadastrada) {
      return notFound(`Agência ${agencia} e conta ${conta} não cadastrada`)
    }

    await this.repository.remove(contaCadastrada);
    return ok({})

  }
}
