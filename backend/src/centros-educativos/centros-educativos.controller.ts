
import { Controller, Get, Param } from '@nestjs/common';
import { CentrosEducativosService } from './centros-educativos.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsuarioActual } from '../auth/decorators/usuario-actual.decorator';
import type { UsuarioSesion } from '../auth/decorators/usuario-actual.decorator';
import { RolUsuario } from '../usuarios/schemas/usuarios.schema';

// Solo lectura: los centros vienen precargados del listado del MEP
@Controller('centros-educativos')
export class CentrosEducativosController {
  constructor(private readonly centrosEducativosService: CentrosEducativosService) {}

  @Roles(RolUsuario.jefaturaDae)
  @Get()
  listar() {return this.centrosEducativosService.listar();}

  // Va antes de ':id' para que "mi-centro" no se tome como un id
  @Roles(RolUsuario.director)
  @Get('mi-centro')
  miCentro(@UsuarioActual() usuario: UsuarioSesion) {return this.centrosEducativosService.buscarPorDirector(usuario.id);}

  @Roles(RolUsuario.jefaturaDae)
  @Get(':id')
  buscarPorId(@Param('id') id: string) {return this.centrosEducativosService.buscarPorId(id);}
}