/**
 * Servicio para gestionar encuentros médicos (solo lectura para administrativos)
 */

import { apiService } from './api';

export interface SignosVitales {
  id: string;
  encuentroId: string;
  taSistolica?: number;
  taDiastolica?: number;
  pulso?: number;
  temperatura?: number;
  fr?: number;
  observaciones?: string;
  registradoEn: string;
}

export interface ImpresionDiagnostica {
  id: string;
  encuentroId: string;
  codigoCie?: string;
  descripcion?: string;
  clase?: string;
  createdAt: string;
}

export interface Encuentro {
  id: string;
  pacienteId: string;
  admisionId?: string;
  tipo: 'EMERGENCIA' | 'HOSPITALIZACION' | 'CONSULTA' | 'OTRO';
  fecha: string;
  hora?: string;
  motivoConsulta?: string;
  enfermedadActual?: string;
  procedencia?: string;
  nroCama?: string;
  createdById?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: string;
    nombre: string;
    cargo?: string;
    role?: string;
  };
  signosVitales: SignosVitales[];
  impresiones: ImpresionDiagnostica[];
  admision?: {
    id: string;
    tipo?: string;
    servicio?: string;
    fechaAdmision?: string;
    formaIngreso?: string;
  };
}

export interface EncuentrosResponse {
  success: boolean;
  data: Encuentro[];
  count: number;
}

export interface EncuentroResponse {
  success: boolean;
  data: Encuentro;
}

class EncuentrosService {
  /**
   * Obtener todos los encuentros de un paciente
   */
  async obtenerPorPaciente(pacienteId: string | number): Promise<Encuentro[]> {
    const response = await apiService.get<EncuentrosResponse>(
      `/encuentros/paciente/${pacienteId}`
    );
    return response.data;
  }

  /**
   * Obtener detalle de un encuentro específico
   */
  async obtenerPorId(id: string | number): Promise<Encuentro> {
    const response = await apiService.get<EncuentroResponse>(
      `/encuentros/${id}`
    );
    return response.data;
  }

  /**
   * Obtener encuentros del día actual
   */
  async obtenerHoy(): Promise<Encuentro[]> {
    const response = await apiService.get<EncuentrosResponse>(
      `/encuentros/hoy`
    );
    return response.data;
  }

  /**
   * Obtener encuentros por tipo
   */
  async obtenerPorTipo(tipo: 'EMERGENCIA' | 'HOSPITALIZACION' | 'CONSULTA' | 'OTRO'): Promise<Encuentro[]> {
    const response = await apiService.get<EncuentrosResponse>(
      `/encuentros/tipo/${tipo}`
    );
    return response.data;
  }
}

export const encuentrosService = new EncuentrosService();
export default encuentrosService;
