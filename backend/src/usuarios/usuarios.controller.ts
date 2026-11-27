import { Body, Controller, ForbiddenException, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CrearUsuariosDto } from './dto/crear-usuarios.dto';
import { ActualizarUsuariosDto } from './dto/actualizar-usuarios.dto';
import { CambiarUsuariosDto } from './dto/cambiar-usuarios.dto';
import { RolUsuario } from './schemas/usuarios.schema';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsuarioActual } from '../auth/decorators/usuario-actual.decorator';
import type { UsuarioSesion } from '../auth/decorators/usuario-actual.decorator';

@Roles(RolUsuario.jefaturaDae)
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
  cambiarRol(@Param('id') id: string, @Body() dto: CambiarUsuariosDto, @UsuarioActual() usuario: UsuarioSesion) {
    if (id.toLowerCase() === usuario.id) throw new ForbiddenException('No puede cambiar su propio rol');
    return this.usuariosService.cambiarRol(id, dto);
  }
}