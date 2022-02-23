import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';


@Entity({ name: 'portador' })
export class Portador {

  @ApiProperty({ description: 'Nome completo do portador' })
  @Column({
    name: 'nome_completo',
    type: 'varchar',
    length: '100',
    nullable: false,
  })
  nomeCompleto: string;

  @ApiProperty({ description: 'CPF válido do portador'})
  @PrimaryColumn({
    name: 'cpf',
    type: 'varchar',
    length: '11',
    unique: true,
  })
  cpf: string;
}
