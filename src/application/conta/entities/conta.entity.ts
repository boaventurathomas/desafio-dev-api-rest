import { Portador } from "src/application/portador/entities/portador.entity";
import { Column, Entity, Index, ManyToOne, PrimaryColumn, Unique } from "typeorm";

@Entity('conta')
export class Conta {  
  @Index()
  @PrimaryColumn({
    name: 'agencia',
    type: 'varchar',
    length: '4',
    nullable: false,
  })
  agencia: string;
  
  @Index()
  @PrimaryColumn({
    name: 'conta',
    type: 'varchar',
    length: '8',
    nullable: false,
  })
  conta: string;

  @Column({
    name: 'saldo',
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0
  })
  saldo: number;

  @Column({
    name: 'ativo',
    type: 'boolean',
    default: true
  })
  ativo: boolean;

  @ManyToOne(type => Portador, portador => portador.cpf)
  portador: Portador;
}
