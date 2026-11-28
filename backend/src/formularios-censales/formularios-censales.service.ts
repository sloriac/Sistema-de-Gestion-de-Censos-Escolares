import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { EstadoFormulario, FormulariosCensales, Seccion } from './schemas/formularios-censales.schema';
import { CrearFormulariosCensalesDto } from './dto/crear-formularios-censales.dto';
import { ActualizarFormulariosCensalesDto } from './dto/actualizar-formularios-censales.dto';
import { FiltrarFormulariosDto } from './dto/filtrar-formularios.dto';

@Injectable()
export class FormulariosCensalesService {
    //Inyeccion del modelo
    constructor(@InjectModel(FormulariosCensales.name) private readonly formulariosModel: Model<FormulariosCensales>) {}

    //C - CREATE (nace en borrador)
    async crear(dto: CrearFormulariosCensalesDto, creadorId: string) {
        return this.formulariosModel.create({ ...dto, creadoPor: new Types.ObjectId(creadorId) });
    }

    //R - READ - con filtros opcionales
    async listar(filtros: FiltrarFormulariosDto) {
        const consulta: { estado?: EstadoFormulario; esPlantilla?: boolean } = {};
        if (filtros.estado) consulta.estado = filtros.estado;
        if (filtros.esPlantilla) consulta.esPlantilla = filtros.esPlantilla === 'true';
        return this.formulariosModel.find(consulta);
    }

    //R - READ - uno
    async buscarPorId(id: string) {
        this.validarId(id);
        const formulario = await this.formulariosModel.findById(id);
        if (!formulario) throw new NotFoundException('El formulario no existe');
        return formulario;
    }

    //U - UPDATE - solo borrador o rechazado
    async actualizar(id: string, dto: ActualizarFormulariosCensalesDto) {
        const formulario = await this.buscarPorId(id);
        const editables = [EstadoFormulario.borrador, EstadoFormulario.rechazado];
        if (!editables.includes(formulario.estado)) {
            throw new BadRequestException('Solo se pueden editar formularios en borrador o rechazados');
        }
        formulario.set(dto);
        // Al corregirlo vuelve a borrador
        formulario.estado = EstadoFormulario.borrador;
        formulario.motivoRechazo = undefined;
        return formulario.save();
    }

    // Revisa la estructura y lo envía a aprobación
    async validar(id: string) {
        const formulario = await this.buscarPorId(id);
        this.exigirEstado(formulario.estado, EstadoFormulario.borrador);
        this.validarEstructura(formulario.secciones);
        formulario.estado = EstadoFormulario.pendiente;
        return formulario.save();
    }

    async aprobar(id: string, aprobadorId: string) {
        const formulario = await this.buscarPorId(id);
        this.exigirEstado(formulario.estado, EstadoFormulario.pendiente);
        formulario.estado = EstadoFormulario.aprobado;
        formulario.aprobadoPor = new Types.ObjectId(aprobadorId);
        return formulario.save();
    }

    async rechazar(id: string, motivoRechazo: string) {
        const formulario = await this.buscarPorId(id);
        this.exigirEstado(formulario.estado, EstadoFormulario.pendiente);
        formulario.estado = EstadoFormulario.rechazado;
        formulario.motivoRechazo = motivoRechazo;
        return formulario.save();
    }

    //validacion del id
    private validarId(id: string) {
        if (!isValidObjectId(id)) throw new BadRequestException('El id no es valido');
    }

    private exigirEstado(actual: EstadoFormulario, requerido: EstadoFormulario) {
        if (actual !== requerido) {
            throw new BadRequestException(`El formulario debe estar en estado ${requerido} y está en ${actual}`);
        }
    }

    private validarEstructura(secciones: Seccion[]) {
        if (secciones.length === 0) throw new BadRequestException('El formulario necesita al menos una sección');
        if (this.hayRepetidos(secciones.map((seccion) => seccion.nombre))) {
            throw new BadRequestException('Hay secciones con el mismo nombre');
        }
        for (const seccion of secciones) {
            if (seccion.campos.length === 0) {
                throw new BadRequestException(`La sección "${seccion.nombre}" no tiene campos`);
            }
            if (this.hayRepetidos(seccion.campos.map((campo) => campo.nombreCampo))) {
                throw new BadRequestException(`La sección "${seccion.nombre}" tiene campos con el mismo nombre`);
            }
        }
    }

    // Un Set no guarda duplicados: si queda más pequeño, había repetidos
    private hayRepetidos(nombres: string[]) {
        return new Set(nombres.map((nombre) => nombre.toLowerCase())).size !== nombres.length;
    }
}