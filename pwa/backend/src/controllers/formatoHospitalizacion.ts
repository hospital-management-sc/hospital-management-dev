import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Obtener formato de hospitalización por admisionId
 * GET /api/formato-hospitalizacion/admision/:admisionId
 */
export const getFormatoByAdmision = async (req: Request, res: Response): Promise<void> => {
  try {
    const { admisionId } = req.params;

    const formato = await prisma.formatoHospitalizacion.findFirst({
      where: { admisionId: Number(admisionId) },
      include: {
        signosVitales: { orderBy: { fecha: 'desc' } },
        laboratorios: { orderBy: { fecha: 'desc' } },
        estudiosEspeciales: { orderBy: { fecha: 'desc' } },
        electrocardiogramas: { orderBy: { fecha: 'desc' } },
        antecedentesDetallados: true,
        examenFuncional: true,
        examenFisicoCompleto: true,
        resumenIngreso: true,
        ordenesMedicas: { orderBy: { fecha: 'desc' } },
        evolucionesMedicas: { orderBy: { fecha: 'desc' } },
      },
    });

    if (!formato) {
      res.status(404).json({ error: 'Formato de hospitalización no encontrado' });
      return;
    }

    res.json(formato);
  } catch (error: any) {
    console.error('Error al obtener formato:', error);
    res.status(500).json({ error: 'Error al obtener formato de hospitalización' });
  }
};

/**
 * Crear nuevo formato de hospitalización
 * POST /api/formato-hospitalizacion
 */
export const createFormato = async (req: Request, res: Response): Promise<void> => {
  try {
    const { admisionId, pacienteId } = req.body;

    if (!admisionId || !pacienteId) {
      res.status(400).json({ error: 'admisionId y pacienteId son requeridos' });
      return;
    }

    // Verificar si ya existe
    const existente = await prisma.formatoHospitalizacion.findFirst({
      where: { admisionId: Number(admisionId) },
    });

    if (existente) {
      res.status(400).json({ error: 'Ya existe un formato para esta admisión' });
      return;
    }

    const formato = await prisma.formatoHospitalizacion.create({
      data: {
        admisionId: Number(admisionId),
        pacienteId: Number(pacienteId),
      },
      include: {
        signosVitales: true,
        laboratorios: true,
        estudiosEspeciales: true,
        electrocardiogramas: true,
        antecedentesDetallados: true,
        examenFuncional: true,
        examenFisicoCompleto: true,
        resumenIngreso: true,
        ordenesMedicas: true,
        evolucionesMedicas: true,
      },
    });

    res.status(201).json(formato);
  } catch (error: any) {
    console.error('Error al crear formato:', error);
    res.status(500).json({ error: 'Error al crear formato de hospitalización' });
  }
};

/**
 * Agregar signos vitales
 * POST /api/formato-hospitalizacion/:id/signos-vitales
 */
export const addSignosVitales = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const registro = await prisma.signosVitalesHosp.create({
      data: {
        formatoHospId: Number(id),
        ...data,
      },
    });

    res.status(201).json(registro);
  } catch (error: any) {
    console.error('Error al agregar signos vitales:', error);
    res.status(500).json({ error: 'Error al agregar signos vitales' });
  }
};

/**
 * Actualizar signos vitales
 * PUT /api/formato-hospitalizacion/signos-vitales/:id
 */
export const updateSignosVitales = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const registro = await prisma.signosVitalesHosp.update({
      where: { id: Number(id) },
      data,
    });

    res.json(registro);
  } catch (error: any) {
    console.error('Error al actualizar signos vitales:', error);
    res.status(500).json({ error: 'Error al actualizar signos vitales' });
  }
};

/**
 * Eliminar signos vitales
 * DELETE /api/formato-hospitalizacion/signos-vitales/:id
 */
export const deleteSignosVitales = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.signosVitalesHosp.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('Error al eliminar signos vitales:', error);
    res.status(500).json({ error: 'Error al eliminar signos vitales' });
  }
};

/**
 * Agregar laboratorio
 * POST /api/formato-hospitalizacion/:id/laboratorio
 */
export const addLaboratorio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const registro = await prisma.laboratorio.create({
      data: {
        formatoHospId: Number(id),
        ...data,
      },
    });

    res.status(201).json(registro);
  } catch (error: any) {
    console.error('Error al agregar laboratorio:', error);
    res.status(500).json({ error: 'Error al agregar laboratorio' });
  }
};

/**
 * Actualizar laboratorio
 * PUT /api/formato-hospitalizacion/laboratorio/:id
 */
export const updateLaboratorio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const registro = await prisma.laboratorio.update({
      where: { id: Number(id) },
      data,
    });

    res.json(registro);
  } catch (error: any) {
    console.error('Error al actualizar laboratorio:', error);
    res.status(500).json({ error: 'Error al actualizar laboratorio' });
  }
};

/**
 * Eliminar laboratorio
 * DELETE /api/formato-hospitalizacion/laboratorio/:id
 */
export const deleteLaboratorio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.laboratorio.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('Error al eliminar laboratorio:', error);
    res.status(500).json({ error: 'Error al eliminar laboratorio' });
  }
};

/**
 * Agregar estudio especial
 * POST /api/formato-hospitalizacion/:id/estudio-especial
 */
export const addEstudioEspecial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const registro = await prisma.estudioEspecial.create({
      data: {
        formatoHospId: Number(id),
        ...data,
      },
    });

    res.status(201).json(registro);
  } catch (error: any) {
    console.error('Error al agregar estudio especial:', error);
    res.status(500).json({ error: 'Error al agregar estudio especial' });
  }
};

/**
 * Actualizar estudio especial
 * PUT /api/formato-hospitalizacion/estudio-especial/:id
 */
export const updateEstudioEspecial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const registro = await prisma.estudioEspecial.update({
      where: { id: Number(id) },
      data,
    });

    res.json(registro);
  } catch (error: any) {
    console.error('Error al actualizar estudio especial:', error);
    res.status(500).json({ error: 'Error al actualizar estudio especial' });
  }
};

/**
 * Eliminar estudio especial
 * DELETE /api/formato-hospitalizacion/estudio-especial/:id
 */
export const deleteEstudioEspecial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.estudioEspecial.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('Error al eliminar estudio especial:', error);
    res.status(500).json({ error: 'Error al eliminar estudio especial' });
  }
};

/**
 * Agregar electrocardiograma
 * POST /api/formato-hospitalizacion/:id/electrocardiograma
 */
export const addElectrocardiograma = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const registro = await prisma.electrocardiograma.create({
      data: {
        formatoHospId: Number(id),
        ...data,
      },
    });

    res.status(201).json(registro);
  } catch (error: any) {
    console.error('Error al agregar electrocardiograma:', error);
    res.status(500).json({ error: 'Error al agregar electrocardiograma' });
  }
};

/**
 * Actualizar electrocardiograma
 * PUT /api/formato-hospitalizacion/electrocardiograma/:id
 */
export const updateElectrocardiograma = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const registro = await prisma.electrocardiograma.update({
      where: { id: Number(id) },
      data,
    });

    res.json(registro);
  } catch (error: any) {
    console.error('Error al actualizar electrocardiograma:', error);
    res.status(500).json({ error: 'Error al actualizar electrocardiograma' });
  }
};

/**
 * Eliminar electrocardiograma
 * DELETE /api/formato-hospitalizacion/electrocardiograma/:id
 */
export const deleteElectrocardiograma = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.electrocardiograma.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('Error al eliminar electrocardiograma:', error);
    res.status(500).json({ error: 'Error al eliminar electrocardiograma' });
  }
};

/**
 * Actualizar antecedentes detallados
 * PUT /api/formato-hospitalizacion/:id/antecedentes-detallados
 */
export const updateAntecedentesDetallados = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Buscar si existe
    const existente = await prisma.antecedentesDetallados.findFirst({
      where: { formatoHospId: Number(id) },
    });

    let registro;
    if (existente) {
      registro = await prisma.antecedentesDetallados.update({
        where: { id: existente.id },
        data,
      });
    } else {
      registro = await prisma.antecedentesDetallados.create({
        data: {
          formatoHospId: Number(id),
          ...data,
        },
      });
    }

    res.json(registro);
  } catch (error: any) {
    console.error('Error al actualizar antecedentes:', error);
    res.status(500).json({ error: 'Error al actualizar antecedentes detallados' });
  }
};

/**
 * Actualizar examen funcional
 * PUT /api/formato-hospitalizacion/:id/examen-funcional
 */
export const updateExamenFuncional = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const existente = await prisma.examenFuncional.findFirst({
      where: { formatoHospId: Number(id) },
    });

    let registro;
    if (existente) {
      registro = await prisma.examenFuncional.update({
        where: { id: existente.id },
        data,
      });
    } else {
      registro = await prisma.examenFuncional.create({
        data: {
          formatoHospId: Number(id),
          ...data,
        },
      });
    }

    res.json(registro);
  } catch (error: any) {
    console.error('Error al actualizar examen funcional:', error);
    res.status(500).json({ error: 'Error al actualizar examen funcional' });
  }
};

/**
 * Actualizar examen físico completo
 * PUT /api/formato-hospitalizacion/:id/examen-fisico-completo
 */
export const updateExamenFisicoCompleto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const existente = await prisma.examenFisicoCompleto.findFirst({
      where: { formatoHospId: Number(id) },
    });

    let registro;
    if (existente) {
      registro = await prisma.examenFisicoCompleto.update({
        where: { id: existente.id },
        data,
      });
    } else {
      registro = await prisma.examenFisicoCompleto.create({
        data: {
          formatoHospId: Number(id),
          ...data,
        },
      });
    }

    res.json(registro);
  } catch (error: any) {
    console.error('Error al actualizar examen físico:', error);
    res.status(500).json({ error: 'Error al actualizar examen físico completo' });
  }
};

/**
 * Actualizar resumen de ingreso
 * PUT /api/formato-hospitalizacion/:id/resumen-ingreso
 */
export const updateResumenIngreso = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const existente = await prisma.resumenIngreso.findFirst({
      where: { formatoHospId: Number(id) },
    });

    let registro;
    if (existente) {
      registro = await prisma.resumenIngreso.update({
        where: { id: existente.id },
        data,
      });
    } else {
      registro = await prisma.resumenIngreso.create({
        data: {
          formatoHospId: Number(id),
          ...data,
        },
      });
    }

    res.json(registro);
  } catch (error: any) {
    console.error('Error al actualizar resumen de ingreso:', error);
    res.status(500).json({ error: 'Error al actualizar resumen de ingreso' });
  }
};

/**
 * Obtener órdenes médicas
 * GET /api/formato-hospitalizacion/:id/ordenes-medicas
 */
export const getOrdenesMedicas = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const ordenes = await prisma.ordenMedica.findMany({
      where: { formatoHospId: Number(id) },
      orderBy: { fecha: 'desc' },
    });

    res.json(ordenes);
  } catch (error: any) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({ error: 'Error al obtener órdenes médicas' });
  }
};

/**
 * Agregar orden médica
 * POST /api/formato-hospitalizacion/:id/orden-medica
 */
export const addOrdenMedica = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const registro = await prisma.ordenMedica.create({
      data: {
        formatoHospId: Number(id),
        ...data,
      },
    });

    res.status(201).json(registro);
  } catch (error: any) {
    console.error('Error al agregar orden médica:', error);
    res.status(500).json({ error: 'Error al agregar orden médica' });
  }
};

/**
 * Actualizar orden médica
 * PUT /api/formato-hospitalizacion/orden-medica/:id
 */
export const updateOrdenMedica = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;

    const registro = await prisma.ordenMedica.update({
      where: { id: Number(id) },
      data,
    });

    res.json(registro);
  } catch (error: any) {
    console.error('Error al actualizar orden médica:', error);
    res.status(500).json({ error: 'Error al actualizar orden médica' });
  }
};

/**
 * Eliminar orden médica
 * DELETE /api/formato-hospitalizacion/orden-medica/:id
 */
export const deleteOrdenMedica = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.ordenMedica.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('Error al eliminar orden médica:', error);
    res.status(500).json({ error: 'Error al eliminar orden médica' });
  }
};

/**
 * Agregar evolución médica
 * POST /api/formato-hospitalizacion/:id/evolucion-medica
 */
export const addEvolucionMedica = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const registro = await prisma.evolucionMedica.create({
      data: {
        formatoHospId: Number(id),
        ...data,
      },
    });

    res.status(201).json(registro);
  } catch (error: any) {
    console.error('Error al agregar evolución médica:', error);
    res.status(500).json({ error: 'Error al agregar evolución médica' });
  }
};

/**
 * Actualizar evolución médica
 * PUT /api/formato-hospitalizacion/evolucion-medica/:id
 */
export const updateEvolucionMedica = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const registro = await prisma.evolucionMedica.update({
      where: { id: Number(id) },
      data,
    });

    res.json(registro);
  } catch (error: any) {
    console.error('Error al actualizar evolución médica:', error);
    res.status(500).json({ error: 'Error al actualizar evolución médica' });
  }
};

/**
 * Eliminar evolución médica
 * DELETE /api/formato-hospitalizacion/evolucion-medica/:id
 */
export const deleteEvolucionMedica = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.evolucionMedica.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('Error al eliminar evolución médica:', error);
    res.status(500).json({ error: 'Error al eliminar evolución médica' });
  }
};
