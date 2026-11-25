import { PartialType } from "@nestjs/mapped-types";
import { CrearZonasDto } from "./crear-zonas.dto";

export class ActualizarZonasDto extends PartialType(CrearZonasDto) {}