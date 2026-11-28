import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Censos, CensosSchema } from './schemas/censos.schema';
import { CensosService } from './censos.service';
import { CensosController } from './censos.controller';
import { FormulariosCensales, FormulariosCensalesSchema } from '../formularios-censales/schemas/formularios-censales.schema';

@Module({
  imports: [MongooseModule.forFeature([
    {name: Censos.name, schema: CensosSchema},
    {name: FormulariosCensales.name, schema: FormulariosCensalesSchema},
  ])],
   controllers: [CensosController],
  providers: [CensosService],
})
export class CensosModule {}
