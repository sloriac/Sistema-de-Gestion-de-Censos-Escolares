import { Module } from '@nestjs/common';
import { CentrosEducativosService } from './centros-educativos.service';
import { CentrosEducativosController } from './centros-educativos.controller';

@Module({
  controllers: [CentrosEducativosController],
  providers: [CentrosEducativosService],
})
export class CentrosEducativosModule {}
