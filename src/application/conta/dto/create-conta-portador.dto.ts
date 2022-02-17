import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";
import { IsCPF } from "./../../../decorators/cpf.decorator";

export class CreateContaPortadorDto {
    @ApiProperty({ type: String, format: '00000000000', maxLength: 11 })
    @IsCPF({ message: 'CPF Inválido' })
    @IsString()
    @IsNotEmpty()
    @Length(11, 11)
    cpf: string;
}
