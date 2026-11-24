import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FormularioCensalesModule } from './formulario-censales/formulario-censales.module';
 
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
 
    FormularioCensalesModule,
  ],
})
export class AppModule {}