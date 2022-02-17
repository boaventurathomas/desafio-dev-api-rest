import { Injectable, Logger } from '@nestjs/common';
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

  private async findContaByIndex(agencia: string, conta: string) {
    return await this.repository.findOne({
      where: {
        agencia: agencia,
        conta: conta
      }
    });
  }

  async create(createContaDto: CreateContaDto) {
    try {
      const contaCadastrada = await this.findContaByIndex(createContaDto.agencia, createContaDto.conta)

      if (contaCadastrada) {
        return badRequest(`Agência ${createContaDto.agencia} e conta ${createContaDto.conta} já cadastrada`);
      } else {
        const createdconta = await this.repository.create(createContaDto)
        return created(await this.repository.save(createdconta))
      }
    } catch (e) {
      Logger.error(e)
      return serverError();
    }
  }

  async findOne(agencia: string, conta: string) {
    try {
      const contaCadastrada = await this.findContaByIndex(agencia, conta)
      if (contaCadastrada) {
        return ok(contaCadastrada);
      } else {
        return notFound(`Agência ${agencia} e conta ${conta} não cadastrada`)
      }
    } catch (e) {
      Logger.error(e)
      return serverError();
    }
  }

  async update(agencia: string, conta: string, updateContaDto: UpdateContaDto) {
    try {
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
    } catch (e) {
      Logger.error(e)
      return serverError();
    }
  }

  async remove(agencia: string, conta: string) {
    try {
      const contaCadastrada = await this.findContaByIndex(agencia, conta)

      if (!contaCadastrada) {
        return notFound(`Agência ${agencia} e conta ${conta} não cadastrada`)
      }

      await this.repository.remove(contaCadastrada);
      return ok({})
    } catch (e) {
      Logger.error(e)
      return serverError();
    }
  }
}
