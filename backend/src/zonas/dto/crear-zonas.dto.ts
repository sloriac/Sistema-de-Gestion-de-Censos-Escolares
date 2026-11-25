import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CrearZonasDto {
    @Transform(({value}) => typeof value === 'string' ? value.trim() : value)
    @IsString({message: 'El nombre debe ser texto'})
    @IsNotEmpty({message: 'El nombre de la zona es obligatorio'})
    nombre: string;

    @Transform(({value}) => typeof value === 'string' ? value.trim() : value)
    @IsString({message: 'El nombre de la region debe ser texto'})
    @IsNotEmpty({message: 'El nombre de la region es obligatorio'})
    region: string;
}