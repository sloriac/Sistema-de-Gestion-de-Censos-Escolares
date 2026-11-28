import { PartialType } from '@nestjs/mapped-types';
import { CrearFormulariosCensalesDto } from './crear-formularios-censales.dto';

export class ActualizarFormulariosCensalesDto extends PartialType(CrearFormulariosCensalesDto) {}