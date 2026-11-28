import { IsIn, IsOptional } from 'class-validator';
import { EstadoFormulario } from '../schemas/formularios-censales.schema';

// Filtros que llegan en la URL, por eso son texto
export class FiltrarFormulariosDto {
    @IsOptional()
    @IsIn(Object.values(EstadoFormulario), {message: 'El estado no es valido'})
    estado?: EstadoFormulario;

    @IsOptional()
    @IsIn(['true', 'false'], {message: 'esPlantilla debe ser true o false'})
    esPlantilla?: string;
}
