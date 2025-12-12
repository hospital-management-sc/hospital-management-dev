import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as formatoController from '../controllers/formatoHospitalizacion';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Obtener formato por admisionId
router.get('/admision/:admisionId', formatoController.getFormatoByAdmision);

// Crear nuevo formato
router.post('/', formatoController.createFormato);

// Signos Vitales
router.post('/:id/signos-vitales', formatoController.addSignosVitales);
router.put('/signos-vitales/:id', formatoController.updateSignosVitales);
router.delete('/signos-vitales/:id', formatoController.deleteSignosVitales);

// Laboratorios
router.post('/:id/laboratorio', formatoController.addLaboratorio);
router.put('/laboratorio/:id', formatoController.updateLaboratorio);
router.delete('/laboratorio/:id', formatoController.deleteLaboratorio);

// Estudios Especiales
router.post('/:id/estudio-especial', formatoController.addEstudioEspecial);
router.put('/estudio-especial/:id', formatoController.updateEstudioEspecial);
router.delete('/estudio-especial/:id', formatoController.deleteEstudioEspecial);

// Electrocardiogramas
router.post('/:id/electrocardiograma', formatoController.addElectrocardiograma);
router.put('/electrocardiograma/:id', formatoController.updateElectrocardiograma);
router.delete('/electrocardiograma/:id', formatoController.deleteElectrocardiograma);

// Antecedentes Detallados
router.put('/:id/antecedentes-detallados', formatoController.updateAntecedentesDetallados);

// Examen Funcional
router.put('/:id/examen-funcional', formatoController.updateExamenFuncional);

// Examen Físico Completo
router.put('/:id/examen-fisico-completo', formatoController.updateExamenFisicoCompleto);

// Resumen de Ingreso
router.put('/:id/resumen-ingreso', formatoController.updateResumenIngreso);

// Órdenes Médicas
router.get('/:id/ordenes-medicas', formatoController.getOrdenesMedicas);
router.post('/:id/orden-medica', formatoController.addOrdenMedica);
router.put('/orden-medica/:id', formatoController.updateOrdenMedica);
router.delete('/orden-medica/:id', formatoController.deleteOrdenMedica);

// Evoluciones Médicas
router.post('/:id/evolucion-medica', formatoController.addEvolucionMedica);
router.put('/evolucion-medica/:id', formatoController.updateEvolucionMedica);
router.delete('/evolucion-medica/:id', formatoController.deleteEvolucionMedica);

export default router;
