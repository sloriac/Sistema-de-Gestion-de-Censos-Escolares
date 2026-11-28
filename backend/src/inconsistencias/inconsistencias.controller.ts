import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { InconsistenciasService } from './inconsistencias.service';
import { CrearInconsistenciasDto } from './dto/crear-inconsistencias.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../usuarios/schemas/usuarios.schema';
import { UsuarioActual } from '../auth/decorators/usuario-actual.decorator';
import type { UsuarioSesion } from '../auth/decorators/usuario-actual.decorator';

@Roles(RolUsuario.tecnicoDae)
@Controller()
export class InconsistenciasController {
  constructor(
    private readonly inconsistenciasService: InconsistenciasService,
  ) {}

  @Post('censos-centro/:id/inconsistencias')
  crear(
    @Param('id') id: string,
    @UsuarioActual() usuario: UsuarioSesion,
    @Body() dto: CrearInconsistenciasDto,
  ) {return this.inconsistenciasService.crear(id, usuario.id, dto);}

  @Get('censos-centro/:id/inconsistencias')
  listarPorCenso(@Param('id') id: string) {
    return this.inconsistenciasService.listarPorCenso(id);
  }

  @Patch('inconsistencias/:id')
  marcarCorregida(@Param('id') id: string) {
    return this.inconsistenciasService.marcarCorregida(id);
  }

  @Post('censos-centro/:id/inconsistencias/devolver-con-observaciones')
  devolver(@Param('id') id: string) {
    return this.inconsistenciasService.devolver(id);
  }
}