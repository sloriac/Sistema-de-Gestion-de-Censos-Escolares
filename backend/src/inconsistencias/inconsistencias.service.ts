import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { EstadoInconsistencia, Inconsistencias, InconsistenciasDocument } from './schemas/inconsistencias.schema';
import { CensosCentro, CensosCentroDocument, EstadoCensosCentro } from '../censos-centro/schemas/censos-centro.schema';
import { CrearInconsistenciasDto } from './dto/crear-inconsistencias.dto';


@Injectable()
export class InconsistenciasService {
  constructor(
    @InjectModel(Inconsistencias.name)
    private readonly inconsistenciasModel: Model<InconsistenciasDocument>,
    @InjectModel(CensosCentro.name)
    private readonly censosCentroModel: Model<CensosCentroDocument>,
  ) {}

  private validarId(id: string): void {
    if (!isValidObjectId(id)) {throw new BadRequestException(`El ID "${id}" no es válido`);}
  }

  async crear(censoCentroId: string, tecnicoId: string, dto: CrearInconsistenciasDto) {
    this.validarId(censoCentroId);

    const censo = await this.censosCentroModel.findById(censoCentroId);
    if (!censo) {throw new NotFoundException('Censo de centro no encontrado');}

    if (censo.estado !== EstadoCensosCentro.enviado) {throw new BadRequestException('Solo se pueden registrar inconsistencias en censos enviados',);}

    return this.inconsistenciasModel.create({
      ...dto,
      censoCentroId: new Types.ObjectId(censoCentroId),
      tecnicoId: new Types.ObjectId(tecnicoId),
    });
  }

  async listarPorCenso(censoCentroId: string) {
    this.validarId(censoCentroId);

    const censo = await this.censosCentroModel.findById(censoCentroId);
    if (!censo) {throw new NotFoundException('Censo de centro no encontrado');}

    return this.inconsistenciasModel.find({censoCentroId: new Types.ObjectId(censoCentroId)});}

  async marcarCorregida(id: string) {
    this.validarId(id);

    const actualizada = await this.inconsistenciasModel.findByIdAndUpdate(
      id,
      { estado: EstadoInconsistencia.corregida },
      { returnDocument: 'after', runValidators: true },
    );

    if (!actualizada) {
      throw new NotFoundException('Inconsistencia no encontrada');
    }

    return actualizada;
  }

  async devolver(censoCentroId: string) {
    this.validarId(censoCentroId);

    const censo = await this.censosCentroModel.findById(censoCentroId);
    if (!censo) {throw new NotFoundException('Censo de centro no encontrado');}

    if (censo.estado !== EstadoCensosCentro.enviado) {throw new BadRequestException('Solo se pueden devolver censos que estén en estado enviado');}

    const hayPendientes = await this.inconsistenciasModel.exists({
      censoCentroId: new Types.ObjectId(censoCentroId),
      estado: EstadoInconsistencia.pendiente,
    });

    if (!hayPendientes) {
      throw new BadRequestException(
        'No se puede devolver el censo porque no tiene inconsistencias pendientes',
      );
    }

    censo.estado = EstadoCensosCentro.conObservaciones;
    censo.ultimaModificacion = new Date();
    return censo.save();
  }
}