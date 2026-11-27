import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CentrosEducativosModule } from './centros-educativos/centros-educativos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { FormulariosCensalesModule } from './formularios-censales/formularios-censales.module';
import { CensosModule } from './censos/censos.module';
import { CensosCentroModule } from './censos-centro/censos-centro.module';
import { InconsistenciasModule } from './inconsistencias/inconsistencias.module';
import { ZonasModule } from './zonas/zonas.module';
import { AuthModule } from './auth/auth.module';
 
@Module({
  imports: [
    // Lee el archivo .env 
    ConfigModule.forRoot({ isGlobal: true }),
 
    // Conexión a MongoDB Atlas (antes: mongoose.connect(...))
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),

    AuthModule,
 
    CentrosEducativosModule,
    
    ZonasModule, 
 
    UsuariosModule,
 
    FormulariosCensalesModule,
 
    CensosModule,
 
    CensosCentroModule,
 
    InconsistenciasModule,
  ],
})
export class AppModule {}