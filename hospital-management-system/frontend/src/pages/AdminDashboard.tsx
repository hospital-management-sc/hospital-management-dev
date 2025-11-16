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
          <button className={styles['admin-btn']}>
            <span className={styles.icon}>👥</span>
            <span>Gestionar Usuarios</span>
          </button>
          <button className={styles['admin-btn']}>
            <span className={styles.icon}>📊</span>
            <span>Reportes Generales</span>
          </button>
          <button className={styles['admin-btn']}>
            <span className={styles.icon}>⚙️</span>
            <span>Configuración</span>
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
    nroHistoria: '',
    apellidosNombres: '',
    ci: '',
    fechaNacimiento: '',
    sexo: '',
    nacionalidad: '',
    direccion: '',
    telefono: '',
    lugarNacimiento: '',
    estado: '',
    region: '',
    // Datos militares opcionales
    grado: '',
    componente: '',
    unidad: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Registrando paciente:', formData)
    // TODO: Implementar llamada al API
    alert('Funcionalidad de registro en desarrollo')
  }

  return (
    <section className="form-section">
      <h2>Registrar Nuevo Paciente</h2>
      <p className="form-description">Complete el formulario para registrar un nuevo paciente en el sistema</p>
      
      <form onSubmit={handleSubmit} className="patient-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Nro. Historia Clínica *</label>
            <input
              type="text"
              required
              value={formData.nroHistoria}
              onChange={(e) => setFormData({...formData, nroHistoria: e.target.value})}
              placeholder="HC-2025-001"
            />
          </div>

          <div className="form-group">
            <label>Apellidos y Nombres *</label>
            <input
              type="text"
              required
              value={formData.apellidosNombres}
              onChange={(e) => setFormData({...formData, apellidosNombres: e.target.value})}
              placeholder="Apellidos y Nombres completos"
            />
          </div>

          <div className="form-group">
            <label>Cédula de Identidad *</label>
            <input
              type="text"
              required
              value={formData.ci}
              onChange={(e) => setFormData({...formData, ci: e.target.value})}
              placeholder="V-12345678"
            />
          </div>

          <div className="form-group">
            <label>Fecha de Nacimiento</label>
            <input
              type="date"
              value={formData.fechaNacimiento}
              onChange={(e) => setFormData({...formData, fechaNacimiento: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Sexo</label>
            <select
              value={formData.sexo}
              onChange={(e) => setFormData({...formData, sexo: e.target.value})}
            >
              <option value="">Seleccione...</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>

          <div className="form-group">
            <label>Nacionalidad</label>
            <input
              type="text"
              value={formData.nacionalidad}
              onChange={(e) => setFormData({...formData, nacionalidad: e.target.value})}
              placeholder="Venezolana"
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

          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => setFormData({...formData, telefono: e.target.value})}
              placeholder="0412-1234567"
            />
          </div>

          <div className="form-group">
            <label>Lugar de Nacimiento</label>
            <input
              type="text"
              value={formData.lugarNacimiento}
              onChange={(e) => setFormData({...formData, lugarNacimiento: e.target.value})}
              placeholder="Ciudad, Estado"
            />
          </div>

          <div className="form-group">
            <label>Estado</label>
            <input
              type="text"
              value={formData.estado}
              onChange={(e) => setFormData({...formData, estado: e.target.value})}
              placeholder="Estado de residencia"
            />
          </div>

          <div className="form-group">
            <label>Región</label>
            <input
              type="text"
              value={formData.region}
              onChange={(e) => setFormData({...formData, region: e.target.value})}
              placeholder="Región"
            />
          </div>
        </div>

        {/* Datos de Personal Militar (Opcionales) */}
        <div className="section-divider">
          <h3>Datos de Personal Militar (Opcional)</h3>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Grado</label>
            <input
              type="text"
              value={formData.grado}
              onChange={(e) => setFormData({...formData, grado: e.target.value})}
              placeholder="Ej: Capitán, Teniente"
            />
          </div>

          <div className="form-group">
            <label>Componente</label>
            <input
              type="text"
              value={formData.componente}
              onChange={(e) => setFormData({...formData, componente: e.target.value})}
              placeholder="Ej: Ejército, Aviación"
            />
          </div>

          <div className="form-group full-width">
            <label>Unidad</label>
            <input
              type="text"
              value={formData.unidad}
              onChange={(e) => setFormData({...formData, unidad: e.target.value})}
              placeholder="Unidad militar asignada"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Registrar Paciente
          </button>
          <button type="button" className="btn-secondary">
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
    <section className="form-section">
      <h2>Generar Cita Médica</h2>
      <p className="form-description">Busque el paciente y programe una cita médica</p>

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
          <div className="form-grid">
            <div className="form-group">
              <label>Fecha *</label>
              <input
                type="date"
                required
                value={appointmentData.fecha}
                onChange={(e) => setAppointmentData({...appointmentData, fecha: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Hora *</label>
              <input
                type="time"
                required
                value={appointmentData.hora}
                onChange={(e) => setAppointmentData({...appointmentData, hora: e.target.value})}
              />
            </div>

            <div className="form-group">
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

            <div className="form-group">
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
    <section className="form-section">
      <h2>Consultar Historia Clínica</h2>
      <p className="form-description">Busque pacientes por CI o número de historia clínica</p>

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
