import { Module } from '@nestjs/common';
import { FormulariosCensalesService } from './formularios-censales.service';
import { FormulariosCensalesController } from './formularios-censales.controller';

@Module({
  controllers: [FormulariosCensalesController],
  providers: [FormulariosCensalesService],
})
export class FormulariosCensalesModule {}
