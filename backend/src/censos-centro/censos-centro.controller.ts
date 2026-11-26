import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CensosCentroService } from './censos-centro.service';
import { CrearCensosCentroDto } from './dto/crear-censos-centro.dto';
import { ActualizarCensosCentroDto } from './dto/actualizar-censos-centro.dto';

@Controller('censos-centro')
export class CensosCentroController {
  constructor(private readonly censosCentroService: CensosCentroService) {}

  @Post()
  crear(@Body() dto: CrearCensosCentroDto) {return this.censosCentroService.crear(dto);}
  @Get()
  listar() {return this.censosCentroService.listar();}
  @Get(':id')
  buscarPorId(@Param('id') id: string) {return this.censosCentroService.buscarPorId(id);}
  @Put(':id')
  actualizar(@Param('id') id: string, @Body() dto: ActualizarCensosCentroDto) {return this.censosCentroService.actualizar(id, dto);}
}
