import { PartialType } from '@nestjs/mapped-types';
import { CreatePortadorDto } from './create-portador.dto';

export class UpdatePortadorDto extends PartialType(CreatePortadorDto) {}
