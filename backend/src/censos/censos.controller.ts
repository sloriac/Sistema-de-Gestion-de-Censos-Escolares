import { Controller } from '@nestjs/common';
import { CensosService } from './censos.service';

@Controller('censos')
export class CensosController {
  constructor(private readonly censosService: CensosService) {}
}
