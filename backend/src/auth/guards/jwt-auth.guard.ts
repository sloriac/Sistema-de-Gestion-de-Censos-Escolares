import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuarios, UsuariosDocument } from '../../usuarios/schemas/usuarios.schema';
import { ES_PUBLICO } from '../decorators/publico.decorator';

// Verifica que la petición traiga un token válido
@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService,
        @InjectModel(Usuarios.name) private readonly usuariosModel: Model<UsuariosDocument>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const esPublico = this.reflector.getAllAndOverride<boolean>(ES_PUBLICO, [context.getHandler(), context.getClass()]);
        if (esPublico) return true;

        const request = context.switchToHttp().getRequest();
        // El encabezado llega así: "Bearer elToken"
        const [tipo, token] = request.headers.authorization?.split(' ') ?? [];
        if (tipo !== 'Bearer' || !token) throw new UnauthorizedException('Debe iniciar sesión');

        let payload: { sub: string };
        try {
            payload = await this.jwtService.verifyAsync<{ sub: string }>(token);
        } catch {
            throw new UnauthorizedException('La sesión no es válida o ya expiró');
        }

        // Se consulta la base para aplicar de inmediato desactivaciones y cambios de rol
        const usuario = await this.usuariosModel.findById(payload.sub).select('-contrasena');
        if (!usuario || !usuario.estado) throw new UnauthorizedException('La cuenta no existe o está inactiva');

        request.usuario = {
            id: usuario.id,
            nombre: usuario.nombre,
            correoInstitucional: usuario.correoInstitucional,
            rol: usuario.rol,
        };
        return true;
    }
}