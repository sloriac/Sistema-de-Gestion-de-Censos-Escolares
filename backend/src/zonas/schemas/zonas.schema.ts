import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';
export type ZonasDocument = HydratedDocument<zonas>;

@Schema()
export class zonas{
    @Prop({required:true, trim: true})
    nombre: String 
    
    @Prop({required:true, trim:true})
    region: String
}

export const zonasSchema = SchemaFactory.createForClass(zonas);