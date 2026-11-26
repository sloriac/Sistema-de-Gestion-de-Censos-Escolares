import { Allow, IsNotEmpty, IsString } from 'class-validator';

export class RespuestaDto {
    @IsString({message: 'La seccion debe ser texto'})
    @IsNotEmpty({message: 'La seccion no puede estar vacia'})
    seccion: string;

    @IsString({message: 'El nombre del campo debe ser texto'})
    @IsNotEmpty({message: 'El nombre del campo no puede estar vacio'})
    nombreCampo: string;

    //acepta cualquier tipo y no es obligatorio en un borrador
    @Allow()
    valor?: unknown;
}