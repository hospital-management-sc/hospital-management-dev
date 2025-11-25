/**
 * Encuentros Controller
 * Maneja la consulta de encuentros médicos (solo lectura para administrativos)
 */

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient();

/**
 * Función helper para convertir BigInt a string
 */
function convertBigIntToString(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'bigint') {
    return obj.toString();
  }
  
  if (obj instanceof Date) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => convertBigIntToString(item));
  }
  
  if (typeof obj === 'object') {
    const converted: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        converted[key] = convertBigIntToString(obj[key]);
      }
    }
    return converted;
  }
  
  return obj;
}

/**
 * Obtener todos los encuentros de un paciente
 * GET /api/encuentros/paciente/:pacienteId
 */
export const obtenerEncuentrosPorPaciente = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { pacienteId } = req.params;

    // Validar que pacienteId sea un número válido
    if (!pacienteId || isNaN(Number(pacienteId))) {
      res.status(400).json({
        error: 'ID de paciente inválido',
      });
      return;
    }

    logger.info(`Obteniendo encuentros del paciente ${pacienteId}`);

    // Verificar que el paciente existe
    const paciente = await prisma.paciente.findUnique({
      where: { id: BigInt(pacienteId) },
    });

    if (!paciente) {
      res.status(404).json({
        error: 'Paciente no encontrado',
      });
      return;
    }

    // Obtener encuentros con información relacionada
    const encuentros = await prisma.encuentro.findMany({
      where: {
        pacienteId: BigInt(pacienteId),
      },
      include: {
        createdBy: {
          select: {
            id: true,
            nombre: true,
            cargo: true,
            role: true,
          },
        },
        signosVitales: true,
        impresiones: true,
        admision: {
          select: {
            id: true,
            tipo: true,
            servicio: true,
          },
        },
      },
      orderBy: [
        { fecha: 'desc' },
        { hora: 'desc' },
      ],
    });

    // Convertir BigInt a string
    const encuentrosConvertidos = convertBigIntToString(encuentros);

    logger.info(`Se encontraron ${encuentros.length} encuentros para el paciente ${pacienteId}`);

    res.status(200).json({
      success: true,
      data: encuentrosConvertidos,
      count: encuentros.length,
    });
  } catch (error: any) {
    logger.error('Error al obtener encuentros:', error);
    res.status(500).json({
      error: 'Error al obtener encuentros',
      details: error.message,
    });
  }
};

/**
 * Obtener detalle de un encuentro específico
 * GET /api/encuentros/:id
 */
export const obtenerEncuentroPorId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validar que id sea un número válido
    if (!id || isNaN(Number(id))) {
      res.status(400).json({
        error: 'ID de encuentro inválido',
      });
      return;
    }

    logger.info(`Obteniendo detalle del encuentro ${id}`);

    // Obtener encuentro con toda la información relacionada
    const encuentro = await prisma.encuentro.findUnique({
      where: { id: BigInt(id) },
      include: {
        paciente: {
          select: {
            id: true,
            nroHistoria: true,
            apellidosNombres: true,
            ci: true,
            fechaNacimiento: true,
            sexo: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            nombre: true,
            cargo: true,
            role: true,
            email: true,
          },
        },
        signosVitales: {
          orderBy: {
            registradoEn: 'desc',
          },
        },
        examenRegional: true,
        impresiones: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        admision: {
          select: {
            id: true,
            tipo: true,
            servicio: true,
            fechaAdmision: true,
            formaIngreso: true,
          },
        },
      },
    });

    if (!encuentro) {
      res.status(404).json({
        error: 'Encuentro no encontrado',
      });
      return;
    }

    // Convertir BigInt a string
    const encuentroConvertido = convertBigIntToString(encuentro);

    logger.info(`Encuentro ${id} encontrado`);

    res.status(200).json({
      success: true,
      data: encuentroConvertido,
    });
  } catch (error: any) {
    logger.error('Error al obtener encuentro:', error);
    res.status(500).json({
      error: 'Error al obtener encuentro',
      details: error.message,
    });
  }
};

/**
 * Obtener encuentros del día actual
 * GET /api/encuentros/hoy
 */
export const obtenerEncuentrosHoy = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info('Obteniendo encuentros del día actual');

    // Obtener fecha actual (solo fecha, sin hora)
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1);

    const encuentros = await prisma.encuentro.findMany({
      where: {
        fecha: {
          gte: hoy,
          lt: mañana,
        },
      },
      include: {
        paciente: {
          select: {
            id: true,
            nroHistoria: true,
            apellidosNombres: true,
            ci: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            nombre: true,
            cargo: true,
          },
        },
        signosVitales: true,
      },
      orderBy: [
        { hora: 'desc' },
      ],
    });

    const encuentrosConvertidos = convertBigIntToString(encuentros);

    logger.info(`Se encontraron ${encuentros.length} encuentros hoy`);

    res.status(200).json({
      success: true,
      data: encuentrosConvertidos,
      count: encuentros.length,
      fecha: hoy.toISOString().split('T')[0],
    });
  } catch (error: any) {
    logger.error('Error al obtener encuentros de hoy:', error);
    res.status(500).json({
      error: 'Error al obtener encuentros',
      details: error.message,
    });
  }
};

/**
 * Obtener encuentros por tipo
 * GET /api/encuentros/tipo/:tipo
 */
export const obtenerEncuentrosPorTipo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tipo } = req.params;

    // Validar tipos permitidos
    const tiposPermitidos = ['EMERGENCIA', 'HOSPITALIZACION', 'CONSULTA', 'OTRO'];
    if (!tiposPermitidos.includes(tipo.toUpperCase())) {
      res.status(400).json({
        error: 'Tipo de encuentro inválido',
        tiposPermitidos,
      });
      return;
    }

    logger.info(`Obteniendo encuentros de tipo ${tipo}`);

    const encuentros = await prisma.encuentro.findMany({
      where: {
        tipo: tipo.toUpperCase(),
      },
      include: {
        paciente: {
          select: {
            id: true,
            nroHistoria: true,
            apellidosNombres: true,
            ci: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            nombre: true,
            cargo: true,
          },
        },
      },
      orderBy: [
        { fecha: 'desc' },
        { hora: 'desc' },
      ],
      take: 100, // Limitar a 100 resultados
    });

    const encuentrosConvertidos = convertBigIntToString(encuentros);

    logger.info(`Se encontraron ${encuentros.length} encuentros de tipo ${tipo}`);

    res.status(200).json({
      success: true,
      data: encuentrosConvertidos,
      count: encuentros.length,
      tipo: tipo.toUpperCase(),
    });
  } catch (error: any) {
    logger.error('Error al obtener encuentros por tipo:', error);
    res.status(500).json({
      error: 'Error al obtener encuentros',
      details: error.message,
    });
  }
};
