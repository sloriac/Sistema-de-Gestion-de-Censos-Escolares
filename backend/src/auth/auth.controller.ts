import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Publico } from './decorators/publico.decorator';
import { UsuarioActual } from './decorators/usuario-actual.decorator';
import type { UsuarioSesion } from './decorators/usuario-actual.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Publico()
    @Post('login')
    @HttpCode(200)
    login(@Body() dto: LoginDto) {return this.authService.login(dto);}

    // El token no se guarda en el servidor: el frontend lo borra al cerrar sesión
    @Post('logout')
    @HttpCode(200)
    logout() {return {mensaje: 'Sesión cerrada correctamente'};}

    @Get('me')
    me(@UsuarioActual() usuario: UsuarioSesion) {return usuario;}
}