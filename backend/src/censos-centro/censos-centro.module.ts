import { Module } from '@nestjs/common';
import { CensosCentroService } from './censos-centro.service';
import { CensosCentroController } from './censos-centro.controller';

@Module({
  controllers: [CensosCentroController],
  providers: [CensosCentroService],
})
export class CensosCentroModule {}
