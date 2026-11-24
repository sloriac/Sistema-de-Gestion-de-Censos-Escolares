import { Module } from '@nestjs/common';
import { ZonasService } from './zonas.service';
import { ZonasController } from './zonas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { zonas, zonasSchema } from './schemas/zonas.schema';


@Module({
  imports: [MongooseModule.forFeature([{ name: zonas.name, schema: zonasSchema}])],
  controllers: [ZonasController],
  providers: [ZonasService],
})
export class ZonasModule {}
