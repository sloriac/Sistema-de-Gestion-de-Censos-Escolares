import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type CensosDocument = HydratedDocument<Censos>;

export enum EstadosCenso { 
    programado = 'programado',
    abierto = 'abierto',
    cerrado = 'cerrado'
}

@Schema()
export class Censos {
    @Prop({required: true, type: MongooseSchema.Types.ObjectId, ref: 'FormulariosCensales'})
    formularioId: Types.ObjectId;

    @Prop({type: Date, required: true})
    fechaApertura: Date;

    @Prop({type: Date, required: true})
    fechaCierre: Date;

    @Prop({required: true})
    periodo: string;

    @Prop({enum: Object.values(EstadosCenso), type: String, required: true, default: EstadosCenso.programado})
    estado: EstadosCenso;

}

export const CensosSchema = SchemaFactory.createForClass(Censos);