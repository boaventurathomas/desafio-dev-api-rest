import { Portador } from "./../../../application/portador/entities/portador.entity";
import { Transacao } from "./../../../application/transacao/entities/transacao.entity";
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

@Entity('conta')
export class Conta {
  @Index()
  @PrimaryColumn({
    name: 'agencia',
    type: 'varchar',
    length: '4',
    nullable: false,
  })
  agencia?: string;

  @Index()
  @PrimaryColumn({
    name: 'conta',
    type: 'varchar',
    length: '8',
    nullable: false,
  })
  conta?: string;

  @Column({
    name: 'saldo',
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,

  })
  saldo?: number;

  @Column({
    name: 'limite_saque_diario',
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 2000
  })
  limiteSaqueDiario?: number;

  @Column({
    name: 'ativo',
    type: 'boolean',
    default: true
  })
  ativo?: boolean;

  @ManyToOne(type => Portador, portador => portador.cpf)
  portador?: Portador;

  @OneToMany(() => Transacao, trasacao => trasacao.conta)
  transacoes?: Transacao[];
}
