import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CrearUsuariosDto } from './dto/crear-usuarios.dto';
import { ActualizarUsuariosDto } from './dto/actualizar-usuarios.dto';
import { CambiarUsuariosDto } from './dto/cambiar-usuarios.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  crear(@Body() dto: CrearUsuariosDto) {return this.usuariosService.crear(dto);}
  @Get()
  listar() {return this.usuariosService.listar()}
  @Get(':id')
  buscarPorId(@Param('id') id: string) {return this.usuariosService.buscarPorId(id);}
  @Put(':id')
  actualizar(@Param('id') id: string, @Body() dto: ActualizarUsuariosDto) {return this.usuariosService.actualizar(id, dto);}
  @Patch(':id/rol')
  cambiarRol(@Param('id') id: string, @Body() dto:CambiarUsuariosDto) {return this.usuariosService.cambiarRol(id, dto);}
}