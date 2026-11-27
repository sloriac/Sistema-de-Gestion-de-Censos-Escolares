import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolUsuario } from '../../usuarios/schemas/usuarios.schema';
import { ROLES } from '../decorators/roles.decorator';

// Verifica que el rol del usuario tenga permiso para la ruta
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.getAllAndOverride<RolUsuario[]>(ROLES, [context.getHandler(), context.getClass()]);
        // Sin @Roles, basta con haber iniciado sesión
        if (!roles) return true;

        const { usuario } = context.switchToHttp().getRequest();
        if (!usuario || !roles.includes(usuario.rol)) {
            throw new ForbiddenException('No tiene permiso para realizar esta acción');
        }
        return true;
    }
}