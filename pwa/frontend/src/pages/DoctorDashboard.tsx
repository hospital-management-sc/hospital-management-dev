/**
 * Dashboard para Médicos y Personal Clínico
 * Vista especializada para atención médica y gestión de pacientes
 */

import { useState, useEffect } from 'react'
import styles from './DoctorDashboard.module.css'
import { API_BASE_URL } from '../utils/constants'
import admisionesService from '../services/admisiones.service'
import type { Admision } from '../services/admisiones.service'
import { encuentrosService } from '../services/encuentros.service'
import type { Encuentro } from '../services/encuentros.service'
import EncuentroDetailModal from '../components/EncuentroDetailModal'
import EncuentrosList from '../components/EncuentrosList'

type ViewMode = 
  | 'main' 
  | 'hospitalized-patients' 
  | 'register-encounter' 
  | 'search-patient' 
  | 'patient-history'
  | 'today-encounters'
  | 'my-appointments'

interface DoctorStats {
  pacientesHospitalizados: number
  encuentrosHoy: number
  citasHoy: number
  altasPendientes: number
}

interface PatientBasic {
  id: string
  nroHistoria: string
  apellidosNombres: string
  ci: string
  fechaNacimiento?: string
  sexo?: string
  telefono?: string
  direccion?: string
  personalMilitar?: {
    grado?: string
    componente?: string
    unidad?: string
    estadoMilitar?: string
  }
  admisiones?: any[]
  encuentros?: any[]
}

export default function DoctorDashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('main')
  const [stats, setStats] = useState<DoctorStats>({
    pacientesHospitalizados: 0,
    encuentrosHoy: 0,
    citasHoy: 0,
    altasPendientes: 0
  })
  const [loading, setLoading] = useState(true)
  const [selectedPatient, setSelectedPatient] = useState<PatientBasic | null>(null)

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 60000) // Actualizar cada minuto
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      // Obtener pacientes hospitalizados activos
      const admisionesResponse = await admisionesService.listarAdmisionesActivas({})
      
      // Obtener encuentros de hoy
      let encuentrosHoyCount = 0
      try {
        const encuentrosHoy = await encuentrosService.obtenerHoy()
        encuentrosHoyCount = encuentrosHoy.length || 0
      } catch {
        // Si falla, dejamos en 0
      }
      
      // Obtener citas de hoy
      let citasHoyCount = 0
      try {
        const citasResponse = await fetch(`${API_BASE_URL}/dashboard/stats`)
        const citasData = await citasResponse.json()
        citasHoyCount = citasData.data?.citasProgramadasHoy || 0
      } catch {
        // Si falla, dejamos en 0
      }

      setStats({
        pacientesHospitalizados: admisionesResponse.total || 0,
        encuentrosHoy: encuentrosHoyCount,
        citasHoy: citasHoyCount,
        altasPendientes: 0 // Por implementar
      })
    } catch (error) {
      console.error('Error fetching doctor stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderMainView = () => (
    <>
      {/* Sección de Estadísticas del Médico */}
      <section className={styles['dashboard-stats']}>
        <div className={styles.card}>
          <h2>Pacientes Hospitalizados</h2>
          <div className={styles['stat-value']}>
            {loading ? '...' : stats.pacientesHospitalizados}
          </div>
          <span className={styles['stat-label']}>Actualmente internados</span>
        </div>
        <div className={styles.card}>
          <h2>Atenciones Hoy</h2>
          <div className={styles['stat-value']}>
            {loading ? '...' : stats.encuentrosHoy}
          </div>
          <span className={styles['stat-label']}>Encuentros registrados</span>
        </div>
        <div className={styles.card}>
          <h2>Citas Programadas</h2>
          <div className={styles['stat-value']}>
            {loading ? '...' : stats.citasHoy}
          </div>
          <span className={styles['stat-label']}>Para hoy</span>
        </div>
        <div className={styles.card}>
          <h2>Altas Pendientes</h2>
          <div className={styles['stat-value']}>
            {loading ? '...' : stats.altasPendientes}
          </div>
          <span className={styles['stat-label']}>Por procesar</span>
        </div>
      </section>

      {/* Sección de Acciones Clínicas */}
      <section className={styles['management-section']}>
        <h2>Acciones Clínicas</h2>
        <div className={styles['action-grid']}>
          <button 
            className={styles['action-btn']}
            onClick={() => setViewMode('register-encounter')}
          >
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
            <div className={styles['btn-content']}>
              <span className={styles['btn-title']}>Registrar Encuentro</span>
              <span className={styles['btn-description']}>Documente consultas, emergencias y evoluciones</span>
            </div>
          </button>

          <button 
            className={styles['action-btn']}
            onClick={() => setViewMode('hospitalized-patients')}
          >
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <div className={styles['btn-content']}>
              <span className={styles['btn-title']}>Pacientes Hospitalizados</span>
              <span className={styles['btn-description']}>Visualice pacientes actualmente internados</span>
            </div>
          </button>

          <button 
            className={styles['action-btn']}
            onClick={() => setViewMode('today-encounters')}
          >
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <path d="M8 14h.01M12 14h.01M16 14h.01" />
            </svg>
            <div className={styles['btn-content']}>
              <span className={styles['btn-title']}>Atenciones del Día</span>
              <span className={styles['btn-description']}>Revise los encuentros registrados hoy</span>
            </div>
          </button>

          <button 
            className={styles['action-btn']}
            onClick={() => setViewMode('search-patient')}
          >
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <div className={styles['btn-content']}>
              <span className={styles['btn-title']}>Buscar Paciente</span>
              <span className={styles['btn-description']}>Consulte historia clínica y antecedentes</span>
            </div>
          </button>

          <button 
            className={styles['action-btn']}
            onClick={() => setViewMode('my-appointments')}
          >
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <div className={styles['btn-content']}>
              <span className={styles['btn-title']}>Mis Citas</span>
              <span className={styles['btn-description']}>Gestione sus citas programadas</span>
            </div>
          </button>

          <button 
            className={styles['action-btn']}
            onClick={() => alert('Próximamente: Registrar Alta Médica')}
          >
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 11 12 14 22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            <div className={styles['btn-content']}>
              <span className={styles['btn-title']}>Registrar Alta</span>
              <span className={styles['btn-description']}>Procese altas médicas de pacientes</span>
            </div>
          </button>
        </div>
      </section>
    </>
  )

  return (
    <div className={styles['dashboard-container']}>
      <header className={styles['dashboard-header']}>
        <div className={styles['header-content']}>
          <div>
            <h1>Dashboard Médico</h1>
            <p className={styles.subtitle}>Panel de control para atención clínica</p>
          </div>
          {viewMode !== 'main' && (
            <button 
              className={styles['back-btn']}
              onClick={() => {
                setViewMode('main')
                setSelectedPatient(null)
              }}
            >
              ← Volver al Dashboard
            </button>
          )}
        </div>
      </header>

      <main className={styles['dashboard-main']}>
        {viewMode === 'main' && renderMainView()}
        {viewMode === 'hospitalized-patients' && <HospitalizedPatientsView />}
        {viewMode === 'register-encounter' && <RegisterEncounterView />}
        {viewMode === 'search-patient' && <SearchPatientView onViewHistory={(patient) => {
          setSelectedPatient(patient)
          setViewMode('patient-history')
        }} />}
        {viewMode === 'patient-history' && selectedPatient && (
          <PatientHistoryView 
            patient={selectedPatient}
            onBack={() => {
              setViewMode('search-patient')
              setSelectedPatient(null)
            }}
          />
        )}
        {viewMode === 'today-encounters' && <TodayEncountersView />}
        {viewMode === 'my-appointments' && <MyAppointmentsView />}
      </main>
    </div>
  )
}

// ==========================================
// COMPONENTE: Pacientes Hospitalizados
// ==========================================
function HospitalizedPatientsView() {
  const [admisiones, setAdmisiones] = useState<Admision[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [servicioFiltro, setServicioFiltro] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const SERVICIOS = [
    { value: '', label: 'Todos los servicios' },
    { value: 'EMERGENCIA', label: 'Emergencia' },
    { value: 'MEDICINA_INTERNA', label: 'Medicina Interna' },
    { value: 'CIRUGIA_GENERAL', label: 'Cirugía General' },
    { value: 'TRAUMATOLOGIA', label: 'Traumatología' },
    { value: 'UCI', label: 'UCI' },
    { value: 'PEDIATRIA', label: 'Pediatría' },
    { value: 'CARDIOLOGIA', label: 'Cardiología' },
  ]

  useEffect(() => {
    cargarPacientes()
  }, [servicioFiltro])

  const cargarPacientes = async () => {
    setLoading(true)
    try {
      const filters: { servicio?: string } = {}
      if (servicioFiltro) filters.servicio = servicioFiltro
      const response = await admisionesService.listarAdmisionesActivas(filters)
      setAdmisiones(response.admisiones)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar pacientes'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const calcularEdad = (fechaNac?: string) => {
    if (!fechaNac) return 'N/A'
    const hoy = new Date()
    const nac = new Date(fechaNac)
    let edad = hoy.getFullYear() - nac.getFullYear()
    const mes = hoy.getMonth() - nac.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) edad--
    return `${edad} años`
  }

  if (loading) {
    return (
      <div className={styles['loading-container']}>
        <div className={styles.spinner}></div>
        <p>Cargando pacientes hospitalizados...</p>
      </div>
    )
  }

  return (
    <section className={styles['view-section']}>
      <div className={styles['section-header']}>
        <h2>🏥 Pacientes Hospitalizados Actualmente</h2>
        <p className={styles['section-subtitle']}>Gestione la atención de pacientes internados</p>
      </div>

      <div className={styles['filters-bar']}>
        <div className={styles['filter-group']}>
          <label>Servicio:</label>
          <select value={servicioFiltro} onChange={(e) => setServicioFiltro(e.target.value)}>
            {SERVICIOS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <button onClick={cargarPacientes} className={styles['refresh-btn']}>
          🔄 Actualizar
        </button>
      </div>

      {error && <div className={styles['error-alert']}>{error}</div>}

      {admisiones.length === 0 ? (
        <div className={styles['empty-state']}>
          <span className={styles['empty-icon']}>🛏️</span>
          <h3>No hay pacientes hospitalizados</h3>
          <p>No se encontraron admisiones activas con los filtros seleccionados</p>
        </div>
      ) : (
        <div className={styles['patients-grid']}>
          {admisiones.map((admision) => (
            <div 
              key={admision.id} 
              className={`${styles['patient-card']} ${expandedId === admision.id ? styles.expanded : ''}`}
            >
              <div className={styles['card-header']}>
                <div className={styles['patient-info']}>
                  <h3>{admision.paciente?.apellidosNombres || 'N/A'}</h3>
                  <span className={styles['historia-badge']}>
                    HC: {admision.paciente?.nroHistoria || 'N/A'}
                  </span>
                </div>
                <span className={`${styles['tipo-badge']} ${
                  admision.tipo === 'EMERGENCIA' ? styles['tipo-emergencia'] : 
                  admision.tipo === 'UCI' ? styles['tipo-uci'] : 
                  styles['tipo-hospitalizacion']
                }`}>
                  {admision.tipo === 'EMERGENCIA' ? '🚨' : admision.tipo === 'UCI' ? '🏥' : '🛏️'} {admision.tipo}
                </span>
              </div>

              <div className={styles['card-body']}>
                <div className={styles['info-row']}>
                  <span><strong>CI:</strong> {admision.paciente?.ci}</span>
                  <span><strong>Edad:</strong> {calcularEdad(admision.paciente?.fechaNacimiento)}</span>
                </div>
                <div className={styles['info-row']}>
                  <span><strong>Servicio:</strong> {admision.servicio?.replace(/_/g, ' ') || 'N/A'}</span>
                  <span><strong>Cama:</strong> {admision.habitacion || '-'} / {admision.cama || '-'}</span>
                </div>
                <div className={styles['info-row']}>
                  <span><strong>Días hosp.:</strong> <span className={styles['dias-badge']}>{admision.diasHospitalizacion || 0}</span></span>
                </div>
              </div>

              <div className={styles['card-actions']}>
                <button 
                  className={styles['action-btn-primary']}
                  onClick={() => alert('Próximamente: Registrar Evolución')}
                >
                  📝 Evolución
                </button>
                <button 
                  className={styles['action-btn-secondary']}
                  onClick={() => setExpandedId(expandedId === admision.id ? null : admision.id)}
                >
                  {expandedId === admision.id ? '▲ Menos' : '▼ Más'}
                </button>
              </div>

              {expandedId === admision.id && (
                <div className={styles['card-expanded']}>
                  <div className={styles['expanded-info']}>
                    <p><strong>Forma ingreso:</strong> {admision.formaIngreso || 'N/A'}</p>
                    <p><strong>Fecha ingreso:</strong> {new Date(admision.fechaAdmision).toLocaleDateString('es-VE')}</p>
                    {admision.observaciones && (
                      <p><strong>Observaciones:</strong> {admision.observaciones}</p>
                    )}
                  </div>
                  <div className={styles['expanded-actions']}>
                    <button onClick={() => alert('Próximamente: Ver Historia Completa')}>
                      📋 Historia Clínica
                    </button>
                    <button onClick={() => alert('Próximamente: Registrar Alta')}>
                      ✅ Alta Médica
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className={styles['section-footer']}>
        <span>📊 Total: {admisiones.length} pacientes hospitalizados</span>
      </div>
    </section>
  )
}

// ==========================================
// COMPONENTE: Registrar Encuentro
// ==========================================
function RegisterEncounterView() {
  const [step, setStep] = useState(1)
  const [searchCI, setSearchCI] = useState('')
  const [paciente, setPaciente] = useState<PatientBasic | null>(null)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    tipo: 'CONSULTA',
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().slice(0, 5),
    motivoConsulta: '',
    enfermedadActual: '',
    procedencia: '',
    nroCama: '',
    // Signos vitales
    taSistolica: '',
    taDiastolica: '',
    pulso: '',
    temperatura: '',
    fr: '',
    // Diagnóstico
    diagnostico: '',
    codigoCie: '',
    tratamiento: '',
    observaciones: ''
  })

  const buscarPaciente = async () => {
    if (!searchCI.trim()) {
      setError('Ingrese un número de cédula')
      return
    }
    setSearching(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE_URL}/pacientes/search?ci=${searchCI}`)
      const result = await response.json()
      if (result.success && result.data) {
        setPaciente(result.data)
        setStep(2)
      } else {
        setError('Paciente no encontrado')
      }
    } catch {
      setError('Error al buscar paciente')
    } finally {
      setSearching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Por ahora, mostrar mensaje de próximamente
    alert('🚧 Funcionalidad en desarrollo\n\nEl registro de encuentros estará disponible próximamente.')
  }

  return (
    <section className={styles['view-section']}>
      <div className={styles['section-header']}>
        <h2>📝 Registrar Nuevo Encuentro</h2>
        <p className={styles['section-subtitle']}>
          Documente atenciones médicas: consultas, emergencias o evoluciones hospitalarias
        </p>
      </div>

      {/* Step Indicator */}
      <div className={styles['step-indicator']}>
        <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>
          <span className={styles['step-number']}>1</span>
          <span className={styles['step-label']}>Buscar Paciente</span>
        </div>
        <div className={styles['step-line']}></div>
        <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>
          <span className={styles['step-number']}>2</span>
          <span className={styles['step-label']}>Datos del Encuentro</span>
        </div>
        <div className={styles['step-line']}></div>
        <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>
          <span className={styles['step-number']}>3</span>
          <span className={styles['step-label']}>Signos y Diagnóstico</span>
        </div>
      </div>

      {/* Step 1: Buscar Paciente */}
      {step === 1 && (
        <div className={styles['form-card']}>
          <h3>Buscar Paciente por Cédula</h3>
          <div className={styles['search-box']}>
            <input
              type="text"
              placeholder="Ej: V-12345678"
              value={searchCI}
              onChange={(e) => setSearchCI(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && buscarPaciente()}
            />
            <button onClick={buscarPaciente} disabled={searching}>
              {searching ? '🔄 Buscando...' : '🔍 Buscar'}
            </button>
          </div>
          {error && <p className={styles['error-text']}>{error}</p>}
        </div>
      )}

      {/* Step 2: Datos del Encuentro */}
      {step === 2 && paciente && (
        <div className={styles['form-card']}>
          {/* Info del paciente */}
          <div className={styles['patient-summary']}>
            <h3>Paciente Seleccionado</h3>
            <div className={styles['patient-details']}>
              <p><strong>Nombre:</strong> {paciente.apellidosNombres}</p>
              <p><strong>CI:</strong> {paciente.ci}</p>
              <p><strong>Historia:</strong> {paciente.nroHistoria}</p>
            </div>
            <button className={styles['change-patient-btn']} onClick={() => { setStep(1); setPaciente(null) }}>
              Cambiar paciente
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setStep(3) }}>
            <div className={styles['form-grid']}>
              <div className={styles['form-group']}>
                <label>Tipo de Encuentro *</label>
                <select 
                  value={formData.tipo}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                >
                  <option value="CONSULTA">🩺 Consulta</option>
                  <option value="EMERGENCIA">🚨 Emergencia</option>
                  <option value="HOSPITALIZACION">🛏️ Evolución Hospitalización</option>
                  <option value="OTRO">📋 Otro</option>
                </select>
              </div>

              <div className={styles['form-group']}>
                <label>Fecha *</label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                />
              </div>

              <div className={styles['form-group']}>
                <label>Hora *</label>
                <input
                  type="time"
                  value={formData.hora}
                  onChange={(e) => setFormData({...formData, hora: e.target.value})}
                />
              </div>

              <div className={styles['form-group']}>
                <label>Procedencia</label>
                <input
                  type="text"
                  placeholder="Ej: Consulta externa, Referido de..."
                  value={formData.procedencia}
                  onChange={(e) => setFormData({...formData, procedencia: e.target.value})}
                />
              </div>

              <div className={`${styles['form-group']} ${styles['full-width']}`}>
                <label>Motivo de Consulta *</label>
                <textarea
                  rows={3}
                  placeholder="Describa el motivo de la consulta..."
                  value={formData.motivoConsulta}
                  onChange={(e) => setFormData({...formData, motivoConsulta: e.target.value})}
                />
              </div>

              <div className={`${styles['form-group']} ${styles['full-width']}`}>
                <label>Enfermedad Actual</label>
                <textarea
                  rows={4}
                  placeholder="Historia de la enfermedad actual..."
                  value={formData.enfermedadActual}
                  onChange={(e) => setFormData({...formData, enfermedadActual: e.target.value})}
                />
              </div>
            </div>

            <div className={styles['form-actions']}>
              <button type="button" className={styles['btn-secondary']} onClick={() => setStep(1)}>
                ← Atrás
              </button>
              <button type="submit" className={styles['btn-primary']}>
                Continuar →
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 3: Signos Vitales y Diagnóstico */}
      {step === 3 && (
        <div className={styles['form-card']}>
          <h3>Signos Vitales y Diagnóstico</h3>
          
          <form onSubmit={handleSubmit}>
            {/* Signos Vitales */}
            <div className={styles['form-section']}>
              <h4>📊 Signos Vitales</h4>
              <div className={styles['form-grid']}>
                <div className={styles['form-group']}>
                  <label>T.A. Sistólica (mmHg)</label>
                  <input
                    type="number"
                    placeholder="120"
                    value={formData.taSistolica}
                    onChange={(e) => setFormData({...formData, taSistolica: e.target.value})}
                  />
                </div>
                <div className={styles['form-group']}>
                  <label>T.A. Diastólica (mmHg)</label>
                  <input
                    type="number"
                    placeholder="80"
                    value={formData.taDiastolica}
                    onChange={(e) => setFormData({...formData, taDiastolica: e.target.value})}
                  />
                </div>
                <div className={styles['form-group']}>
                  <label>Pulso (lpm)</label>
                  <input
                    type="number"
                    placeholder="72"
                    value={formData.pulso}
                    onChange={(e) => setFormData({...formData, pulso: e.target.value})}
                  />
                </div>
                <div className={styles['form-group']}>
                  <label>Temperatura (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="36.5"
                    value={formData.temperatura}
                    onChange={(e) => setFormData({...formData, temperatura: e.target.value})}
                  />
                </div>
                <div className={styles['form-group']}>
                  <label>Frec. Respiratoria (rpm)</label>
                  <input
                    type="number"
                    placeholder="18"
                    value={formData.fr}
                    onChange={(e) => setFormData({...formData, fr: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Diagnóstico */}
            <div className={styles['form-section']}>
              <h4>🩺 Impresión Diagnóstica</h4>
              <div className={styles['form-grid']}>
                <div className={`${styles['form-group']} ${styles['full-width']}`}>
                  <label>Diagnóstico *</label>
                  <textarea
                    rows={3}
                    placeholder="Describa el diagnóstico..."
                    value={formData.diagnostico}
                    onChange={(e) => setFormData({...formData, diagnostico: e.target.value})}
                  />
                </div>
                <div className={styles['form-group']}>
                  <label>Código CIE-10 (opcional)</label>
                  <input
                    type="text"
                    placeholder="Ej: J06.9"
                    value={formData.codigoCie}
                    onChange={(e) => setFormData({...formData, codigoCie: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Tratamiento */}
            <div className={styles['form-section']}>
              <h4>💊 Plan de Tratamiento</h4>
              <div className={styles['form-grid']}>
                <div className={`${styles['form-group']} ${styles['full-width']}`}>
                  <label>Indicaciones y Tratamiento</label>
                  <textarea
                    rows={4}
                    placeholder="Indique el tratamiento y recomendaciones..."
                    value={formData.tratamiento}
                    onChange={(e) => setFormData({...formData, tratamiento: e.target.value})}
                  />
                </div>
                <div className={`${styles['form-group']} ${styles['full-width']}`}>
                  <label>Observaciones Adicionales</label>
                  <textarea
                    rows={2}
                    placeholder="Notas adicionales..."
                    value={formData.observaciones}
                    onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className={styles['form-actions']}>
              <button type="button" className={styles['btn-secondary']} onClick={() => setStep(2)}>
                ← Atrás
              </button>
              <button type="submit" className={styles['btn-primary']}>
                💾 Guardar Encuentro
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  )
}

// ==========================================
// COMPONENTE: Buscar Paciente
// ==========================================
function SearchPatientView({ onViewHistory }: { onViewHistory: (patient: PatientBasic) => void }) {
  const [searchType, setSearchType] = useState<'ci' | 'historia'>('ci')
  const [searchValue, setSearchValue] = useState('')
  const [searching, setSearching] = useState(false)
  const [paciente, setPaciente] = useState<PatientBasic | null>(null)
  const [error, setError] = useState('')

  const buscarPaciente = async () => {
    if (!searchValue.trim()) {
      setError('Ingrese un valor de búsqueda')
      return
    }
    setSearching(true)
    setError('')
    setPaciente(null)

    try {
      const queryParam = searchType === 'ci' ? `ci=${searchValue}` : `historia=${searchValue}`
      const response = await fetch(`${API_BASE_URL}/pacientes/search?${queryParam}`)
      const result = await response.json()

      if (result.success && result.data) {
        setPaciente(result.data)
      } else {
        setError('Paciente no encontrado')
      }
    } catch {
      setError('Error al buscar paciente')
    } finally {
      setSearching(false)
    }
  }

  const calcularEdad = (fechaNac?: string) => {
    if (!fechaNac) return 'N/A'
    const hoy = new Date()
    const nac = new Date(fechaNac)
    let edad = hoy.getFullYear() - nac.getFullYear()
    const mes = hoy.getMonth() - nac.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) edad--
    return `${edad} años`
  }

  return (
    <section className={styles['view-section']}>
      <div className={styles['section-header']}>
        <h2>🔍 Buscar Paciente</h2>
        <p className={styles['section-subtitle']}>Consulte la historia clínica y antecedentes del paciente</p>
      </div>

      <div className={styles['form-card']}>
        <div className={styles['search-type-selector']}>
          <label className={searchType === 'ci' ? styles.active : ''}>
            <input
              type="radio"
              name="searchType"
              value="ci"
              checked={searchType === 'ci'}
              onChange={() => setSearchType('ci')}
            />
            Buscar por Cédula
          </label>
          <label className={searchType === 'historia' ? styles.active : ''}>
            <input
              type="radio"
              name="searchType"
              value="historia"
              checked={searchType === 'historia'}
              onChange={() => setSearchType('historia')}
            />
            Buscar por Nro. Historia
          </label>
        </div>

        <div className={styles['search-box']}>
          <input
            type="text"
            placeholder={searchType === 'ci' ? 'Ej: V-12345678' : 'Ej: 25-11-01'}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && buscarPaciente()}
          />
          <button onClick={buscarPaciente} disabled={searching}>
            {searching ? '🔄 Buscando...' : '🔍 Buscar'}
          </button>
        </div>

        {error && <p className={styles['error-text']}>{error}</p>}

        {paciente && (
          <div className={styles['patient-result']}>
            <div className={styles['patient-header']}>
              <h3>{paciente.apellidosNombres}</h3>
              <span className={styles['historia-badge']}>HC: {paciente.nroHistoria}</span>
            </div>

            <div className={styles['patient-info-grid']}>
              <div className={styles['info-item']}>
                <strong>Cédula:</strong>
                <span>{paciente.ci}</span>
              </div>
              <div className={styles['info-item']}>
                <strong>Edad:</strong>
                <span>{calcularEdad(paciente.fechaNacimiento)}</span>
              </div>
              <div className={styles['info-item']}>
                <strong>Sexo:</strong>
                <span>{paciente.sexo === 'M' ? '♂ Masculino' : '♀ Femenino'}</span>
              </div>
              <div className={styles['info-item']}>
                <strong>Teléfono:</strong>
                <span>{paciente.telefono || 'N/A'}</span>
              </div>
            </div>

            <div className={styles['patient-stats']}>
              <div className={styles['stat-item']}>
                <span className={styles['stat-number']}>{paciente.admisiones?.length || 0}</span>
                <span className={styles['stat-label']}>Admisiones</span>
              </div>
              <div className={styles['stat-item']}>
                <span className={styles['stat-number']}>{paciente.encuentros?.length || 0}</span>
                <span className={styles['stat-label']}>Encuentros</span>
              </div>
            </div>

            <div className={styles['patient-actions']}>
              <button className={styles['btn-primary']} onClick={() => onViewHistory(paciente)}>
                📋 Ver Historia Completa
              </button>
              <button className={styles['btn-secondary']} onClick={() => alert('Próximamente: Registrar Encuentro')}>
                📝 Nuevo Encuentro
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

// ==========================================
// COMPONENTE: Historia del Paciente
// ==========================================
function PatientHistoryView({ patient, onBack }: { patient: PatientBasic; onBack: () => void }) {
  const [encuentros, setEncuentros] = useState<Encuentro[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEncuentro, setSelectedEncuentro] = useState<Encuentro | null>(null)

  useEffect(() => {
    cargarEncuentros()
  }, [patient.id])

  const cargarEncuentros = async () => {
    try {
      const data = await encuentrosService.obtenerPorPaciente(patient.id)
      setEncuentros(data)
    } catch (err) {
      console.error('Error al cargar encuentros:', err)
    } finally {
      setLoading(false)
    }
  }

  const calcularEdad = (fechaNac?: string) => {
    if (!fechaNac) return 'N/A'
    const hoy = new Date()
    const nac = new Date(fechaNac)
    let edad = hoy.getFullYear() - nac.getFullYear()
    const mes = hoy.getMonth() - nac.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) edad--
    return `${edad} años`
  }

  return (
    <section className={styles['view-section']}>
      <div className={styles['section-header']}>
        <h2>📋 Historia Clínica</h2>
        <button className={styles['back-link']} onClick={onBack}>← Volver a búsqueda</button>
      </div>

      {/* Datos del Paciente */}
      <div className={styles['patient-header-card']}>
        <div className={styles['patient-main-info']}>
          <h3>{patient.apellidosNombres}</h3>
          <div className={styles.badges}>
            <span className={styles['historia-badge']}>HC: {patient.nroHistoria}</span>
            <span className={styles['ci-badge']}>CI: {patient.ci}</span>
          </div>
        </div>
        <div className={styles['patient-details-grid']}>
          <span><strong>Edad:</strong> {calcularEdad(patient.fechaNacimiento)}</span>
          <span><strong>Sexo:</strong> {patient.sexo === 'M' ? '♂ Masculino' : '♀ Femenino'}</span>
          <span><strong>Teléfono:</strong> {patient.telefono || 'N/A'}</span>
          <span><strong>Dirección:</strong> {patient.direccion || 'N/A'}</span>
        </div>
        
        {/* Datos Militares si existen */}
        {patient.personalMilitar && (
          <div className={styles['military-info']}>
            <h4>🎖️ Datos Militares</h4>
            <div className={styles['military-grid']}>
              <span><strong>Grado:</strong> {patient.personalMilitar.grado || 'N/A'}</span>
              <span><strong>Componente:</strong> {patient.personalMilitar.componente || 'N/A'}</span>
              <span><strong>Unidad:</strong> {patient.personalMilitar.unidad || 'N/A'}</span>
              <span><strong>Estado:</strong> {patient.personalMilitar.estadoMilitar || 'N/A'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Lista de Encuentros */}
      <div className={styles['form-card']}>
        <h3>👨‍⚕️ Encuentros Médicos</h3>
        {loading ? (
          <div className={styles['loading-inline']}>Cargando encuentros...</div>
        ) : (
          <EncuentrosList 
            encuentros={encuentros}
            onVerDetalle={(encuentro) => setSelectedEncuentro(encuentro)}
          />
        )}
      </div>

      {/* Admisiones */}
      {patient.admisiones && patient.admisiones.length > 0 && (
        <div className={styles['form-card']}>
          <h3>🏥 Historial de Admisiones</h3>
          <div className={styles['admisiones-list']}>
            {patient.admisiones.map((adm: Admision) => (
              <div key={adm.id} className={styles['admision-item']}>
                <div className={styles['admision-header']}>
                  <span className={`${styles['tipo-badge']} ${styles[`tipo-${adm.tipo?.toLowerCase()}`]}`}>
                    {adm.tipo || 'N/A'}
                  </span>
                  <span className={styles.fecha}>
                    {new Date(adm.fechaAdmision).toLocaleDateString('es-VE')}
                  </span>
                </div>
                <div className={styles['admision-details']}>
                  <span><strong>Servicio:</strong> {adm.servicio?.replace(/_/g, ' ') || 'N/A'}</span>
                  <span><strong>Estado:</strong> {adm.estado}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Detalle de Encuentro */}
      {selectedEncuentro && (
        <EncuentroDetailModal
          encuentro={selectedEncuentro}
          onClose={() => setSelectedEncuentro(null)}
        />
      )}
    </section>
  )
}

// ==========================================
// COMPONENTE: Atenciones del Día
// ==========================================
function TodayEncountersView() {
  const [encuentros, setEncuentros] = useState<Encuentro[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEncuentro, setSelectedEncuentro] = useState<Encuentro | null>(null)

  useEffect(() => {
    cargarEncuentrosHoy()
  }, [])

  const cargarEncuentrosHoy = async () => {
    try {
      const data = await encuentrosService.obtenerHoy()
      setEncuentros(data)
    } catch (err) {
      console.error('Error al cargar encuentros:', err)
    } finally {
      setLoading(false)
    }
  }

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      EMERGENCIA: '🚨 Emergencia',
      HOSPITALIZACION: '🛏️ Hospitalización',
      CONSULTA: '🩺 Consulta',
      OTRO: '📋 Otro',
    }
    return labels[tipo] || tipo
  }

  if (loading) {
    return (
      <div className={styles['loading-container']}>
        <div className={styles.spinner}></div>
        <p>Cargando atenciones de hoy...</p>
      </div>
    )
  }

  return (
    <section className={styles['view-section']}>
      <div className={styles['section-header']}>
        <h2>📅 Atenciones de Hoy</h2>
        <p className={styles['section-subtitle']}>
          {new Date().toLocaleDateString('es-VE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className={styles['form-card']}>
        {encuentros.length === 0 ? (
          <div className={styles['empty-state']}>
            <span className={styles['empty-icon']}>📋</span>
            <h3>No hay atenciones registradas hoy</h3>
            <p>Los encuentros médicos aparecerán aquí cuando se registren</p>
          </div>
        ) : (
          <>
            <div className={styles['stats-summary']}>
              <div className={styles['stat-box']}>
                <span className={styles['stat-number']}>{encuentros.length}</span>
                <span className={styles['stat-label']}>Total atenciones</span>
              </div>
              <div className={styles['stat-box']}>
                <span className={styles['stat-number']}>
                  {encuentros.filter(e => e.tipo === 'EMERGENCIA').length}
                </span>
                <span className={styles['stat-label']}>Emergencias</span>
              </div>
              <div className={styles['stat-box']}>
                <span className={styles['stat-number']}>
                  {encuentros.filter(e => e.tipo === 'CONSULTA').length}
                </span>
                <span className={styles['stat-label']}>Consultas</span>
              </div>
            </div>

            <div className={styles['encounters-table']}>
              <table>
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Paciente</th>
                    <th>Tipo</th>
                    <th>Médico</th>
                    <th>Motivo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {encuentros.map((enc) => (
                    <tr key={enc.id}>
                      <td>{enc.hora?.substring(0, 5) || '--:--'}</td>
                      <td>
                        <strong>{enc.paciente?.apellidosNombres || 'N/A'}</strong>
                        <br />
                        <small>{enc.paciente?.ci}</small>
                      </td>
                      <td>
                        <span className={`${styles['tipo-tag']} ${styles[`tipo-${enc.tipo.toLowerCase()}`]}`}>
                          {getTipoLabel(enc.tipo)}
                        </span>
                      </td>
                      <td>{enc.createdBy?.nombre || 'N/A'}</td>
                      <td>{enc.motivoConsulta?.substring(0, 50) || 'N/A'}...</td>
                      <td>
                        <button 
                          className={styles['btn-small']}
                          onClick={() => setSelectedEncuentro(enc)}
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {selectedEncuentro && (
        <EncuentroDetailModal
          encuentro={selectedEncuentro}
          onClose={() => setSelectedEncuentro(null)}
        />
      )}
    </section>
  )
}

// ==========================================
// COMPONENTE: Mis Citas
// ==========================================
function MyAppointmentsView() {
  const [citas, setCitas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarCitas()
  }, [])

  const cargarCitas = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/citas/lista/proximas`)
      const result = await response.json()
      if (result.success) {
        setCitas(result.data || [])
      }
    } catch (err) {
      console.error('Error al cargar citas:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={styles['loading-container']}>
        <div className={styles.spinner}></div>
        <p>Cargando citas...</p>
      </div>
    )
  }

  return (
    <section className={styles['view-section']}>
      <div className={styles['section-header']}>
        <h2>📅 Mis Citas Programadas</h2>
        <p className={styles['section-subtitle']}>Gestione sus citas y consultas programadas</p>
      </div>

      <div className={styles['form-card']}>
        {citas.length === 0 ? (
          <div className={styles['empty-state']}>
            <span className={styles['empty-icon']}>📅</span>
            <h3>No hay citas programadas</h3>
            <p>Las citas asignadas aparecerán aquí</p>
          </div>
        ) : (
          <div className={styles['appointments-list']}>
            {citas.map((cita) => (
              <div key={cita.id} className={styles['appointment-card']}>
                <div className={styles['appointment-header']}>
                  <span className={styles['appointment-time']}>
                    {new Date(cita.fechaHora).toLocaleString('es-VE', {
                      weekday: 'short',
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <span className={`${styles['status-badge']} ${styles[`status-${cita.estado?.toLowerCase()}`]}`}>
                    {cita.estado}
                  </span>
                </div>
                <div className={styles['appointment-body']}>
                  <p><strong>Paciente:</strong> {cita.paciente?.apellidosNombres || 'N/A'}</p>
                  <p><strong>Especialidad:</strong> {cita.especialidad || 'N/A'}</p>
                  <p><strong>Motivo:</strong> {cita.motivo || 'No especificado'}</p>
                </div>
                <div className={styles['appointment-actions']}>
                  <button className={styles['btn-primary']} onClick={() => alert('Próximamente: Atender Cita')}>
                    ✅ Atender
                  </button>
                  <button className={styles['btn-secondary']} onClick={() => alert('Próximamente: Reprogramar')}>
                    📅 Reprogramar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
