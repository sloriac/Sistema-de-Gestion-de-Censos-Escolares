// Carga zonas y centros educativos de ejemplo. Se puede ejecutar varias veces.
import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { setServers } from 'node:dns/promises';
import { Model } from 'mongoose';
import { AppModule } from './app.module';
import { Zonas } from './zonas/schemas/zonas.schema';
import { CentrosEducativos, TipoCentro } from './centros-educativos/schemas/centros-educativos.schema';
import { RolUsuario, Usuarios } from './usuarios/schemas/usuarios.schema';

const datos = [
    { zona: { nombre: 'Guápiles', region: 'Limón' }, centros: [
        { codigo: 'CTP-001', nombre: 'CTP Guápiles', tipo: TipoCentro.publico, ofertaEducativa: ['Académica', 'Técnica'] },
        { codigo: 'ESC-002', nombre: 'Escuela Central de Guápiles', tipo: TipoCentro.publico, ofertaEducativa: ['Primaria'] },
    ] },
    { zona: { nombre: 'Heredia Centro', region: 'Heredia' }, centros: [
        { codigo: 'LIC-003', nombre: 'Liceo de Heredia', tipo: TipoCentro.publico, ofertaEducativa: ['Académica'] },
        { codigo: 'COL-004', nombre: 'Colegio Los Robles', tipo: TipoCentro.privado, ofertaEducativa: ['Primaria', 'Académica'] },
    ] },
];

async function cargarCentros() {
    setServers(['1.1.1.1', '8.8.8.8']);
    const app = await NestFactory.createApplicationContext(AppModule);
    try {
        const zonasModel = app.get<Model<Zonas>>(getModelToken(Zonas.name));
        const centrosModel = app.get<Model<CentrosEducativos>>(getModelToken(CentrosEducativos.name));
        const usuariosModel = app.get<Model<Usuarios>>(getModelToken(Usuarios.name));

        for (const grupo of datos) {
            // upsert: actualiza si existe y crea si no existe
            const zona = await zonasModel.findOneAndUpdate(grupo.zona, grupo.zona, { upsert: true, returnDocument: 'after' });
            for (const centro of grupo.centros) {
                await centrosModel.updateOne(
                    { codigo: centro.codigo },
                    { ...centro, zonaId: zona._id },
                    { upsert: true, runValidators: true },
                );
            }
        }
        console.log('Zonas y centros de ejemplo cargados');

        // Asignaciones opcionales al CTP Guápiles
        const asignaciones = [
            { correo: process.env.SEED_DIRECTOR_CORREO, rol: RolUsuario.director, campo: 'directorId' },
            { correo: process.env.SEED_TECNICO_CORREO, rol: RolUsuario.tecnicoDae, campo: 'tecnicoId' },
        ];
        for (const { correo, rol, campo } of asignaciones) {
            if (!correo) continue;
            const usuario = await usuariosModel.findOne({ correoInstitucional: correo.trim().toLowerCase(), rol });
            if (!usuario) {
                console.log(`No hay un usuario ${rol} con el correo ${correo}`);
                continue;
            }
            // Un Director dirige un solo centro
            if (campo === 'directorId') {
                await centrosModel.updateMany({ directorId: usuario._id }, { $unset: { directorId: 1 } });
            }
            await centrosModel.updateOne({ codigo: 'CTP-001' }, { [campo]: usuario._id });
            console.log(`${rol} asignado al CTP Guápiles`);
        }
    } finally {
        await app.close();
    }
}

cargarCentros();