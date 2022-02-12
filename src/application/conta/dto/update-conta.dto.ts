import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateContaDto {
    @ApiProperty({ type: Boolean })
    @IsBoolean()
    ativo: boolean;
}
