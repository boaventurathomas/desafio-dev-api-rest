import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsObject, IsString, Length, ValidateNested } from "class-validator";
import { Portador } from "src/application/portador/entities/portador.entity";
import { CreateContaPortadorDto } from "./create-conta-portador.dto";

export class CreateContaDto {
    @ApiProperty({ type: String, format: '0000', maxLength: 4 })
    @IsString()
    @IsNotEmpty()
    @Length(4, 4)
    agencia: string;

    @ApiProperty({ type: String, format: '00000000', maxLength: 8 })
    @IsString()
    @IsNotEmpty()
    @Length(8, 8)
    conta: string;

    @ApiProperty({ type: CreateContaPortadorDto })
    @Type()
    @IsObject()
    @ValidateNested()
    portador: CreateContaPortadorDto
}
