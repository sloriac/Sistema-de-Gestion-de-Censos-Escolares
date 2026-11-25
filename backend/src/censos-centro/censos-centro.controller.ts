import { Controller } from '@nestjs/common';
import { CensosCentroService } from './censos-centro.service';

@Controller('censos-centro')
export class CensosCentroController {
  constructor(private readonly censosCentroService: CensosCentroService) {}
}
