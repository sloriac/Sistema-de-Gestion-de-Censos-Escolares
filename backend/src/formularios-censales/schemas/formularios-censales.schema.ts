import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { Usuarios } from '../../usuarios/schemas/usuarios.schema';

export type FormulariosCensalesDocument = HydratedDocument<FormulariosCensales>;

export enum EstadoFormulario {
    borrador = 'borrador',
    pendiente = 'pendiente',
    aprobado = 'aprobado',
    rechazado = 'rechazado',
}

export enum TipoDato {
    texto = 'texto',
    numero = 'numero',
    fecha = 'fecha',
    seleccion = 'seleccion',
}

// Subdocumento: cada campo de una sección
@Schema({_id: false})
export class Campo {
    @Prop({required: true, trim: true})
    nombreCampo: string;

    @Prop({required: true, type: String, enum: Object.values(TipoDato)})
    tipoDato: TipoDato;

    @Prop({required: true})
    obligatorio: boolean;
}
export const CampoSchema = SchemaFactory.createForClass(Campo);

// Subdocumento: cada sección del formulario
@Schema({_id: false})
export class Seccion {
    @Prop({required: true, trim: true})
    nombre: string;

    @Prop({type: [CampoSchema], default: []})
    campos: Campo[];
}
export const SeccionSchema = SchemaFactory.createForClass(Seccion);

@Schema()
export class FormulariosCensales {
    @Prop({required: true, trim: true, minlength: 5})
    nombre: string;

    @Prop({required: true, default: false})
    esPlantilla: boolean;

    @Prop({required: true, type: String, enum: Object.values(EstadoFormulario), default: EstadoFormulario.borrador})
    estado: EstadoFormulario;

    // Obligatorio solo si el formulario está rechazado
    @Prop({
        type: String,
        trim: true,
        required: function (this: FormulariosCensales) {return this.estado === EstadoFormulario.rechazado;},
    })
    motivoRechazo?: string;

    @Prop({type: [SeccionSchema], default: []})
    secciones: Seccion[];

    @Prop({required: true, type: MongooseSchema.Types.ObjectId, ref: Usuarios.name})
    creadoPor: Types.ObjectId;

    @Prop({type: MongooseSchema.Types.ObjectId, ref: Usuarios.name})
    aprobadoPor?: Types.ObjectId;
}

export const FormulariosCensalesSchema = SchemaFactory.createForClass(FormulariosCensales);