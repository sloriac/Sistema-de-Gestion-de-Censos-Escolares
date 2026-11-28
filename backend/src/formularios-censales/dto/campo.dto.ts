import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { TipoDato } from '../schemas/formularios-censales.schema';

export class CampoDto {
    @Transform(({value}) => typeof value === 'string' ? value.trim() : value)
    @IsString({message: 'El nombre del campo debe ser texto'})
    @IsNotEmpty({message: 'El nombre del campo no puede estar vacio'})
    nombreCampo: string;

    @IsIn(Object.values(TipoDato), {message: 'El tipo de dato debe ser texto, numero, fecha o seleccion'})
    tipoDato: TipoDato;

    @IsBoolean({message: 'Obligatorio debe ser verdadero o falso'})
    obligatorio: boolean;
}