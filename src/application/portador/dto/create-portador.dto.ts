import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePortadorDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  cpf: string;
}
