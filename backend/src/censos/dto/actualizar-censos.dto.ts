import { PartialType, PickType } from "@nestjs/mapped-types";
import { CrearCensosDto } from "./crear-censos.dto";

export class ActualizarCensosDto extends PartialType(PickType(CrearCensosDto, ['fechaApertura', 'fechaCierre'] as const)) {}