import { Module } from '@nestjs/common';
import { FormularioCensalesService } from './formulario-censales.service';
import { FormularioCensalesController } from './formulario-censales.controller';

@Module({
  controllers: [FormularioCensalesController],
  providers: [FormularioCensalesService],
})
export class FormularioCensalesModule {}
