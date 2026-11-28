import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CensosCentro } from '../../censos-centro/schemas/censos-centro.schema';
import { Usuarios } from '../../usuarios/schemas/usuarios.schema';

export type InconsistenciasDocument = HydratedDocument<Inconsistencias>;

export enum EstadoInconsistencia {
  pendiente = 'pendiente',
  corregida = 'corregida',
}

@Schema()
export class Inconsistencias {
  @Prop({ type: Types.ObjectId, ref: CensosCentro.name, required: true })
  censoCentroId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  campoAfectado: string;

  @Prop({ required: true, trim: true })
  descripcion: string;

  @Prop({type: String, enum: EstadoInconsistencia, required: true, default: EstadoInconsistencia.pendiente})
  estado: EstadoInconsistencia;

  @Prop({ type: Types.ObjectId, ref: Usuarios.name, required: true })
  tecnicoId: Types.ObjectId;

  @Prop({ type: Date, required: true, default: Date.now })
  fecha: Date;
}

export const InconsistenciasSchema = SchemaFactory.createForClass(Inconsistencias);