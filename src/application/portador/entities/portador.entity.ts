import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Portador {
  @PrimaryGeneratedColumn()
  idPortador: number;

  @Column()
  nome: string;

  @Column()
  cpf: string;

  @Column({ default: true })
  ativo: boolean;
}
