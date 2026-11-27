import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import bcrypt from 'bcrypt';
import { Usuarios, UsuariosDocument } from '../usuarios/schemas/usuarios.schema';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Usuarios.name) private readonly usuariosModel: Model<UsuariosDocument>,
        private readonly jwtService: JwtService,
    ) {}

    async login(dto: LoginDto) {
        const usuario = await this.usuariosModel.findOne({ correoInstitucional: dto.correoInstitucional });
        if (!usuario) throw new UnauthorizedException('Correo electrónico no registrado');

        // compare hashea lo digitado y lo compara con el hash guardado
        const contrasenaCorrecta = await bcrypt.compare(dto.contrasena, usuario.contrasena);
        if (!contrasenaCorrecta) throw new UnauthorizedException('Contraseña incorrecta');

        if (!usuario.estado) throw new ForbiddenException('La cuenta está inactiva');

        const token = await this.jwtService.signAsync({ sub: usuario.id, rol: usuario.rol });
        return {
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                correoInstitucional: usuario.correoInstitucional,
                rol: usuario.rol,
            },
        };
    }
}