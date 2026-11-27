// Crea la primera cuenta de Jefatura DAE (se ejecuta una sola vez)
import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { setServers } from 'node:dns/promises';
import { Model } from 'mongoose';
import bcrypt from 'bcrypt';
import { AppModule } from './app.module';
import { RolUsuario, Usuarios } from './usuarios/schemas/usuarios.schema';

async function crearJefatura() {
    setServers(['1.1.1.1', '8.8.8.8']);
    const app = await NestFactory.createApplicationContext(AppModule);
    try {
        const { SEED_NOMBRE, SEED_CORREO, SEED_CONTRASENA } = process.env;
        if (!SEED_NOMBRE || !SEED_CORREO || !SEED_CONTRASENA) {
            console.log('Faltan SEED_NOMBRE, SEED_CORREO o SEED_CONTRASENA');
            return;
        }
        const usuariosModel = app.get<Model<Usuarios>>(getModelToken(Usuarios.name));
        const correoInstitucional = SEED_CORREO.trim().toLowerCase();
        if (await usuariosModel.findOne({ correoInstitucional })) {
            console.log('Ya existe un usuario con ese correo');
            return;
        }
        await usuariosModel.create({
            nombre: SEED_NOMBRE,
            correoInstitucional,
            contrasena: await bcrypt.hash(SEED_CONTRASENA, 10),
            rol: RolUsuario.jefaturaDae,
            estado: true,
        });
        console.log('Cuenta de Jefatura DAE creada');
    } finally {
        await app.close();
    }
}

crearJefatura();