import { Controller } from '@nestjs/common';
import { CentrosEducativosService } from './centros-educativos.service';

@Controller('centros-educativos')
export class CentrosEducativosController {
  constructor(private readonly centrosEducativosService: CentrosEducativosService) {}
}
