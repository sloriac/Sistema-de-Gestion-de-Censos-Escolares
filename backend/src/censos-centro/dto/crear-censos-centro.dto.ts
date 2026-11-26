import { Type } from 'class-transformer';
import { IsArray, IsMongoId, IsOptional, ValidateNested } from 'class-validator';
import { RespuestaDto } from './respuesta.dto';

export class CrearCensosCentroDto {
    @IsMongoId({message: 'El censo no es valido'})
    censoId: string;

    @IsMongoId({message: 'El centro educativo no es valido'})
    centroEducativoId: string;

    @IsOptional()
    @IsArray({message: 'Las respuestas deben ser una lista'})
    @ValidateNested({each: true})
    @Type(() => RespuestaDto)
    respuestas?: RespuestaDto[]; 
}