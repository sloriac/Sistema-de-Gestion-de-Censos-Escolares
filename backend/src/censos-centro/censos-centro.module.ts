import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CensosCentroService } from './censos-centro.service';
import { CensosCentroController } from './censos-centro.controller';
import { CensosCentro, CensosCentroSchema } from './schemas/censos-centro.schema';

@Module({
  imports:  [MongooseModule.forFeature([{ name: CensosCentro.name, schema: CensosCentroSchema }])],
  controllers: [CensosCentroController],
  providers: [CensosCentroService],
})
export class CensosCentroModule {}
