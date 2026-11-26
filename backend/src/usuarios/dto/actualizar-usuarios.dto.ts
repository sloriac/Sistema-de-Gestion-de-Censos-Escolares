import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CrearUsuariosDto } from "./crear-usuarios.dto";

export class ActualizarUsuariosDto extends PartialType(OmitType(CrearUsuariosDto, ['rol', 'contrasena'] as const)) {}