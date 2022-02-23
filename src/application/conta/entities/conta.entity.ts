import { Portador } from "./../../../application/portador/entities/portador.entity";
import { Transacao } from "./../../../application/transacao/entities/transacao.entity";
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity('conta')
export class Conta {

  @ApiProperty({ description: 'Número da agência da conta', type: 'string', format: '0000', maxLength: 4, minLength: 4 })
  @Index()
  @PrimaryColumn({
    name: 'agencia',
    type: 'varchar',
    length: '4',
    nullable: false,
  })
  agencia?: string;

  @ApiProperty({ description: 'Número da conta', type: 'string', format: '000000000', maxLength: 8, minLength: 8 })
  @Index()
  @PrimaryColumn({
    name: 'conta',
    type: 'varchar',
    length: '8',
    nullable: false,
  })
  conta?: string;

  @ApiProperty({ description: 'Saldo da conta', type: 'decimal', format: '0.00' })
  @Column({
    name: 'saldo',
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,

  })
  saldo?: number;

  @ApiProperty({ description: 'Limite de saque diário da conta', type: 'decimal', format: '0.00' })
  @Column({
    name: 'limite_saque_diario',
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 2000
  })
  limiteSaqueDiario?: number;
  
  @ApiProperty({ description: 'Conta ativa', type: 'decimal', format: '0.00' })
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
