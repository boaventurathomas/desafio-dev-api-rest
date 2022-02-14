import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsObject, Min, ValidateNested } from "class-validator";
import { CreateTrasacaoContaDto } from "./create-transacao-conta.dto copy";

export class CreateTransacaoDto {
    @ApiProperty({ type: Number, format: '0.0' })
    @IsNumber({ maxDecimalPlaces: 2 }, { message: "Valor com formato inválido" })
    @IsNotEmpty({ message: "Valor não informado" })
    @Min(0.00, { message: "Valor mínimo é de 0.01" })
    valor: number;

    @ApiProperty({ type: CreateTrasacaoContaDto })
    @Type()
    @IsObject()
    @ValidateNested()
    conta: CreateTrasacaoContaDto
}
