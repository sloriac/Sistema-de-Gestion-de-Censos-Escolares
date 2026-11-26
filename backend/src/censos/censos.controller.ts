import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CensosService } from './censos.service';
import { CrearCensosDto } from './dto/crear-censos.dto';
import { ActualizarCensosDto } from './dto/actualizar-censos.dto';

@Controller('censos')
export class CensosController {
  constructor(private readonly censosService: CensosService) {}

  @Post()
  crear(@Body() dto: CrearCensosDto) {return this.censosService.crear(dto);}
  @Get()
  listar() {return this.censosService.listar();}
  @Get(':id')
  buscarPorId(@Param('id') id: string) {return this.censosService.buscarPorId(id)}
  @Put(':id/fechas')
  actualizar(@Param('id') id: string, @Body() dto: ActualizarCensosDto) {return this.censosService.actualizar(id, dto);}


}

