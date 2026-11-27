import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class LoginDto {
    @Transform(({value}) => typeof value === 'string' ? value.trim().toLowerCase() : value)
    @Matches(/^[a-zA-Z0-9._-]+@mep\.go\.cr$/, {message: 'Correo electrónico inválido'})
    correoInstitucional: string;

    @IsString({message: 'La contraseña debe ser texto'})
    @IsNotEmpty({message: 'La contraseña no puede estar vacía'})
    contrasena: string;
}