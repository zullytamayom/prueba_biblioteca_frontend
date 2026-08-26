import React, { useState } from 'react';
import type { Usuario } from '../services/usuariosService';

interface UsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGuardar: (nuevoUsuario: Usuario) => Promise<void>;
}

export const UsuarioModal: React.FC<UsuarioModalProps> = ({ isOpen, onClose, onGuardar }) => {
  // 1. Estado único para agrupar los campos del formulario de forma limpia
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    fechaNacimiento: ''
  });

  const [enviando, setEnviando] = useState<boolean>(false);
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);

  if (!isOpen) return null; // Si el modal está cerrado, React no renderiza nada

  // Manejador genérico para capturar lo que el usuario escribe
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Validación y envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorValidacion(null);

    // Validaciones básicas de cliente
    if (!formData.nombre.trim() || !formData.apellido.trim() || !formData.email.trim() || !formData.fechaNacimiento) {
      setErrorValidacion('Todos los campos son obligatorios para el registro oficial.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorValidacion('Por favor, introduce un correo electrónico válido.');
      return;
    }

    try {
      setEnviando(true);
      await onGuardar(formData); // Ejecuta la inserción en el componente padre
      setFormData({ nombre: '', apellido: '', email: '', fechaNacimiento: '' }); // Limpia los inputs
      onClose(); // Cierra el modal
    } catch (err: any) {
      setErrorValidacion(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={styles.backdropOverlay}>
      <div style={styles.modalCard}>
        <div style={styles.modalHeader}>
          <div>
            <h3 style={styles.modalTitulo}>Inscripción de Lector</h3>
            <p style={styles.modalSubtitulo}>Asigna las credenciales del nuevo miembro de la biblioteca.</p>
          </div>
          <button onClick={onClose} style={styles.botonCerrarX}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {errorValidacion && <div style={styles.alertaError}>{errorValidacion}</div>}

          <div style={styles.campoFila}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Nombres *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Juan Carlos"
                style={styles.input}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Apellidos *</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Ej. Pérez Gómez"
                style={styles.input}
              />
            </div>
          </div>

          <div>
            <label style={styles.label}>Correo Electrónico *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="juan.perez@biblioteca.com"
              style={styles.input}
            />
          </div>

          <div>
            <label style={styles.label}>Fecha de Nacimiento *</label>
            <input
              type="date"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.accionesFila}>
            <button type="button" onClick={onClose} disabled={enviando} style={styles.botonCancelar}>
              Cancelar
            </button>
            <button type="submit" disabled={enviando} style={styles.botonEnviar}>
              {enviando ? 'Registrando...' : 'Confirmar Registro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  backdropOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(15, 23, 42, 0.6)', // Fondo oscuro traslúcido
    backdropFilter: 'blur(4px)', // Desenfoque cinemático
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '520px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    animation: 'fadeIn 0.2s ease-out'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #f1f5f9',
    backgroundColor: '#f8fafc'
  },
  modalTitulo: { margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' },
  modalSubtitulo: { margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' },
  botonCerrarX: { background: 'none', border: 'none', fontSize: '24px', color: '#94a3b8', cursor: 'pointer', padding: 0 },
  form: { padding: '24px', display: 'flex', flexDirection: 'column' as const, gap: '18px' },
  alertaError: { backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', border: '1px solid #fca5a5' },
  campoFila: { display: 'flex', gap: '16px' },
  label: { fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px', display: 'block' },
  input: { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' as const, outline: 'none', transition: 'border-color 0.2s' },
  accionesFila: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '18px' },
  botonCancelar: { backgroundColor: '#f1f5f9', color: '#475569', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  botonEnviar: { backgroundColor: '#854d0e', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', boxShadow: '0 4px 12px rgba(133, 77, 14, 0.25)' }
};
