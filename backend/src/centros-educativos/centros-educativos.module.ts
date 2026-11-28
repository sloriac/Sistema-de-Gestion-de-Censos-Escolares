
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CentrosEducativosService } from './centros-educativos.service';
import { CentrosEducativosController } from './centros-educativos.controller';
import { CentrosEducativos, CentrosEducativosSchema } from './schemas/centros-educativos.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: CentrosEducativos.name, schema: CentrosEducativosSchema }])],
  controllers: [CentrosEducativosController],
  providers: [CentrosEducativosService],
})
export class CentrosEducativosModule {}