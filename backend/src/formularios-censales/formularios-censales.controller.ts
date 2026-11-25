import { Controller } from '@nestjs/common';
import { FormulariosCensalesService } from './formularios-censales.service';

@Controller('formularios-censales')
export class FormulariosCensalesController {
  constructor(private readonly formulariosCensalesService: FormulariosCensalesService) {}
}
