import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'portador' })
export class Portador {
  @Column({
    name: 'nome_completo',
    type: 'varchar',
    length: '100',
    nullable: false,
  })
  nomeCompleto: string;

  @PrimaryColumn({
    name: 'cpf',
    type: 'varchar',
    length: '11',
    unique: true,
  })
  cpf: string;
}
