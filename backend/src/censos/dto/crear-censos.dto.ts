import { Transform } from "class-transformer";
import { IsDateString, IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class CrearCensosDto {
    @IsMongoId({message: 'El formulario no es valido'})
    formularioId: string;
    @IsDateString({}, {message: 'La fecha de apertura debe ser de tipo fecha'})
    fechaApertura: string;
    @IsDateString({}, {message: 'La fecha de cierre debe ser de tipo fecha'})
    fechaCierre: string;
    @IsString({message: 'El periodo debe ser texto'})
    @IsNotEmpty({message: 'El periodo no puede estar vacio'})
    @Transform(({value}) => typeof value === 'string' ? value.trim() : value)
    periodo: string;
}