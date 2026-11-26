import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Censos } from './schemas/censos.schema';
import { isValidObjectId, Model } from 'mongoose';
import { CrearCensosDto } from './dto/crear-censos.dto';
import { ActualizarCensosDto } from './dto/actualizar-censos.dto';

@Injectable()
export class CensosService {
    //Inyecciondel modelo
    constructor(@InjectModel(Censos.name) private readonly censosModel: Model<Censos>) {}

    //Metodos CRUD

    //C - CREATE
    async crear(dto: CrearCensosDto) {
        this.validarFechas(dto.fechaApertura, dto.fechaCierre);
        return this.censosModel.create(dto);
    }

    //R - READ - todos
    async listar() {return this.censosModel.find();}
    //R - READ - uno
    async buscarPorId(id: string) {
        this.validarId(id);
        const censo = await this.censosModel.findById(id);
        if (!censo) {throw new NotFoundException('No se encontro el censo con el id buscado');}
        return censo;
    }

    //U - UPDATE
    async actualizar(id: string, dto: ActualizarCensosDto) {
        this.validarId(id);
        const censoActual = await this.censosModel.findById(id);
        if (!censoActual) {throw new NotFoundException('No se encontro el censo con el id buscado');}

        const fechaApertura = dto.fechaApertura ?? censoActual.fechaApertura;
        const fechaCierre = dto.fechaCierre ?? censoActual.fechaCierre;
        this.validarFechas(fechaApertura, fechaCierre);

        return this.censosModel.findByIdAndUpdate(id, dto, {returnDocument: 'after', runValidators: true});
    }

    //validacion del id
    private validarId(id: string) {
        if (!isValidObjectId(id)) throw new BadRequestException('El id no es valido');
    }

    //validaccion de las fechas
    private validarFechas(fechaApertura: string | Date, fechaCierre: string | Date) {
        if (new Date(fechaCierre) <= new Date(fechaApertura)) {
            throw new BadRequestException('La fecha de cierre debe ser posterior a la fecha de apertura');
        }
    }
}
