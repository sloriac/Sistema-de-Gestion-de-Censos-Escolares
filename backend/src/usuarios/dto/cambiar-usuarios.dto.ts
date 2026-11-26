import { PickType } from "@nestjs/mapped-types";
import { CrearUsuariosDto } from "./crear-usuarios.dto";

export class CambiarUsuariosDto extends PickType(CrearUsuariosDto, ['rol'] as const) {}