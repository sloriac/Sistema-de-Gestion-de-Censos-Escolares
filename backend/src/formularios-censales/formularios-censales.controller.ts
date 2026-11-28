import { Body, Controller, Get, HttpCode, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { FormulariosCensalesService } from './formularios-censales.service';
import { CrearFormulariosCensalesDto } from './dto/crear-formularios-censales.dto';
import { ActualizarFormulariosCensalesDto } from './dto/actualizar-formularios-censales.dto';
import { RechazarFormularioDto } from './dto/rechazar-formulario.dto';
import { FiltrarFormulariosDto } from './dto/filtrar-formularios.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsuarioActual } from '../auth/decorators/usuario-actual.decorator';
import type { UsuarioSesion } from '../auth/decorators/usuario-actual.decorator';
import { RolUsuario } from '../usuarios/schemas/usuarios.schema';
import { EstadoFormulario } from './schemas/formularios-censales.schema';

@Roles(RolUsuario.jefaturaDae)
@Controller('formularios')
export class FormulariosCensalesController {
  constructor(private readonly formulariosService: FormulariosCensalesService) {}

  @Post()
  crear(@Body() dto: CrearFormulariosCensalesDto, @UsuarioActual() usuario: UsuarioSesion) {return this.formulariosService.crear(dto, usuario.id);}

  @Get()
  listar(@Query() filtros: FiltrarFormulariosDto) {return this.formulariosService.listar(filtros);}

  // Va antes de ':id' para que "pendientes" no se tome como un id
  @Get('pendientes')
  listarPendientes() {return this.formulariosService.listar({estado: EstadoFormulario.pendiente});}

  @Get(':id')
  buscarPorId(@Param('id') id: string) {return this.formulariosService.buscarPorId(id);}

  @Put(':id')
  actualizar(@Param('id') id: string, @Body() dto: ActualizarFormulariosCensalesDto) {return this.formulariosService.actualizar(id, dto);}

  @Post(':id/validar')
  @HttpCode(200)
  validar(@Param('id') id: string) {return this.formulariosService.validar(id);}

  @Patch(':id/aprobar')
  aprobar(@Param('id') id: string, @UsuarioActual() usuario: UsuarioSesion) {return this.formulariosService.aprobar(id, usuario.id);}

  @Patch(':id/rechazar')
  rechazar(@Param('id') id: string, @Body() dto: RechazarFormularioDto) {return this.formulariosService.rechazar(id, dto.motivoRechazo);}
}