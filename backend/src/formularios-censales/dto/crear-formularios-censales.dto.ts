import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { SeccionDto } from './seccion.dto';

export class CrearFormulariosCensalesDto {
    @Transform(({value}) => typeof value === 'string' ? value.trim() : value)
    @IsString({message: 'El nombre debe ser texto'})
    @MinLength(5, {message: 'El nombre debe tener al menos 5 caracteres'})
    nombre: string;

    @IsOptional()
    @IsBoolean({message: 'esPlantilla debe ser verdadero o falso'})
    esPlantilla?: boolean;

    @IsOptional()
    @IsArray({message: 'Las secciones deben ser una lista'})
    @ValidateNested({each: true})
    @Type(() => SeccionDto)
    secciones?: SeccionDto[];
}