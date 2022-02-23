import { Conta } from "./../../../application/conta/entities/conta.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity('transacao')
export class Transacao {

    @ApiProperty({ description: 'Identificador da transação', type: 'uuid' })
    @PrimaryGeneratedColumn('uuid', { name: 'id_transacao' })
    idTransacao: string;

    @ApiProperty({ description: 'Valor da transação', type: 'decimal' })
    @Column({
        name: 'valor',
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: false
    })
    valor: number;

    @ApiProperty({ description: 'Data da realização da transação', type: 'Date', format: 'yyyy-mm-dd', example: '2022-02-02' })
    @Column({
        name: 'data_transacao',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        nullable: false
    })
    dataTransacao: Date;

    @ManyToOne(type => Conta, { nullable: false })
    @JoinColumn([
        { name: 'agencia', referencedColumnName: 'agencia' },
        { name: 'conta', referencedColumnName: 'conta' },
    ])
    conta: Conta;
}
