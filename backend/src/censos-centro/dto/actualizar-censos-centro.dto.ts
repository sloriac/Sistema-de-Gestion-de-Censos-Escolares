import { PickType } from '@nestjs/mapped-types';
import { CrearCensosCentroDto } from './crear-censos-centro.dto';

export class ActualizarCensosCentroDto extends PickType(CrearCensosCentroDto, ['respuestas'] as const) {}