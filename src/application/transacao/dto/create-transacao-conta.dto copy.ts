import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateTrasacaoContaDto {
    @ApiProperty({ type: String, format: '0000', maxLength: 4 })
    @IsString()
    @IsNotEmpty({message: 'Agência não informada'})
    @Length(4, 4, {message: 'A agência deve possuir 4 dígitos'})
    agencia: string;

    @ApiProperty({ type: String, format: '00000000', maxLength: 8 })
    @IsString()
    @IsNotEmpty({message: 'Conta não informada'})
    @Length(8, 8, {message: 'A conta deve possuir 8 dígitos'})
    conta: string;
}
