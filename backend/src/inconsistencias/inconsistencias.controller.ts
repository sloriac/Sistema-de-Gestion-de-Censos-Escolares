import { Controller } from '@nestjs/common';
import { InconsistenciasService } from './inconsistencias.service';

@Controller('inconsistencias')
export class InconsistenciasController {
  constructor(private readonly inconsistenciasService: InconsistenciasService) {}
}
