import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Usuarios, UsuariosDocument } from './schemas/usuarios.schema';
import { isValidObjectId, Model } from 'mongoose';
import { CrearUsuariosDto } from './dto/crear-usuarios.dto';
import bcrypt from 'bcrypt';
import { ActualizarUsuariosDto } from './dto/actualizar-usuarios.dto';
import { CambiarUsuariosDto } from './dto/cambiar-usuarios.dto';

const saltRounds = 10;

@Injectable()
export class UsuariosService {
    //Inyeccion del modelo
    constructor(@InjectModel(Usuarios.name) private readonly usuariosModel: Model<UsuariosDocument>,) {}

    //Metodos CRUD

    //C - CREATE
    async crear(dto: CrearUsuariosDto) {
        const correoExistente = await this.usuariosModel.findOne({ correoInstitucional: dto.correoInstitucional})
        if (correoExistente) {throw new ConflictException('El correo institucional ingresado ya se encuentra en la base de datos');}
        const contrasenaHasheada = await bcrypt.hash(dto.contrasena, saltRounds); 
        const usuarioCreado = await this.usuariosModel.create({...dto, contrasena: contrasenaHasheada, estado: dto.estado?? true});  
        const objetoUsuarioACrear = usuarioCreado.toObject()
        const { contrasena, ...usuarioSinContrasena } = objetoUsuarioACrear;
        return usuarioSinContrasena;
    }
    //R - READ 
    async listar() {return this.usuariosModel.find().select('-contrasena')}
    //R - READ - un usuario
    async buscarPorId(id: string) {
        this.validarId(id);
        const usuario = await this.usuariosModel.findById(id).select('-contrasena');
        if (!usuario) throw new NotFoundException('El usuario no existe en la base de datos');
        return usuario;
    }
    //U - UPDATE
    async actualizar(id: string, dto: ActualizarUsuariosDto) {
        this.validarId(id);
        if (dto.correoInstitucional) {
            const correoBuscado = await this.usuariosModel.findOne({
                correoInstitucional: dto.correoInstitucional, _id: {$ne: id}});
            if (correoBuscado) {throw new ConflictException('Ya hay un usuario con este correo electronico')};
        }
        const usuario = await this.usuariosModel.findByIdAndUpdate(id, dto, {
            returnDocument: 'after',
            runValidators: true,
        }).select('-contrasena');
        if (!usuario) throw new NotFoundException('El usuario no existe en la base de datos');
        return usuario;
    }

    //U - UPDATE 
    async cambiarRol(id: string, dto: CambiarUsuariosDto) {
        this.validarId(id);
        const usuario = await this.usuariosModel.findByIdAndUpdate(id, dto, {
            returnDocument: 'after',
            runValidators: true,
        }).select('-contrasena');
        if (!usuario) {throw new NotFoundException('El usuario buscado no se encuentra en la base de datos');}
        return usuario;
    }


    //validacion del id
    private validarId(id: string) {
        if (!isValidObjectId(id)) throw new BadRequestException('El id no es valido');
    }
}
