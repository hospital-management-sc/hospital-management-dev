import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import FormInput from '@components/FormInput'
import FormSelect from '@components/FormSelect'
import PasswordToggle from '@components/PasswordToggle'
import { authService } from '@services/auth'
import styles from './Register.module.css'

const registerSchema = z
  .object({
    nombre: z
      .string()
      .min(2, 'Nombre completo debe tener al menos 2 caracteres'),
    ci: z
      .string()
      .regex(
        /^[VEP]\d{7,9}$/,
        'C.I. debe comenzar con V, E o P seguido de 7-9 dígitos (Ej: V12345678)'
      ),
    email: z
      .string()
      .min(1, 'Email es requerido')
      .email('Email inválido'),
    password: z
      .string()
      .min(1, 'Contraseña es requerida')
      .min(6, 'Contraseña debe tener al menos 6 caracteres'),
    role: z
      .string()
      .min(1, 'Tipo de usuario es requerido')
      .refine((val) => val === 'MEDICO' || val === 'ADMIN', {
        message: 'Debe seleccionar un tipo de usuario válido',
      }),
  })

type RegisterFormData = z.infer<typeof registerSchema>

export default function Register() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      console.log('[Register] Form submitted with email:', data.email)
      console.log('[Register] Form data:', { nombre: data.nombre, email: data.email, role: data.role })
      
      const response = await authService.register({
        nombre: data.nombre,
        email: data.email,
        password: data.password,
        ci: data.ci,
        role: data.role,
      })
      
      console.log('[Register] Response received:', response)
      
      if (response.success) {
        console.log('[Register] Registration successful, redirecting to login')
        alert('¡Registro exitoso! Ahora inicia sesión.')
        navigate('/login')
      } else {
        const errorMsg = response.error || 'Respuesta inválida del servidor'
        console.error('[Register] Invalid response:', { response, errorMsg })
        alert('Error: ' + errorMsg)
      }
    } catch (error: any) {
      const errorType = error?.name || 'Unknown'
      const errorMessage = error?.message || 'Error desconocido'
      console.error('[Register] Exception caught:', {
        type: errorType,
        message: errorMessage,
        stack: error?.stack,
        fullError: error,
      })
      alert('Error al registrarse: ' + errorMessage)
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Registrarse</h1>
      <p className={styles.subtitle}>Crea tu cuenta en el sistema</p>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <FormSelect
          id="role"
          label="Tipo de Usuario"
          placeholder="Selecciona un tipo de usuario"
          error={errors.role?.message}
          options={[
            { value: 'MEDICO', label: 'Médico / Coordinador de Área' },
            { value: 'ADMIN', label: 'Personal Administrativo' },
          ]}
          {...register('role')}
        />

        <FormInput
          id="nombre"
          label="Nombre Completo"
          placeholder="Ej: Juan Pérez"
          error={errors.nombre?.message}
          {...register('nombre')}
        />

        <FormInput
          id="ci"
          label="C.I. (Cédula de Identidad)"
          placeholder="Ej: V12345678"
          error={errors.ci?.message}
          {...register('ci')}
        />

        <FormInput
          id="email"
          type="email"
          label="Email"
          placeholder="tu@email.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <div style={{ position: 'relative' }}>
          <FormInput
            id="password"
            type={showPassword ? 'text' : 'password'}
            label="Contraseña"
            placeholder="Mín. 6 caracteres"
            error={errors.password?.message}
            {...register('password')}
          />
          <PasswordToggle isVisible={showPassword} onChange={setShowPassword} />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>

      <p className={styles.loginLink}>
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className={styles.link}>
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}
