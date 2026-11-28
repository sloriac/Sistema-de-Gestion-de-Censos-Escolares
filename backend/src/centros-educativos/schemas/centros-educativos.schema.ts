import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { Zonas } from '../../zonas/schemas/zonas.schema';
import { Usuarios } from '../../usuarios/schemas/usuarios.schema';

export type CentrosEducativosDocument = HydratedDocument<CentrosEducativos>;

export enum TipoCentro {
    publico = 'publico',
    privado = 'privado',
}

@Schema()
export class CentrosEducativos {
    @Prop({required: true, trim: true})
    nombre: string;

    @Prop({required: true, unique: true, trim: true, uppercase: true, match: /^[A-Za-z0-9-]+$/})
    codigo: string;

    @Prop({required: true, type: String, enum: Object.values(TipoCentro)})
    tipo: TipoCentro;

    // Debe traer al menos una oferta
    @Prop({type: [String], required: true, validate: (ofertas: string[]) => ofertas.length > 0})
    ofertaEducativa: string[];

    @Prop({required: true, type: MongooseSchema.Types.ObjectId, ref: Zonas.name})
    zonaId: Types.ObjectId;

    @Prop({type: MongooseSchema.Types.ObjectId, ref: Usuarios.name})
    directorId?: Types.ObjectId;

    @Prop({type: MongooseSchema.Types.ObjectId, ref: Usuarios.name})
    tecnicoId?: Types.ObjectId;
}

export const CentrosEducativosSchema = SchemaFactory.createForClass(CentrosEducativos);