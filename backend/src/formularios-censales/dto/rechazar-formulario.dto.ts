import { Transform } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

export class RechazarFormularioDto {
    @Transform(({value}) => typeof value === 'string' ? value.trim() : value)
    @IsString({message: 'El motivo debe ser texto'})
    @MinLength(10, {message: 'El motivo debe tener al menos 10 caracteres'})
    motivoRechazo: string;
}