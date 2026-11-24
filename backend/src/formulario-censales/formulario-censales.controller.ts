import { Controller } from '@nestjs/common';
import { FormularioCensalesService } from './formulario-censales.service';

@Controller('formulario-censales')
export class FormularioCensalesController {
  constructor(private readonly formularioCensalesService: FormularioCensalesService) {}
}
