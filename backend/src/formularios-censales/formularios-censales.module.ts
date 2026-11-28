import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FormulariosCensalesService } from './formularios-censales.service';
import { FormulariosCensalesController } from './formularios-censales.controller';
import { FormulariosCensales, FormulariosCensalesSchema } from './schemas/formularios-censales.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: FormulariosCensales.name, schema: FormulariosCensalesSchema }])],
  controllers: [FormulariosCensalesController],
  providers: [FormulariosCensalesService],
})
export class FormulariosCensalesModule {}