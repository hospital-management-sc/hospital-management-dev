/**
 * Pacientes Routes
 * Maneja todas las rutas relacionadas con pacientes
 */

import { Router } from 'express';
import { 
  crearPaciente, 
  obtenerPaciente, 
  buscarPaciente, 
  obtenerUltimos,
  listarPacientes 
} from '../controllers/pacientes';

const router = Router();

// Rutas públicas (en desarrollo)
// TODO: Agregar authMiddleware en producción
router.post('/', crearPaciente);
router.get('/ultimos', obtenerUltimos);
router.get('/', listarPacientes);
router.get('/search', buscarPaciente);
router.get('/:id', obtenerPaciente);

export default router;
