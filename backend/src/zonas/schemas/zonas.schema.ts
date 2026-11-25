import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';
export type ZonasDocument = HydratedDocument<Zonas>;

@Schema()
export class Zonas{
    @Prop({required:true, trim: true})
    nombre: string 
    
    @Prop({required:true, trim:true})
    region: string
}

export const ZonasSchema = SchemaFactory.createForClass(Zonas);