import { SetMetadata } from '@nestjs/common';
import { RolUsuario } from '../../usuarios/schemas/usuarios.schema';

export const ROLES = 'roles';

// Indica qué roles pueden usar una ruta
export const Roles = (...roles: RolUsuario[]) => SetMetadata(ROLES, roles);