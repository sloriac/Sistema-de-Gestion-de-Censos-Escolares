import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Zonas, ZonasDocument } from './schemas/zonas.schema';
import { isValidObjectId, Model } from 'mongoose';
import { CrearZonasDto } from './dto/crear-zonas.dto';
import { ActualizarZonasDto } from './dto/actualizar-zonas.dto';

@Injectable()
export class ZonasService {
    //Inyeccion del modelo
    constructor(
        @InjectModel(Zonas.name) private readonly zonasModel: Model<ZonasDocument>,
    ) {}

    //Metodos CRUD

    //C - CREATE
    async crear(dto: CrearZonasDto) {return this.zonasModel.create(dto);}
    //R - READ - todas las zonas
    async listar() {return this.zonasModel.find();}
    //R - READ - una zona
    async buscarPorId(id: string) {
        this.validarId(id);
        const zona = await this.zonasModel.findById(id);
        if (!zona) throw new NotFoundException('La zona no existe o no esta registrada');
        return zona;
    }
    //U - UPDATE 
    async actualizar(id: string, dto: ActualizarZonasDto) {
        this.validarId(id);
        const zona = await this.zonasModel.findByIdAndUpdate(id, dto, {
            returnDocument: 'after', //zona actualizada
            runValidators: true, //aplica reglas del schema cuando actualiza
        });
        if (!zona) throw new NotFoundException('La zona no existe o no esta registrada');
        return zona;
    }
    //D - DELETE
    async eliminar(id: string) {
        this.validarId(id);
        const zona = await this.zonasModel.findByIdAndDelete(id);
        if (!zona) throw new NotFoundException('La zona no existe o no esta registrada');
        return {mensaje: 'Zona eliminada correctamente'};
    }
    //validacion del id
    private validarId(id: string) {
        if (!isValidObjectId(id)) throw new BadRequestException('El id no es valido');
    }
}