import { AuthProvider } from '@/contexts/AuthContext'
import Router from './router'
import '@styles/globals.css'
import '@styles/dashboard.css'

export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  )
}

