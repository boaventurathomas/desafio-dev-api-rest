import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Portador {
  @PrimaryGeneratedColumn('uuid')
  idPortador: number;

  @Column({ name: 'nome', type: 'varchar', length: '100' })
  nome: string;

  @Column({ name: 'cpf', type: 'varchar', length: '11' })
  cpf: string;

  @Column({ name: 'ativo', default: true })
  ativo: boolean;
}
