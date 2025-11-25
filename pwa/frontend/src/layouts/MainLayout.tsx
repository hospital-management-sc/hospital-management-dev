import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import styles from './MainLayout.module.css'

export default function MainLayout() {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.container}>
          <h1 className={styles.logo}>Hospital JMV</h1>
          <nav className={styles.nav}>
            {isAuthenticated && (
              <>
                <span className={styles.userInfo}>{user?.nombre}</span>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                  Cerrar Sesión
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2025 Hospital JMV. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
