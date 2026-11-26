import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CensosCentro, CensosCentroDocument } from './schemas/censos-centro.schema';
import { CrearCensosCentroDto } from './dto/crear-censos-centro.dto';
import { ActualizarCensosCentroDto } from './dto/actualizar-censos-centro.dto';

@Injectable()
export class CensosCentroService {
    //Inyeccion del modelo
    constructor(@InjectModel(CensosCentro.name) private readonly censosCentroModel: Model<CensosCentroDocument>) {}
    
    //Metodos CRUD
    
    //C - CREATE
    async crear(dto: CrearCensosCentroDto) {
        const registroExistente = await this.censosCentroModel.findOne({censoId: dto.censoId, centroEducativoId: dto.centroEducativoId});
        if (registroExistente) throw new ConflictException('Este centro ya tiene un registro para este censo');
        return this.censosCentroModel.create(dto);
    }

    //R - READ - todos
    async listar() {return this.censosCentroModel.find();}
    //R - READ - uno
    async buscarPorId(id: string) {
        this.validarId(id);
        const censoCentro = await this.censosCentroModel.findById(id);
        if (!censoCentro) throw new NotFoundException('El censo del centro no existe');
        return censoCentro;
    }
    //U - UPDATE
    async actualizar(id: string, dto: ActualizarCensosCentroDto) {
        this.validarId(id);
        const censoCentro = await this.censosCentroModel.findByIdAndUpdate(
            id,
            { ...dto, ultimaModificacion: new Date() },
            { returnDocument: 'after', runValidators: true },
        );
        if (!censoCentro) throw new NotFoundException('El censo del centro no existe');
        return censoCentro;
    }


    //validacion del id
    private validarId(id: string) {
        if (!isValidObjectId(id)) throw new BadRequestException('El id no es valido');
    }
}
