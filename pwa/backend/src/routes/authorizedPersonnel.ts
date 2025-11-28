/**
 * Authorized Personnel Routes
 * 
 * Rutas para gestionar la whitelist de personal autorizado.
 * TODOS los endpoints requieren autenticación y rol SUPER_ADMIN.
 */

import { Router } from 'express';
import {
  getAll,
  getStats,
  getByCI,
  create,
  update,
  deactivate,
  bulkCreate,
} from '../controllers/authorizedPersonnel';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Todos los endpoints requieren autenticación
router.use(authMiddleware);

// ============================================
// ENDPOINTS DE CONSULTA
// ============================================

/**
 * GET /api/authorized-personnel
 * Lista todo el personal autorizado con filtros opcionales
 * Query params: estado, rol, registrado, departamento
 */
router.get('/', getAll);

/**
 * GET /api/authorized-personnel/stats
 * Obtiene estadísticas de la whitelist
 */
router.get('/stats', getStats);

/**
 * GET /api/authorized-personnel/:ci
 * Obtiene un registro específico por CI
 */
router.get('/:ci', getByCI);

// ============================================
// ENDPOINTS DE MODIFICACIÓN
// ============================================

/**
 * POST /api/authorized-personnel
 * Agrega nuevo personal a la whitelist
 * Body: { ci, nombreCompleto, email?, rolAutorizado, departamento?, cargo?, fechaIngreso, fechaVencimiento? }
 */
router.post('/', create);

/**
 * POST /api/authorized-personnel/bulk
 * Carga masiva de personal autorizado (máx 100 registros)
 * Body: { personnel: [{ ci, nombreCompleto, ... }] }
 */
router.post('/bulk', bulkCreate);

/**
 * PUT /api/authorized-personnel/:ci
 * Actualiza un registro existente
 * Body: campos a actualizar
 */
router.put('/:ci', update);

/**
 * DELETE /api/authorized-personnel/:ci
 * Da de baja a un personal (no elimina, cambia estado)
 * Body: { motivoBaja: string }
 */
router.delete('/:ci', deactivate);

export default router;
