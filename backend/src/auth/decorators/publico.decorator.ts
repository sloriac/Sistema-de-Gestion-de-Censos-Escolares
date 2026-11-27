import { SetMetadata } from '@nestjs/common';

export const ES_PUBLICO = 'esPublico';

// Marca una ruta que no pide iniciar sesión
export const Publico = () => SetMetadata(ES_PUBLICO, true);