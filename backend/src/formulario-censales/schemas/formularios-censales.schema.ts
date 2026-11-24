import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';

@Schema ( )
export class FormulariosCensales {
    @Prop ({required: true, trim: true})
    nombre: String
    @Prop ()
    esPlantilla: Boolean
    @Prop ()
    motivoRechazo: String

}