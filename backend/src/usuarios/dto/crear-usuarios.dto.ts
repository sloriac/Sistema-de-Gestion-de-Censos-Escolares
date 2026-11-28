import { Transform } from "class-transformer";
import { RolUsuario } from "../schemas/usuarios.schema";
import { IsBoolean, IsEmail, IsIn, IsMongoId, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class CrearUsuariosDto {
    @Transform(({value}) => typeof value === 'string' ? value.trim(): value)
    @IsString({message: 'El nombre debe ser texto'})
    @IsNotEmpty({message: 'El nombre no puede estar vacío'})
    @MinLength(2, {message: 'El nombre debe tener al menos 2 letras'})
    nombre: string;

    @Transform(({value}) => typeof value === 'string' ? value.trim().toLowerCase(): value)
    @IsEmail({}, {message: 'El correo debe tener el formato name@mep.go.cr'})
    @Matches(/^[a-zA-Z0-9._-]+@mep\.go\.cr$/, {message: 'El correo debe terminar en @mep.go.cr'})
    correoInstitucional: string;

    @IsString({message: 'La contraseña debe ser texto'})
    @IsNotEmpty({message: 'La contraseña no puede estar vacía'})    
    contrasena: string;

    @IsIn([RolUsuario.tecnicoDae, RolUsuario.supervisor, RolUsuario.director], {message: 'El rol puede ser únicamente Técnico DAE, Supervisor o Director'})
    rol: RolUsuario;

    @IsOptional()
    @IsBoolean({message: 'El estado únicamente puede ser activo o inactivo'})
    estado?: boolean;

    @IsOptional()
    @IsMongoId({message: 'La zona no es válida'})
    zonaId?: string;

}
