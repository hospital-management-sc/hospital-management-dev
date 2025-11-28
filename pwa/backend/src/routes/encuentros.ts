import { Router } from 'express';
import {
  obtenerEncuentrosPorPaciente,
  obtenerEncuentroPorId,
  obtenerEncuentrosHoy,
  obtenerEncuentrosPorTipo,
  crearEncuentro,
  crearEncuentroDesdeCita,
} from '../controllers/encuentros';

const router = Router();

// Crear nuevo encuentro
router.post('/', crearEncuentro);

// Crear encuentro desde cita (atender cita)
router.post('/desde-cita', crearEncuentroDesdeCita);

// Obtener encuentros de un paciente específico
router.get('/paciente/:pacienteId', obtenerEncuentrosPorPaciente);

// Obtener encuentros del día actual
router.get('/hoy', obtenerEncuentrosHoy);

// Obtener encuentros por tipo (EMERGENCIA, HOSPITALIZACION, CONSULTA, OTRO)
router.get('/tipo/:tipo', obtenerEncuentrosPorTipo);

// Obtener un encuentro específico (debe ir al final para evitar conflictos)
router.get('/:id', obtenerEncuentroPorId);

export default router;
