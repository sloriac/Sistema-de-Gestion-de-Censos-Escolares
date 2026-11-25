import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, HydratedDocument } from "mongoose";
import { Zonas } from "../../zonas/schemas/zonas.schema";
export type UsuariosDocument = HydratedDocument<Usuarios>;
export enum RolUsuario {
    jefaturaDae = 'Jefatura DAE',
    tecnicoDae = 'Tecnico DAE',
    director = 'Director',
    supervisor = 'Supervisor'
}

@Schema()
export class Usuarios{
    @Prop({required: true, trim: true, minlength: 2})
    nombre: string
    @Prop({required: true, unique: true, trim: true, lowercase: true, match: /^[a-zA-Z0-9._-]+@mep\.go\.cr$/})
    correoInstitucional: string
    @Prop({required: true})
    contrasena: string
    @Prop({required: true, type: String, enum: Object.values(RolUsuario)})
    rol: RolUsuario
    @Prop({required: true})
    estado: boolean
    @Prop({type: Types.ObjectId, ref: Zonas.name})
    zonaId?: Types.ObjectId
    
}

export const UsuariosSchema = SchemaFactory.createForClass(Usuarios);