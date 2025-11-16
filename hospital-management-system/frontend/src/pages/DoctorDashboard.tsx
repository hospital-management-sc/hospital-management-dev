/**
 * Dashboard para Médicos y Coordinadores de Área
 * Vista especializada para profesionales médicos
 */

import styles from './DoctorDashboard.module.css'

export default function DoctorDashboard() {
  return (
    <div className={styles['dashboard-container']}>
      <header className={styles['dashboard-header']}>
        <h1>Dashboard Médico</h1>
        <p className={styles.subtitle}>Panel de control para médicos y coordinadores</p>
      </header>

      <main className={styles['dashboard-main']}>
        {/* Sección de Información Rápida */}
        <section className={styles['quick-info']}>
          <div className={styles.card}>
            <h2>Pacientes Activos</h2>
            <div className={styles['stat-value']}>0</div>
          </div>
          <div className={styles.card}>
            <h2>Admisiones Hoy</h2>
            <div className={styles['stat-value']}>0</div>
          </div>
          <div className={styles.card}>
            <h2>Altas Pendientes</h2>
            <div className={styles['stat-value']}>0</div>
          </div>
          <div className={styles.card}>
            <h2>Consultas Pendientes</h2>
            <div className={styles['stat-value']}>0</div>
          </div>
        </section>

        {/* Sección de Acciones Principales */}
        <section className={styles['main-actions']}>
          <h2>Acciones Disponibles</h2>
          <div className={styles['action-grid']}>
            <button className={styles['action-btn']}>
              <span className={styles.icon}>📋</span>
              <span>Ver Pacientes</span>
            </button>
            <button className={styles['action-btn']}>
              <span className={styles.icon}>➕</span>
              <span>Nueva Admisión</span>
            </button>
            <button className={styles['action-btn']}>
              <span className={styles.icon}>📝</span>
              <span>Registrar Encuentro</span>
            </button>
            <button className={styles['action-btn']}>
              <span className={styles.icon}>📊</span>
              <span>Ver Reportes</span>
            </button>
          </div>
        </section>

        {/* Sección de Pacientes Recientes */}
        <section className={styles['recent-patients']}>
          <h2>Pacientes Asignados Recientemente</h2>
          <div className={styles['table-placeholder']}>
            <p>Tabla de pacientes asignados se mostrará aquí</p>
          </div>
        </section>
      </main>
    </div>
  )
}
