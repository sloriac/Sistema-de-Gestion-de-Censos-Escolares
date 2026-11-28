import { Transform, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CampoDto } from './campo.dto';

export class SeccionDto {
    @Transform(({value}) => typeof value === 'string' ? value.trim() : value)
    @IsString({message: 'El nombre de la seccion debe ser texto'})
    @IsNotEmpty({message: 'El nombre de la seccion no puede estar vacio'})
    nombre: string;

    @IsArray({message: 'Los campos deben ser una lista'})
    @ValidateNested({each: true})
    @Type(() => CampoDto)
    campos: CampoDto[];
}