import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { IsCPF } from 'src/decorators/cpf.decorator';

export class CreatePortadorDto {
  
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  nomeCompleto: string;

  @ApiProperty({ type: String, format: '00000000000', maxLength: 11 })
  @IsCPF({ message: 'CPF Inválido' })
  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  cpf: string;
}
