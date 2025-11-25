/**
 * Componente para Registrar Nueva Admisión
 * Permite crear admisiones de tipo EMERGENCIA o HOSPITALIZACIÓN para pacientes existentes
 */

import { useState, useEffect } from 'react';
import styles from './RegistrarAdmision.module.css';
import type { CrearAdmisionDTO } from '../services/admisiones.service';
import admisionesService from '../services/admisiones.service';
import pacientesService from '../services/pacientes.service';

interface RegistrarAdmisionProps {
  onBack: () => void;
}

const SERVICIOS_DISPONIBLES = [
  'EMERGENCIA',
  'MEDICINA_INTERNA',
  'CIRUGIA_GENERAL',
  'TRAUMATOLOGIA',
  'UCI',
  'PEDIATRIA',
  'GINECO_OBSTETRICIA',
  'CARDIOLOGIA',
  'NEUROLOGIA',
];

export default function RegistrarAdmision({ onBack }: RegistrarAdmisionProps) {
  const [tipoAdmision, setTipoAdmision] = useState<'EMERGENCIA' | 'HOSPITALIZACION' | null>(null);
  
  // Búsqueda de paciente
  const [busquedaCITipo, setBusquedaCITipo] = useState('V');
  const [busquedaCINumeros, setBusquedaCINumeros] = useState('');
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<any>(null);
  const [buscando, setBuscando] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState('');

  // Formulario de admisión
  const [formData, setFormData] = useState<Partial<CrearAdmisionDTO>>({
    tipo: undefined,
    servicio: '',
    fechaAdmision: new Date().toISOString().split('T')[0],
    horaAdmision: new Date().toTimeString().slice(0, 5),
    formaIngreso: 'AMBULANTE',
    habitacion: '',
    cama: '',
    observaciones: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Actualizar tipo en formData cuando cambia tipoAdmision
  useEffect(() => {
    if (tipoAdmision) {
      setFormData((prev) => ({
        ...prev,
        tipo: tipoAdmision,
        servicio: tipoAdmision === 'EMERGENCIA' ? 'EMERGENCIA' : '',
      }));
    }
  }, [tipoAdmision]);

  const buscarPaciente = async () => {
    if (!busquedaCINumeros.trim()) {
      setErrorBusqueda('Ingrese un número de CI');
      return;
    }

    setBuscando(true);
    setErrorBusqueda('');
    setPacienteSeleccionado(null);

    try {
      const ciCompleta = `${busquedaCITipo}-${busquedaCINumeros}`;
      const result = await pacientesService.buscarPorCI(ciCompleta);
      
      if (result) {
        setPacienteSeleccionado(result);
        setFormData((prev) => ({
          ...prev,
          pacienteId: result.id.toString(),
        }));
      } else {
        setErrorBusqueda('No se encontró paciente con ese CI');
      }
    } catch (err) {
      setErrorBusqueda('Error al buscar paciente');
      console.error(err);
    } finally {
      setBuscando(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!pacienteSeleccionado) {
      setError('Debe buscar y seleccionar un paciente primero');
      return;
    }

    if (!formData.tipo || !formData.fechaAdmision) {
      setError('Complete los campos requeridos');
      return;
    }

    setSubmitting(true);

    try {
      const dataToSend: CrearAdmisionDTO = {
        pacienteId: pacienteSeleccionado.id,
        tipo: formData.tipo!,
        servicio: formData.servicio || undefined,
        fechaAdmision: formData.fechaAdmision!,
        horaAdmision: formData.horaAdmision || undefined,
        formaIngreso: formData.formaIngreso as any,
        habitacion: formData.habitacion || undefined,
        cama: formData.cama || undefined,
        observaciones: formData.observaciones || undefined,
      };

      const response = await admisionesService.crearAdmision(dataToSend);
      
      setSuccess(`Admisión creada exitosamente. ID: ${response.admision.id}`);
      
      // Limpiar formulario después de 2 segundos
      setTimeout(() => {
        setPacienteSeleccionado(null);
        setBusquedaCITipo('V');
        setBusquedaCINumeros('');
        setFormData({
          tipo: tipoAdmision!,
          servicio: tipoAdmision === 'EMERGENCIA' ? 'EMERGENCIA' : '',
          fechaAdmision: new Date().toISOString().split('T')[0],
          horaAdmision: new Date().toTimeString().slice(0, 5),
          formaIngreso: 'AMBULANTE',
          habitacion: '',
          cama: '',
          observaciones: '',
        });
        setSuccess('');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Error al crear admisión');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCINumerosChange = (value: string) => {
    const soloNumeros = value.replace(/\D/g, '').slice(0, 8);
    setBusquedaCINumeros(soloNumeros);
    setErrorBusqueda('');
  };

  const calcularEdad = (fechaNac: string | undefined) => {
    if (!fechaNac) return 'N/A';
    const hoy = new Date();
    const nacimiento = new Date(fechaNac);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Registrar Nueva Admisión</h1>
      </div>

      {/* Selección de Tipo de Admisión */}
      {!tipoAdmision && (
        <div className={styles.tipoSeleccion}>
          <h2>Seleccione el tipo de admisión:</h2>
          <div className={styles.tipoGrid}>
            <button
              className={`${styles.tipoBtn} ${styles.emergencia}`}
              onClick={() => setTipoAdmision('EMERGENCIA')}
            >
              <span className={styles.tipoIcon}>🚨</span>
              <h3>EMERGENCIA</h3>
              <p>Paciente llega sin cita previa. Atención médica inmediata.</p>
            </button>
            <button
              className={`${styles.tipoBtn} ${styles.hospitalizacion}`}
              onClick={() => setTipoAdmision('HOSPITALIZACION')}
            >
              <span className={styles.tipoIcon}>🏥</span>
              <h3>HOSPITALIZACIÓN</h3>
              <p>Paciente con orden de internación. Requiere cama asignada.</p>
            </button>
          </div>
        </div>
      )}

      {/* Formulario de Admisión */}
      {tipoAdmision && (
        <div className={styles.formContainer}>
          <div className={styles.tipoHeader}>
            <span className={styles.tipoLabel}>
              {tipoAdmision === 'EMERGENCIA' ? '🚨 EMERGENCIA' : '🏥 HOSPITALIZACIÓN'}
            </span>
            <button onClick={() => setTipoAdmision(null)} className={styles.cambiarTipoBtn}>
              Cambiar tipo
            </button>
          </div>

          {/* Paso 1: Buscar Paciente */}
          <div className={styles.section}>
            <h3>1. Buscar Paciente</h3>
            <div className={styles.busquedaContainer}>
              <div className={styles.busquedaInput}>
                <select
                  value={busquedaCITipo}
                  onChange={(e) => setBusquedaCITipo(e.target.value)}
                  disabled={buscando}
                >
                  <option value="V">V</option>
                  <option value="E">E</option>
                  <option value="P">P</option>
                </select>
                <input
                  type="text"
                  placeholder="12345678"
                  value={busquedaCINumeros}
                  onChange={(e) => handleCINumerosChange(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && buscarPaciente()}
                  disabled={buscando}
                  maxLength={8}
                />
                <button onClick={buscarPaciente} disabled={buscando}>
                  {buscando ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
              {errorBusqueda && <div className={styles.errorMsg}>{errorBusqueda}</div>}
            </div>

            {pacienteSeleccionado && (
              <div className={styles.pacienteInfo}>
                <h4>✓ Paciente Encontrado:</h4>
                <div className={styles.pacienteGrid}>
                  <div>
                    <strong>Nombre:</strong> {pacienteSeleccionado.apellidosNombres}
                  </div>
                  <div>
                    <strong>CI:</strong> {pacienteSeleccionado.ci}
                  </div>
                  <div>
                    <strong>Historia:</strong> {pacienteSeleccionado.nroHistoria}
                  </div>
                  <div>
                    <strong>Edad:</strong> {calcularEdad(pacienteSeleccionado.fechaNacimiento)} años
                  </div>
                  <div>
                    <strong>Sexo:</strong> {pacienteSeleccionado.sexo === 'M' ? 'Masculino' : 'Femenino'}
                  </div>
                  <div>
                    <strong>Admisiones previas:</strong> {pacienteSeleccionado.admisiones?.length || 0}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Paso 2: Datos de Admisión */}
          {pacienteSeleccionado && (
            <form onSubmit={handleSubmit}>
              <div className={styles.section}>
                <h3>2. Datos de la Admisión</h3>
                
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Fecha de Admisión *</label>
                    <input
                      type="date"
                      name="fechaAdmision"
                      value={formData.fechaAdmision}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Hora de Admisión</label>
                    <input
                      type="time"
                      name="horaAdmision"
                      value={formData.horaAdmision}
                      onChange={handleInputChange}
                    />
                  </div>

                  {tipoAdmision === 'HOSPITALIZACION' && (
                    <>
                      <div className={styles.formGroup}>
                        <label>Servicio *</label>
                        <select
                          name="servicio"
                          value={formData.servicio}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Seleccione...</option>
                          {SERVICIOS_DISPONIBLES.filter(s => s !== 'EMERGENCIA').map((servicio) => (
                            <option key={servicio} value={servicio}>
                              {servicio.replace(/_/g, ' ')}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label>Habitación</label>
                        <input
                          type="text"
                          name="habitacion"
                          value={formData.habitacion}
                          onChange={handleInputChange}
                          placeholder="Ej: 201"
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>Cama</label>
                        <input
                          type="text"
                          name="cama"
                          value={formData.cama}
                          onChange={handleInputChange}
                          placeholder="Ej: Cama A"
                        />
                      </div>
                    </>
                  )}

                  <div className={styles.formGroup}>
                    <label>Forma de Ingreso</label>
                    <select
                      name="formaIngreso"
                      value={formData.formaIngreso}
                      onChange={handleInputChange}
                    >
                      <option value="AMBULANTE">Ambulante</option>
                      <option value="AMBULANCIA">Ambulancia</option>
                      <option value="TRANSFERENCIA">Transferencia</option>
                    </select>
                  </div>

                  <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                    <label>Observaciones</label>
                    <textarea
                      name="observaciones"
                      value={formData.observaciones}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Información adicional..."
                    />
                  </div>
                </div>
              </div>

              {error && <div className={styles.errorAlert}>{error}</div>}
              {success && <div className={styles.successAlert}>{success}</div>}

              <div className={styles.formActions}>
                <button type="button" onClick={onBack} className={styles.cancelBtn}>
                  Cancelar
                </button>
                <button type="submit" className={styles.submitBtn} disabled={submitting}>
                  {submitting ? 'Creando...' : 'Crear Admisión'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
