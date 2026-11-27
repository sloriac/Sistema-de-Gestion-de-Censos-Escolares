import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RolUsuario } from '../../usuarios/schemas/usuarios.schema';

// Datos del usuario que hace la petición
export interface UsuarioSesion {
    id: string;
    nombre: string;
    correoInstitucional: string;
    rol: RolUsuario;
}

export const UsuarioActual = createParamDecorator(
    (_data: unknown, context: ExecutionContext): UsuarioSesion => context.switchToHttp().getRequest().usuario,
);