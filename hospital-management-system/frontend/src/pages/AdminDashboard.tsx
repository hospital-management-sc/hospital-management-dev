/**
 * Dashboard para Personal Administrativo
 * Vista especializada para gestión administrativa y control de usuarios
 */

import { useState } from 'react'
import styles from './AdminDashboard.module.css'

type ViewMode = 'main' | 'register-patient' | 'create-appointment' | 'search-patient'

export default function AdminDashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('main')

  const renderMainView = () => (
    <>
      {/* Sección de Estadísticas */}
      <section className={styles['dashboard-stats']}>
        <div className={styles.card}>
          <h2>Total de Pacientes</h2>
          <div className={styles['stat-value']}>0</div>
        </div>
        <div className={styles.card}>
          <h2>Usuarios Activos</h2>
          <div className={styles['stat-value']}>0</div>
        </div>
        <div className={styles.card}>
          <h2>Citas Programadas Hoy</h2>
          <div className={styles['stat-value']}>0</div>
        </div>
        <div className={styles.card}>
          <h2>Registros de Auditoría</h2>
          <div className={styles['stat-value']}>0</div>
        </div>
      </section>

      {/* Sección de Gestión Principal */}
      <section className={styles['management-section']}>
        <h2>Gestión Principal</h2>
        <div className={styles['admin-grid']}>
          <button 
            className={styles['admin-btn']}
            onClick={() => setViewMode('register-patient')}
          >
            <span className={styles.icon}>➕</span>
            <span>Registrar Nuevo Paciente</span>
          </button>
          <button 
            className={styles['admin-btn']}
            onClick={() => setViewMode('create-appointment')}
          >
            <span className={styles.icon}>📅</span>
            <span>Generar Cita Médica</span>
          </button>
          <button 
            className={styles['admin-btn']}
            onClick={() => setViewMode('search-patient')}
          >
            <span className={styles.icon}>🔍</span>
            <span>Consultar Historia Clínica</span>
          </button>
        </div>
      </section>

      {/* Sección de Actividad Reciente */}
      <section className={styles['recent-activity']}>
        <h2>Actividad Reciente</h2>
        <div className={styles['activity-placeholder']}>
          <p>Registros de actividad reciente se mostrarán aquí</p>
        </div>
      </section>
    </>
  )

  return (
    <div className={styles['dashboard-container']}>
      <header className={styles['dashboard-header']}>
        <div className={styles['header-content']}>
          <div>
            <h1>Dashboard Administrativo</h1>
            <p className={styles.subtitle}>Panel de control administrativo del sistema</p>
          </div>
          {viewMode !== 'main' && (
            <button 
              className={styles['back-btn']}
              onClick={() => setViewMode('main')}
            >
              ← Volver al Dashboard
            </button>
          )}
        </div>
      </header>

      <main className={styles['dashboard-main']}>
        {viewMode === 'main' && renderMainView()}
        {viewMode === 'register-patient' && <RegisterPatientForm />}
        {viewMode === 'create-appointment' && <CreateAppointmentForm />}
        {viewMode === 'search-patient' && <SearchPatientView />}
      </main>
    </div>
  )
}

// Componente para registrar nuevo paciente
function RegisterPatientForm() {
  const [formData, setFormData] = useState({
    // ADMISION
    nroHistoria: '',
    formaIngreso: 'AMBULANTE',
    fechaAdmision: '',
    horaAdmision: '',
    firmaFacultativo: '',
    habitacion: '',
    
    // PACIENTE - DATOS PERSONALES
    apellidosNombres: '',
    ciTipo: 'V',
    ciNumeros: '',
    fechaNacimiento: '',
    sexo: '',
    lugarNacimiento: '',
    nacionalidad: '',
    estado: '',
    religion: '',
    direccion: '',
    telefonoOperador: '0412',
    telefonoNumeros: '',
    
    // PERSONAL MILITAR
    grado: '',
    estadoMilitar: '', // '' | 'activo' | 'disponible' | 'resActiva'
    componente: '',
    unidad: '',
    
    // ESTANCIA HOSPITALARIA
    diagnosticoIngreso: '',
    diagnosticoEgreso: '',
    fechaAlta: '',
    diasHospitalizacion: '',
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})

  // Calcular edad desde fecha de nacimiento
  const calcularEdad = (fechaNac: string): number => {
    if (!fechaNac) return 0
    const hoy = new Date()
    const nac = new Date(fechaNac)
    let edad = hoy.getFullYear() - nac.getFullYear()
    const diferenciaMeses = hoy.getMonth() - nac.getMonth()
    if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < nac.getDate())) {
      edad--
    }
    return edad
  }

  // Validar formato de historia clínica (00-00-00)
  const validateHistoria = (value: string): boolean => {
    // Permitir entrada parcial (números y guiones)
    const pattern = /^[\d-]*$/
    return pattern.test(value)
  }

  // Validar que el formato completo sea correcto
  const isHistoriaFormatValid = (value: string): boolean => {
    const pattern = /^\d{2}-\d{2}-\d{2}$/
    return pattern.test(value)
  }

  // Validar números de cédula (8 dígitos)
  const validateCINumeros = (value: string): boolean => {
    const pattern = /^\d{0,8}$/
    return pattern.test(value)
  }

  // Validar números de teléfono (7 dígitos)
  const validateTelefonoNumeros = (value: string): boolean => {
    const pattern = /^\d{0,7}$/
    return pattern.test(value)
  }

  const handleHistoriaChange = (value: string) => {
    // Permitir entrada parcial
    if (validateHistoria(value)) {
      setFormData({...formData, nroHistoria: value})
      // Solo mostrar error si está completo pero mal formateado
      if (value.length >= 8 && !isHistoriaFormatValid(value)) {
        setErrors({...errors, nroHistoria: 'Formato: 00-00-00'})
      } else {
        setErrors({...errors, nroHistoria: ''})
      }
    }
  }

  const handleCINumerosChange = (value: string) => {
    if (validateCINumeros(value)) {
      setFormData({...formData, ciNumeros: value})
      setErrors({...errors, ciNumeros: ''})
    }
  }

  const handleTelefonoNumerosChange = (value: string) => {
    if (validateTelefonoNumeros(value)) {
      setFormData({...formData, telefonoNumeros: value})
      setErrors({...errors, telefonoNumeros: ''})
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar campos requeridos
    const newErrors: {[key: string]: string} = {}
    if (!formData.nroHistoria) newErrors.nroHistoria = 'Requerido'
    if (formData.nroHistoria && !isHistoriaFormatValid(formData.nroHistoria)) newErrors.nroHistoria = 'Formato: 00-00-00'
    if (!formData.apellidosNombres) newErrors.apellidosNombres = 'Requerido'
    if (!formData.ciNumeros) newErrors.ciNumeros = 'Requerido'
    if (!formData.fechaAdmision) newErrors.fechaAdmision = 'Requerido'
    if (!formData.horaAdmision) newErrors.horaAdmision = 'Requerido'
    if (!formData.sexo) newErrors.sexo = 'Requerido'
    if (!formData.fechaNacimiento) newErrors.fechaNacimiento = 'Requerido'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const ciCompleta = `${formData.ciTipo}-${formData.ciNumeros}`
    const telefonoCompleto = formData.telefonoNumeros ? `${formData.telefonoOperador}-${formData.telefonoNumeros}` : ''
    
    // Preparar datos para enviar al backend
    const datosRegistro = {
      nroHistoria: formData.nroHistoria,
      formaIngreso: formData.formaIngreso,
      fechaAdmision: formData.fechaAdmision,
      horaAdmision: formData.horaAdmision,
      firmaFacultativo: formData.firmaFacultativo,
      habitacion: formData.habitacion,
      apellidosNombres: formData.apellidosNombres,
      ci: ciCompleta,
      ciTipo: formData.ciTipo,
      fechaNacimiento: formData.fechaNacimiento,
      sexo: formData.sexo,
      lugarNacimiento: formData.lugarNacimiento,
      nacionalidad: formData.nacionalidad,
      estado: formData.estado,
      religion: formData.religion,
      direccion: formData.direccion,
      telefono: telefonoCompleto,
      grado: formData.grado,
      estadoMilitar: formData.estadoMilitar,
      componente: formData.componente,
      unidad: formData.unidad,
      diagnosticoIngreso: formData.diagnosticoIngreso,
      diagnosticoEgreso: formData.diagnosticoEgreso,
      fechaAlta: formData.fechaAlta,
      diasHospitalizacion: formData.diasHospitalizacion,
    }

    try {
      // Detectar URL del API según el entorno
      const apiUrl = window.location.hostname.includes('app.github.dev')
        ? window.location.origin.replace('-5173.', '-3001.') + '/api/pacientes'
        : 'http://localhost:3001/api/pacientes'

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosRegistro),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Error al registrar el paciente')
      }

      // Éxito - mostrar mensaje y limpiar formulario
      alert(`✅ Paciente registrado exitosamente\nNro. Historia: ${result.data.nroHistoria}\nCI: ${result.data.ci}`)
      
      // Limpiar formulario
      setFormData({
        nroHistoria: '',
        formaIngreso: 'AMBULANTE',
        fechaAdmision: '',
        horaAdmision: '',
        firmaFacultativo: '',
        habitacion: '',
        apellidosNombres: '',
        ciTipo: 'V',
        ciNumeros: '',
        fechaNacimiento: '',
        sexo: '',
        lugarNacimiento: '',
        nacionalidad: '',
        estado: '',
        religion: '',
        direccion: '',
        telefonoOperador: '0412',
        telefonoNumeros: '',
        grado: '',
        estadoMilitar: '',
        componente: '',
        unidad: '',
        diagnosticoIngreso: '',
        diagnosticoEgreso: '',
        fechaAlta: '',
        diasHospitalizacion: '',
      })
      setErrors({})
    } catch (error: any) {
      console.error('Error:', error)
      alert(`❌ Error: ${error.message}`)
      setErrors({ submit: error.message })
    }
  }

  return (
    <section className={styles["form-section"]}>
      <h2>Control de Admisión - Registro de Paciente</h2>
      <p className={styles["form-description"]}>Complete todos los campos requeridos (*) según el formulario de control de admisión</p>
      
      <form onSubmit={handleSubmit} className={styles["patient-form"]}>
        {/* SECCIÓN 1: DATOS DE ADMISIÓN */}
        <div className={styles["form-section-header"]}>
          <h3>1. Datos de Admisión</h3>
        </div>

        <div className={styles["form-grid"]}>
          <div className={styles["form-group"]}>
            <label>Nro. Historia Clínica * <span className={styles["hint"]}>(00-00-00)</span></label>
            <input
              type="text"
              required
              value={formData.nroHistoria}
              onChange={(e) => handleHistoriaChange(e.target.value)}
              placeholder="00-00-00"
              maxLength={8}
            />
            {errors.nroHistoria && <span className={styles["error-message"]}>{errors.nroHistoria}</span>}
          </div>

          <div className={styles["form-group"]}>
            <label>Forma de Ingreso *</label>
            <div className={styles["radio-group"]}>
              <label className={styles["radio-label"]}>
                <input
                  type="radio"
                  name="formaIngreso"
                  value="AMBULANTE"
                  checked={formData.formaIngreso === 'AMBULANTE'}
                  onChange={(e) => setFormData({...formData, formaIngreso: e.target.value})}
                />
                Ambulante
              </label>
              <label className={styles["radio-label"]}>
                <input
                  type="radio"
                  name="formaIngreso"
                  value="AMBULANCIA"
                  checked={formData.formaIngreso === 'AMBULANCIA'}
                  onChange={(e) => setFormData({...formData, formaIngreso: e.target.value})}
                />
                Ambulancia
              </label>
            </div>
          </div>

          <div className={styles["form-group"]}>
            <label>Fecha de Admisión *</label>
            <input
              type="date"
              required
              value={formData.fechaAdmision}
              onChange={(e) => setFormData({...formData, fechaAdmision: e.target.value})}
            />
            {errors.fechaAdmision && <span className={styles["error-message"]}>{errors.fechaAdmision}</span>}
          </div>

          <div className={styles["form-group"]}>
            <label>Hora de Admisión *</label>
            <input
              type="time"
              required
              value={formData.horaAdmision}
              onChange={(e) => setFormData({...formData, horaAdmision: e.target.value})}
            />
            {errors.horaAdmision && <span className={styles["error-message"]}>{errors.horaAdmision}</span>}
          </div>

          <div className={styles["form-group"]}>
            <label>Habitación</label>
            <input
              type="text"
              value={formData.habitacion}
              onChange={(e) => setFormData({...formData, habitacion: e.target.value})}
              placeholder="Ej: 101, 205"
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Firma de Facultativo</label>
            <input
              type="text"
              value={formData.firmaFacultativo}
              onChange={(e) => setFormData({...formData, firmaFacultativo: e.target.value})}
              placeholder="Nombre y firma del médico"
            />
          </div>
        </div>

        {/* SECCIÓN 2: DATOS PERSONALES DEL PACIENTE */}
        <div className={styles["form-section-header"]}>
          <h3>2. Datos Personales del Paciente</h3>
        </div>

        <div className={styles["form-grid"]}>
          <div className={styles["form-group"]}>
            <label>Apellidos y Nombres *</label>
            <input
              type="text"
              required
              value={formData.apellidosNombres}
              onChange={(e) => setFormData({...formData, apellidosNombres: e.target.value})}
              placeholder="Apellidos y Nombres completos"
            />
            {errors.apellidosNombres && <span className={styles["error-message"]}>{errors.apellidosNombres}</span>}
          </div>

          <div className={styles["form-group"]}>
            <label>Cédula de Identidad *</label>
            <div className={styles["dual-input-group"]}>
              <select
                value={formData.ciTipo}
                onChange={(e) => setFormData({...formData, ciTipo: e.target.value})}
              >
                <option value="V">V</option>
                <option value="E">E</option>
                <option value="P">P</option>
              </select>
              <input
                type="text"
                required
                value={formData.ciNumeros}
                onChange={(e) => handleCINumerosChange(e.target.value)}
                placeholder="12345678"
                maxLength={8}
              />
            </div>
            {errors.ciNumeros && <span className={styles["error-message"]}>{errors.ciNumeros}</span>}
          </div>

          <div className={styles["form-group"]}>
            <label>Fecha de Nacimiento *</label>
            <input
              type="date"
              required
              value={formData.fechaNacimiento}
              onChange={(e) => setFormData({...formData, fechaNacimiento: e.target.value})}
            />
            {errors.fechaNacimiento && <span className={styles["error-message"]}>{errors.fechaNacimiento}</span>}
          </div>

          <div className={styles["form-group"]}>
            <label>Edad (Calculada)</label>
            <input
              type="number"
              disabled
              value={calcularEdad(formData.fechaNacimiento)}
              placeholder="Se calcula automáticamente"
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Lugar de Nacimiento</label>
            <input
              type="text"
              value={formData.lugarNacimiento}
              onChange={(e) => setFormData({...formData, lugarNacimiento: e.target.value})}
              placeholder="Ciudad, Estado"
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Sexo *</label>
            <select
              required
              value={formData.sexo}
              onChange={(e) => setFormData({...formData, sexo: e.target.value})}
            >
              <option value="">Seleccione...</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
            {errors.sexo && <span className={styles["error-message"]}>{errors.sexo}</span>}
          </div>

          <div className={styles["form-group"]}>
            <label>Nacionalidad</label>
            <input
              type="text"
              value={formData.nacionalidad}
              onChange={(e) => setFormData({...formData, nacionalidad: e.target.value})}
              placeholder="Venezolana"
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Estado</label>
            <input
              type="text"
              value={formData.estado}
              onChange={(e) => setFormData({...formData, estado: e.target.value})}
              placeholder="Estado de residencia"
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Religión</label>
            <input
              type="text"
              value={formData.religion}
              onChange={(e) => setFormData({...formData, religion: e.target.value})}
              placeholder="Religión"
            />
          </div>

          <div className="form-group full-width">
            <label>Dirección</label>
            <input
              type="text"
              value={formData.direccion}
              onChange={(e) => setFormData({...formData, direccion: e.target.value})}
              placeholder="Dirección completa de residencia"
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Teléfono</label>
            <div className={styles["dual-input-group"]}>
              <select
                value={formData.telefonoOperador}
                onChange={(e) => setFormData({...formData, telefonoOperador: e.target.value})}
              >
                <option value="0412">0412</option>
                <option value="0422">0422</option>
                <option value="0416">0416</option>
                <option value="0426">0426</option>
                <option value="0414">0414</option>
                <option value="0424">0424</option>
              </select>
              <input
                type="text"
                value={formData.telefonoNumeros}
                onChange={(e) => handleTelefonoNumerosChange(e.target.value)}
                placeholder="1234567"
                maxLength={7}
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: DATOS DE PERSONAL MILITAR */}
        <div className={styles["form-section-header"]}>
          <h3>3. Datos de Personal Militar (Opcional)</h3>
        </div>

        <div className={styles["form-grid"]}>
          <div className={styles["form-group"]}>
            <label>Grado</label>
            <input
              type="text"
              value={formData.grado}
              onChange={(e) => setFormData({...formData, grado: e.target.value})}
              placeholder="Ej: Capitán, Teniente"
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Componente</label>
            <input
              type="text"
              value={formData.componente}
              onChange={(e) => setFormData({...formData, componente: e.target.value})}
              placeholder="Ej: Ejército, Aviación"
            />
          </div>

          <div className="form-group full-width">
            <label>Estado Militar</label>
            <div className={styles["radio-group-inline"]}>
              <label className={styles["radio-label"]}>
                <input
                  type="radio"
                  name="estadoMilitar"
                  value="activo"
                  checked={formData.estadoMilitar === 'activo'}
                  onChange={(e) => setFormData({...formData, estadoMilitar: e.target.value})}
                />
                Activo
              </label>
              <label className={styles["radio-label"]}>
                <input
                  type="radio"
                  name="estadoMilitar"
                  value="disponible"
                  checked={formData.estadoMilitar === 'disponible'}
                  onChange={(e) => setFormData({...formData, estadoMilitar: e.target.value})}
                />
                Disponible
              </label>
              <label className={styles["radio-label"]}>
                <input
                  type="radio"
                  name="estadoMilitar"
                  value="resActiva"
                  checked={formData.estadoMilitar === 'resActiva'}
                  onChange={(e) => setFormData({...formData, estadoMilitar: e.target.value})}
                />
                Reserva Activa
              </label>
            </div>
          </div>
        </div>

        {/* SECCIÓN 4: DATOS DE ESTANCIA HOSPITALARIA */}
        <div className={styles["form-section-header"]}>
          <h3>4. Datos de Estancia Hospitalaria</h3>
        </div>

        <div className={styles["form-grid"]}>
          <div className={styles["form-group"]}>
            <label>Diagnóstico de Ingreso</label>
            <input
              type="text"
              value={formData.diagnosticoIngreso}
              onChange={(e) => setFormData({...formData, diagnosticoIngreso: e.target.value})}
              placeholder="Ej: Hipertensión Arterial"
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Diagnóstico de Egreso</label>
            <input
              type="text"
              value={formData.diagnosticoEgreso}
              onChange={(e) => setFormData({...formData, diagnosticoEgreso: e.target.value})}
              placeholder="Ej: Hipertensión controlada"
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Fecha de Alta</label>
            <input
              type="date"
              value={formData.fechaAlta}
              onChange={(e) => setFormData({...formData, fechaAlta: e.target.value})}
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Días de Hospitalización</label>
            <input
              type="number"
              value={formData.diasHospitalizacion}
              onChange={(e) => setFormData({...formData, diasHospitalizacion: e.target.value})}
              placeholder="0"
              min="0"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Registrar Admisión
          </button>
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => {
              setFormData({
                nroHistoria: '',
                formaIngreso: 'AMBULANTE',
                fechaAdmision: '',
                horaAdmision: '',
                firmaFacultativo: '',
                habitacion: '',
                apellidosNombres: '',
                ciTipo: 'V',
                ciNumeros: '',
                fechaNacimiento: '',
                sexo: '',
                lugarNacimiento: '',
                nacionalidad: '',
                estado: '',
                religion: '',
                direccion: '',
                telefonoOperador: '0412',
                telefonoNumeros: '',
                grado: '',
                estadoMilitar: '',
                componente: '',
                unidad: '',
                diagnosticoIngreso: '',
                diagnosticoEgreso: '',
                fechaAlta: '',
                diasHospitalizacion: '',
              })
              setErrors({})
            }}
          >
            Limpiar Formulario
          </button>
        </div>
      </form>
    </section>
  )
}

// Componente para crear cita médica
function CreateAppointmentForm() {
  const [searchCI, setSearchCI] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [appointmentData, setAppointmentData] = useState({
    fecha: '',
    hora: '',
    especialidad: '',
    medico: '',
    motivo: '',
  })

  const handleSearchPatient = () => {
    // TODO: Buscar paciente por CI
    console.log('Buscando paciente:', searchCI)
    // Simulación
    setSelectedPatient({
      ci: searchCI,
      nombre: 'Paciente de Prueba',
      nroHistoria: 'HC-2025-001',
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Creando cita:', { selectedPatient, appointmentData })
    // TODO: Implementar llamada al API
    alert('Funcionalidad de citas en desarrollo')
  }

  return (
    <section className={styles["form-section"]}>
      <h2>Generar Cita Médica</h2>
      <p className={styles["form-description"]}>Busque el paciente y programe una cita médica</p>

      {/* Búsqueda de Paciente */}
      <div className="search-patient-box">
        <h3>1. Buscar Paciente</h3>
        <div className="search-input-group">
          <input
            type="text"
            value={searchCI}
            onChange={(e) => setSearchCI(e.target.value)}
            placeholder="Ingrese CI del paciente (Ej: V-12345678)"
            className="search-input"
          />
          <button onClick={handleSearchPatient} className="btn-search">
            Buscar
          </button>
        </div>

        {selectedPatient && (
          <div className="patient-info-card">
            <h4>Paciente Seleccionado</h4>
            <p><strong>CI:</strong> {selectedPatient.ci}</p>
            <p><strong>Nombre:</strong> {selectedPatient.nombre}</p>
            <p><strong>Historia:</strong> {selectedPatient.nroHistoria}</p>
          </div>
        )}
      </div>

      {/* Formulario de Cita */}
      {selectedPatient && (
        <form onSubmit={handleSubmit} className="appointment-form">
          <h3>2. Datos de la Cita</h3>
          <div className={styles["form-grid"]}>
            <div className={styles["form-group"]}>
              <label>Fecha *</label>
              <input
                type="date"
                required
                value={appointmentData.fecha}
                onChange={(e) => setAppointmentData({...appointmentData, fecha: e.target.value})}
              />
            </div>

            <div className={styles["form-group"]}>
              <label>Hora *</label>
              <input
                type="time"
                required
                value={appointmentData.hora}
                onChange={(e) => setAppointmentData({...appointmentData, hora: e.target.value})}
              />
            </div>

            <div className={styles["form-group"]}>
              <label>Especialidad *</label>
              <select
                required
                value={appointmentData.especialidad}
                onChange={(e) => setAppointmentData({...appointmentData, especialidad: e.target.value})}
              >
                <option value="">Seleccione especialidad...</option>
                <option value="Medicina General">Medicina General</option>
                <option value="Cardiología">Cardiología</option>
                <option value="Traumatología">Traumatología</option>
                <option value="Pediatría">Pediatría</option>
                <option value="Ginecología">Ginecología</option>
              </select>
            </div>

            <div className={styles["form-group"]}>
              <label>Médico</label>
              <input
                type="text"
                value={appointmentData.medico}
                onChange={(e) => setAppointmentData({...appointmentData, medico: e.target.value})}
                placeholder="Nombre del médico"
              />
            </div>

            <div className="form-group full-width">
              <label>Motivo de la Consulta</label>
              <textarea
                value={appointmentData.motivo}
                onChange={(e) => setAppointmentData({...appointmentData, motivo: e.target.value})}
                placeholder="Describa brevemente el motivo de la consulta"
                rows={3}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Programar Cita
            </button>
          </div>
        </form>
      )}
    </section>
  )
}

// Componente para buscar y consultar historias clínicas
function SearchPatientView() {
  const [searchType, setSearchType] = useState<'ci' | 'historia'>('ci')
  const [searchValue, setSearchValue] = useState('')
  const [patientData, setPatientData] = useState<any>(null)

  const handleSearch = () => {
    console.log('Buscando paciente:', { searchType, searchValue })
    // TODO: Implementar búsqueda real
    // Simulación
    setPatientData({
      nroHistoria: 'HC-2025-001',
      apellidosNombres: 'Pérez Gómez Juan Carlos',
      ci: 'V-12345678',
      fechaNacimiento: '1980-05-15',
      sexo: 'M',
      telefono: '0412-1234567',
      direccion: 'Caracas, Venezuela',
      ultimaVisita: '2025-11-10',
      admisiones: 3,
      encuentros: 12,
    })
  }

  return (
    <section className={styles["form-section"]}>
      <h2>Consultar Historia Clínica</h2>
      <p className={styles["form-description"]}>Busque pacientes por CI o número de historia clínica</p>

      <div className="search-options">
        <div className="search-type-selector">
          <label>
            <input
              type="radio"
              checked={searchType === 'ci'}
              onChange={() => setSearchType('ci')}
            />
            Buscar por CI
          </label>
          <label>
            <input
              type="radio"
              checked={searchType === 'historia'}
              onChange={() => setSearchType('historia')}
            />
            Buscar por Nro. Historia
          </label>
        </div>

        <div className="search-input-group">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={searchType === 'ci' ? 'Ej: V-12345678' : 'Ej: HC-2025-001'}
            className="search-input"
          />
          <button onClick={handleSearch} className="btn-search">
            Buscar Paciente
          </button>
        </div>
      </div>

      {patientData && (
        <div className="patient-details">
          <h3>Información del Paciente</h3>
          <div className="details-grid">
            <div className="detail-item">
              <strong>Nro. Historia:</strong>
              <span>{patientData.nroHistoria}</span>
            </div>
            <div className="detail-item">
              <strong>Nombre Completo:</strong>
              <span>{patientData.apellidosNombres}</span>
            </div>
            <div className="detail-item">
              <strong>CI:</strong>
              <span>{patientData.ci}</span>
            </div>
            <div className="detail-item">
              <strong>Fecha de Nacimiento:</strong>
              <span>{patientData.fechaNacimiento}</span>
            </div>
            <div className="detail-item">
              <strong>Sexo:</strong>
              <span>{patientData.sexo === 'M' ? 'Masculino' : 'Femenino'}</span>
            </div>
            <div className="detail-item">
              <strong>Teléfono:</strong>
              <span>{patientData.telefono}</span>
            </div>
            <div className="detail-item">
              <strong>Dirección:</strong>
              <span>{patientData.direccion}</span>
            </div>
            <div className="detail-item">
              <strong>Última Visita:</strong>
              <span>{patientData.ultimaVisita}</span>
            </div>
          </div>

          <div className="patient-stats">
            <div className="stat-card">
              <h4>Admisiones</h4>
              <p className="stat-number">{patientData.admisiones}</p>
            </div>
            <div className="stat-card">
              <h4>Encuentros</h4>
              <p className="stat-number">{patientData.encuentros}</p>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn-primary">Ver Historia Completa</button>
            <button className="btn-secondary">Imprimir Resumen</button>
            <button className="btn-secondary">Programar Cita</button>
          </div>
        </div>
      )}
    </section>
  )
}
