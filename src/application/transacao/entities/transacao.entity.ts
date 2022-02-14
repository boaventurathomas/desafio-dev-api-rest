import { Conta } from "src/application/conta/entities/conta.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('transacao')
export class Transacao {

    @PrimaryGeneratedColumn('uuid', { name: 'id_transacao' })
    idTransacao: string;

    @Column({
        name: 'valor',
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: false
    })
    valor: number;

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
