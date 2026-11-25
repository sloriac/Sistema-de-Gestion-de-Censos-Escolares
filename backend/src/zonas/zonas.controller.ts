import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ZonasService } from './zonas.service';
import { CrearZonasDto } from './dto/crear-zonas.dto';
import { ActualizarZonasDto } from './dto/actualizar-zonas.dto';

@Controller('zonas')
export class ZonasController {
  constructor(private readonly zonasService: ZonasService) {}

  @Post()
  crear(@Body() dto: CrearZonasDto) {return this.zonasService.crear(dto);}
  @Get()
  listar() {return this.zonasService.listar()}
  @Get(':id')
  buscarPorId(@Param('id') id: string) {return this.zonasService.buscarPorId(id);}
  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() dto: ActualizarZonasDto) {return this.zonasService.actualizar(id, dto);}
  @Delete(':id')
  eliminar(@Param('id') id: string) {return this.zonasService.eliminar(id);}
}