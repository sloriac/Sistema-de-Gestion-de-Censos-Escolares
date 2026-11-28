import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CrearInconsistenciasDto {
  @Transform(({value}) => typeof value === 'string' ? value.trim() : value)
  @IsString({message: 'El campo afectado debe ser texto'})
  @IsNotEmpty({message: 'El campo afectado no puede estar vacio'})
  campoAfectado: string;

  @Transform(({value}) => typeof value === 'string' ? value.trim() : value)
  @IsString({message: 'La descripcion debe ser texto'})
  @IsNotEmpty({message: 'La descripcion no puede estar vacia'})
  descripcion: string;
}