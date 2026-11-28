import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CentrosEducativos, CentrosEducativosDocument } from './schemas/centros-educativos.schema';

@Injectable()
export class CentrosEducativosService {
    //Inyeccion del modelo
    constructor(@InjectModel(CentrosEducativos.name) private readonly centrosModel: Model<CentrosEducativosDocument>) {}

    //R - READ - todos, con los datos de su zona
    async listar() {return this.centrosModel.find().populate('zonaId').sort({nombre: 1});}

    //R - READ - uno
    async buscarPorId(id: string) {
        this.validarId(id);
        const centro = await this.centrosModel.findById(id).populate('zonaId');
        if (!centro) throw new NotFoundException('El centro educativo no existe');
        return centro;
    }

    //R - READ - el centro del Director logueado
    async buscarPorDirector(directorId: string) {
        const centro = await this.centrosModel.findOne({ directorId }).populate('zonaId');
        if (!centro) throw new NotFoundException('No tiene un centro educativo asignado');
        return centro;
    }

    //validacion del id
    private validarId(id: string) {
        if (!isValidObjectId(id)) throw new BadRequestException('El id no es valido');
    }
}