import { Module } from '@nestjs/common';
import { CensosService } from './censos.service';
import { CensosController } from './censos.controller';

@Module({
  controllers: [CensosController],
  providers: [CensosService],
})
export class CensosModule {}
