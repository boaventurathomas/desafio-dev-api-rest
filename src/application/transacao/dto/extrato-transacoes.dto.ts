import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, Length } from 'class-validator';

export class ExtratoTransacoesDto {

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

    @ApiProperty({ type: String })
    @IsDateString()
    dataInicialPeriodo: string

    @ApiProperty({ type: String })
    @IsDateString()
    dataFinalPeriodo: string

}