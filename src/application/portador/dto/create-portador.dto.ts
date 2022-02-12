import { IsNotEmpty, IsString, Length } from 'class-validator';
import { IsCPF } from 'src/decorators/cpf.decorator';

export class CreatePortadorDto {
  @IsString()
  @IsNotEmpty()
  nomeCompleto: string;

  @IsCPF({message: 'CPF Inválido'})
  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  cpf: string;
}
