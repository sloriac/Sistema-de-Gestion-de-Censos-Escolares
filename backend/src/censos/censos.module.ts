import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Censos, CensosSchema } from './schemas/censos.schema';
import { CensosService } from './censos.service';
import { CensosController } from './censos.controller';

@Module({
  imports: [MongooseModule.forFeature([{name: Censos.name, schema: CensosSchema}])],
  controllers: [CensosController],
  providers: [CensosService],
})
export class CensosModule {}
