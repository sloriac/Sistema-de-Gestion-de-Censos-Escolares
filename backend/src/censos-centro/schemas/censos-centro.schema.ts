import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { Usuarios } from '../../usuarios/schemas/usuarios.schema';

export type CensosCentroDocument = HydratedDocument<CensosCentro>;
export enum EstadoCensosCentro {
    borrador = 'borrador',
    enviado = 'enviado',
    conObservaciones = 'con_observaciones',
    aprobado = 'aprobado',
    rechazado = 'rechazado',
}

@Schema({_id: false})
export class Respuesta {
    @Prop({required: true, trim: true})
    seccion: string;

    @Prop({required: true, trim: true})
    nombreCampo: string;

    @Prop({type: MongooseSchema.Types.Mixed})
    valor?: unknown;
}
export const RespuestaSchema = SchemaFactory.createForClass(Respuesta);

@Schema({_id: false})
export class Observacion {
    @Prop({required: true, trim: true})
    mensaje: string;
    @Prop({required: true, type: MongooseSchema.Types.ObjectId, ref: Usuarios.name})
    autorId: Types.ObjectId;
    @Prop({required: true, default: Date.now})
    fecha: Date;
}
export const ObservacionSchema = SchemaFactory.createForClass(Observacion);

@Schema()
export class CensosCentro {
    @Prop({required: true, type: MongooseSchema.Types.ObjectId, ref: 'Censos'})
    censoId: Types.ObjectId;
    @Prop({required: true, type: MongooseSchema.Types.ObjectId, ref: 'CentrosEducativos'})
    centroEducativoId: Types.ObjectId;
    @Prop({type: [RespuestaSchema], default: []})
    respuestas: Respuesta[];
    @Prop({required: true, type: String, enum: Object.values(EstadoCensosCentro), default: EstadoCensosCentro.borrador})
    estado: EstadoCensosCentro;
    @Prop()
    fechaEnvio?: Date;
    @Prop({required: true, default: Date.now})
    ultimaModificacion: Date;
    @Prop({type: MongooseSchema.Types.ObjectId, ref: Usuarios.name})
    eviadoPor?: Types.ObjectId;
    @Prop({type: [ObservacionSchema], default: []})
    observaciones: Observacion[];
}

export const CensosCentroSchema = SchemaFactory.createForClass(CensosCentro);

//un unico censo por centro
CensosCentroSchema.index({censoId: 1, CentrosEducativoId: 1}, {unique: true});