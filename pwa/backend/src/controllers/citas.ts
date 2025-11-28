import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Función auxiliar para convertir BigInt a string y formatear fechas/horas
function convertBigIntToString(obj: any): any {
  if (obj === null || obj === undefined) return obj
  if (typeof obj === 'bigint') return obj.toString()
  if (obj instanceof Date) {
    // Devolver en formato ISO para que el frontend lo maneje
    return obj.toISOString()
  }
  if (Array.isArray(obj)) return obj.map(item => convertBigIntToString(item))
  if (typeof obj === 'object') {
    const converted: any = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        converted[key] = convertBigIntToString(obj[key])
      }
    }
    return converted
  }
  return obj
}

/**
 * Crear una nueva cita médica
 * POST /api/citas
 */
export const crearCita = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pacienteId, medicoId, fechaCita, horaCita, especialidad, motivo, notas } = req.body

    // Validar campos requeridos
    if (!pacienteId || !fechaCita || !especialidad) {
      res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: pacienteId, fechaCita, especialidad',
      })
      return
    }

    // Validar que el paciente exista
    const pacienteExiste = await prisma.paciente.findUnique({
      where: { id: BigInt(pacienteId) },
    })

    if (!pacienteExiste) {
      res.status(404).json({
        success: false,
        message: 'El paciente no existe',
      })
      return
    }

    // Validar que el médico exista si se proporciona
    if (medicoId) {
      const medicoExiste = await prisma.usuario.findUnique({
        where: { id: BigInt(medicoId) },
      })

      if (!medicoExiste) {
        res.status(404).json({
          success: false,
          message: 'El médico no existe',
        })
        return
      }
    }

    // Crear la cita
    const cita = await prisma.cita.create({
      data: {
        pacienteId: BigInt(pacienteId),
        medicoId: medicoId ? BigInt(medicoId) : null,
        fechaCita: new Date(fechaCita), // PostgreSQL Date type
        horaCita: horaCita ? new Date(`1970-01-01T${horaCita}`) : null, // PostgreSQL Time type
        especialidad,
        motivo: motivo || null,
        notas: notas || null,
        estado: 'PROGRAMADA',
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
        medico: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
      },
    })

    res.status(201).json({
      success: true,
      message: 'Cita creada exitosamente',
      data: convertBigIntToString(cita),
    })
  } catch (error: any) {
    console.error('Error al crear cita:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error al crear la cita',
    })
  }
}

/**
 * Obtener citas de un paciente
 * GET /api/citas/paciente/:pacienteId
 */
export const obtenerCitasPorPaciente = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pacienteId } = req.params
    const { estado } = req.query

    // Validar que el paciente exista
    const pacienteExiste = await prisma.paciente.findUnique({
      where: { id: BigInt(pacienteId) },
    })

    if (!pacienteExiste) {
      res.status(404).json({
        success: false,
        message: 'El paciente no existe',
      })
      return
    }

    // Construir filtro
    const where: any = { pacienteId: BigInt(pacienteId) }
    if (estado) {
      where.estado = estado as string
    }

    const citas = await prisma.cita.findMany({
      where,
      include: {
        paciente: {
          select: {
            id: true,
            nroHistoria: true,
            apellidosNombres: true,
            ci: true,
          },
        },
        medico: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
      },
      orderBy: { fechaCita: 'desc' },
    })

    res.json({
      success: true,
      data: convertBigIntToString(citas),
    })
  } catch (error: any) {
    console.error('Error al obtener citas:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener citas',
    })
  }
}

/**
 * Obtener citas por médico
 * GET /api/citas/medico/:medicoId
 */
export const obtenerCitasPorMedico = async (req: Request, res: Response): Promise<void> => {
  try {
    const { medicoId } = req.params
    const { estado, fecha } = req.query

    // Validar que el médico exista
    const medicoExiste = await prisma.usuario.findUnique({
      where: { id: BigInt(medicoId) },
    })

    if (!medicoExiste) {
      res.status(404).json({
        success: false,
        message: 'El médico no existe',
      })
      return
    }

    // Construir filtro
    const where: any = { medicoId: BigInt(medicoId) }
    if (estado) {
      where.estado = estado as string
    }
    if (fecha) {
      const fechaDate = new Date(fecha as string)
      where.fechaCita = {
        gte: new Date(fechaDate.getFullYear(), fechaDate.getMonth(), fechaDate.getDate()),
        lt: new Date(fechaDate.getFullYear(), fechaDate.getMonth(), fechaDate.getDate() + 1),
      }
    }

    const citas = await prisma.cita.findMany({
      where,
      include: {
        paciente: {
          select: {
            id: true,
            nroHistoria: true,
            apellidosNombres: true,
            ci: true,
          },
        },
        medico: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
      },
      orderBy: { fechaCita: 'asc' },
    })

    res.json({
      success: true,
      data: convertBigIntToString(citas),
    })
  } catch (error: any) {
    console.error('Error al obtener citas por médico:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener citas',
    })
  }
}

/**
 * Obtener una cita específica
 * GET /api/citas/:id
 */
export const obtenerCita = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const cita = await prisma.cita.findUnique({
      where: { id: BigInt(id) },
      include: {
        paciente: true,
        medico: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
      },
    })

    if (!cita) {
      res.status(404).json({
        success: false,
        message: 'Cita no encontrada',
      })
      return
    }

    res.json({
      success: true,
      data: convertBigIntToString(cita),
    })
  } catch (error: any) {
    console.error('Error al obtener cita:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener cita',
    })
  }
}

/**
 * Actualizar una cita
 * PUT /api/citas/:id
 */
export const actualizarCita = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { fechaCita, horaCita, especialidad, motivo, estado, notas } = req.body

    const citaExiste = await prisma.cita.findUnique({
      where: { id: BigInt(id) },
    })

    if (!citaExiste) {
      res.status(404).json({
        success: false,
        message: 'Cita no encontrada',
      })
      return
    }

    const cita = await prisma.cita.update({
      where: { id: BigInt(id) },
      data: {
        ...(fechaCita && { fechaCita: new Date(fechaCita) }),
        ...(horaCita && { horaCita: new Date(`1970-01-01T${horaCita}:00`) }),
        ...(especialidad && { especialidad }),
        ...(motivo !== undefined && { motivo }),
        ...(estado && { estado }),
        ...(notas !== undefined && { notas }),
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
        medico: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
      },
    })

    res.json({
      success: true,
      message: 'Cita actualizada exitosamente',
      data: convertBigIntToString(cita),
    })
  } catch (error: any) {
    console.error('Error al actualizar cita:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error al actualizar cita',
    })
  }
}

/**
 * Cancelar una cita
 * PATCH /api/citas/:id/cancelar
 */
export const cancelarCita = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { motivo } = req.body

    const citaExiste = await prisma.cita.findUnique({
      where: { id: BigInt(id) },
    })

    if (!citaExiste) {
      res.status(404).json({
        success: false,
        message: 'Cita no encontrada',
      })
      return
    }

    if (citaExiste.estado === 'CANCELADA') {
      res.status(400).json({
        success: false,
        message: 'La cita ya está cancelada',
      })
      return
    }

    const cita = await prisma.cita.update({
      where: { id: BigInt(id) },
      data: {
        estado: 'CANCELADA',
        notas: motivo ? `Cancelada: ${motivo}` : 'Cancelada por usuario',
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
      },
    })

    res.json({
      success: true,
      message: 'Cita cancelada exitosamente',
      data: convertBigIntToString(cita),
    })
  } catch (error: any) {
    console.error('Error al cancelar cita:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error al cancelar cita',
    })
  }
}

/**
 * Listar citas próximas (no realizadas)
 * GET /api/citas/lista/proximas
 */
export const listarCitasProximas = async (req: Request, res: Response): Promise<void> => {
  try {
    const { dias = 30, especialidad } = req.query
    const diasNumero = parseInt(dias as string) || 30

    // Construir rango de fechas
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const fechaFinal = new Date(hoy)
    fechaFinal.setDate(fechaFinal.getDate() + diasNumero)

    // Construir filtro
    const where: any = {
      fechaCita: {
        gte: hoy,
        lte: fechaFinal,
      },
      estado: {
        in: ['PROGRAMADA'],
      },
    }

    if (especialidad) {
      where.especialidad = especialidad as string
    }

    const citas = await prisma.cita.findMany({
      where,
      include: {
        paciente: {
          select: {
            id: true,
            nroHistoria: true,
            apellidosNombres: true,
            ci: true,
            telefono: true,
          },
        },
        medico: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
      },
      orderBy: { fechaCita: 'asc' },
    })

    res.json({
      success: true,
      data: convertBigIntToString(citas),
    })
  } catch (error: any) {
    console.error('Error al listar citas próximas:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error al listar citas',
    })
  }
}

/**
 * Obtener especialidades disponibles
 * GET /api/citas/especialidades
 */
export const obtenerEspecialidades = async (_req: Request, res: Response): Promise<void> => {
  try {
    const especialidades = await prisma.cita.findMany({
      distinct: ['especialidad'],
      select: {
        especialidad: true,
      },
    })

    const listaEspecialidades = especialidades.map((e: any) => e.especialidad).sort()

    res.json({
      success: true,
      data: listaEspecialidades,
    })
  } catch (error: any) {
    console.error('Error al obtener especialidades:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener especialidades',
    })
  }
}

/**
 * Obtener citas del día actual para un médico (o especialidad si no tiene médico asignado)
 * GET /api/citas/medico/:medicoId/hoy
 */
export const obtenerCitasHoyMedico = async (req: Request, res: Response): Promise<void> => {
  try {
    const { medicoId } = req.params

    // Validar que el médico exista y obtener su especialidad
    const medico = await prisma.usuario.findUnique({
      where: { id: BigInt(medicoId) },
    })

    if (!medico) {
      res.status(404).json({
        success: false,
        message: 'Médico no encontrado',
      })
      return
    }

    // Construir rango de hoy
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const manana = new Date(hoy)
    manana.setDate(manana.getDate() + 1)

    // Obtener especialidad del médico (puede ser cargo si no tiene especialidad)
    const especialidadMedico = (medico as any).especialidad || medico.cargo || ''

    // Buscar citas asignadas directamente al médico O citas de su especialidad sin médico asignado
    const citas = await prisma.cita.findMany({
      where: {
        AND: [
          {
            fechaCita: {
              gte: hoy,
              lt: manana,
            },
          },
          {
            OR: [
              { medicoId: BigInt(medicoId) },
              {
                AND: [
                  { medicoId: null },
                  { especialidad: especialidadMedico },
                ],
              },
            ],
          },
          {
            estado: {
              in: ['PROGRAMADA', 'EN_PROCESO'],
            },
          },
        ],
      },
      include: {
        paciente: {
          select: {
            id: true,
            nroHistoria: true,
            apellidosNombres: true,
            ci: true,
            fechaNacimiento: true,
            sexo: true,
            telefono: true,
          },
        },
        medico: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
      orderBy: [
        { horaCita: 'asc' },
        { fechaCita: 'asc' },
      ],
    })

    res.json({
      success: true,
      data: convertBigIntToString(citas),
      count: citas.length,
      fecha: hoy.toISOString().split('T')[0],
    })
  } catch (error: any) {
    console.error('Error al obtener citas de hoy:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener citas de hoy',
    })
  }
}

/**
 * Marcar cita como en proceso (médico comenzó a atender)
 * PATCH /api/citas/:id/iniciar
 */
export const iniciarCita = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const cita = await prisma.cita.findUnique({
      where: { id: BigInt(id) },
    })

    if (!cita) {
      res.status(404).json({
        success: false,
        message: 'Cita no encontrada',
      })
      return
    }

    if (cita.estado !== 'PROGRAMADA') {
      res.status(400).json({
        success: false,
        message: 'Solo se pueden iniciar citas programadas',
      })
      return
    }

    const citaActualizada = await prisma.cita.update({
      where: { id: BigInt(id) },
      data: {
        estado: 'EN_PROCESO',
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
      },
    })

    res.json({
      success: true,
      message: 'Cita iniciada',
      data: convertBigIntToString(citaActualizada),
    })
  } catch (error: any) {
    console.error('Error al iniciar cita:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error al iniciar cita',
    })
  }
}

/**
 * Marcar cita como completada
 * PATCH /api/citas/:id/completar
 */
export const completarCita = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { notas } = req.body

    const cita = await prisma.cita.findUnique({
      where: { id: BigInt(id) },
    })

    if (!cita) {
      res.status(404).json({
        success: false,
        message: 'Cita no encontrada',
      })
      return
    }

    if (cita.estado === 'COMPLETADA') {
      res.status(400).json({
        success: false,
        message: 'La cita ya está completada',
      })
      return
    }

    const citaActualizada = await prisma.cita.update({
      where: { id: BigInt(id) },
      data: {
        estado: 'COMPLETADA',
        notas: notas || cita.notas,
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
      },
    })

    res.json({
      success: true,
      message: 'Cita completada exitosamente',
      data: convertBigIntToString(citaActualizada),
    })
  } catch (error: any) {
    console.error('Error al completar cita:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error al completar cita',
    })
  }
}
