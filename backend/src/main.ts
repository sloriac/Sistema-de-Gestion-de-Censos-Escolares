import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { setServers } from 'node:dns/promises';
import { AppModule } from './app.module';
 
async function bootstrap() {
  // Para el error querySrv ECONNREFUSED al conectarse a MongoDB Atlas.
  setServers(['1.1.1.1', '8.8.8.8']);
 
  const app = await NestFactory.create(AppModule);
 
  // Permite la comunicación entre dominios diferentes
  app.enableCors();
 
  // Valida AUTOMÁTICAMENTE los datos que llegan, usando las reglas de los DTO.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // elimina los campos que no están en el DTO
      forbidNonWhitelisted: true, // y responde 400 si alguien envía campos de más
      transform: true,            // convierte los datos a los tipos del DTO
    }),
  );
 
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log('Servidor corriendo en http://localhost:' + port);
}
 
bootstrap();