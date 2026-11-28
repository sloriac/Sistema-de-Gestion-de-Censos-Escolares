import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InconsistenciasController } from './inconsistencias.controller';
import { InconsistenciasService } from './inconsistencias.service';
import { Inconsistencias, InconsistenciasSchema } from './schemas/inconsistencias.schema';
import { CensosCentro, CensosCentroSchema } from '../censos-centro/schemas/censos-centro.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Inconsistencias.name, schema: InconsistenciasSchema },
      { name: CensosCentro.name, schema: CensosCentroSchema },
    ]),
  ],
  controllers: [InconsistenciasController],
  providers: [InconsistenciasService],
})
export class InconsistenciasModule {}