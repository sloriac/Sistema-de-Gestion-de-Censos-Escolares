import { Module } from '@nestjs/common';
import { ZonasService } from './zonas.service';
import { ZonasController } from './zonas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Zonas, ZonasSchema } from './schemas/zonas.schema';


@Module({
  imports: [MongooseModule.forFeature([{ name: Zonas.name, schema: ZonasSchema}])],
  controllers: [ZonasController],
  providers: [ZonasService],
})
export class ZonasModule {}
