import { Module } from '@nestjs/common';
import { InconsistenciasService } from './inconsistencias.service';
import { InconsistenciasController } from './inconsistencias.controller';

@Module({
  controllers: [InconsistenciasController],
  providers: [InconsistenciasService],
})
export class InconsistenciasModule {}
