import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';

@Schema()
export class CentrosEducativos{
    @Prop({required: true, trim: true})
    nombre: string
    @Prop({required: })
    codigo: string
    @Prop()
    tipo: string
    @Prop()
    ofertaEducativa: String[]

}