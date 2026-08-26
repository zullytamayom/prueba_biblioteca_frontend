import React from 'react';
import type { Prestamo } from '../../services/prestamosServices';

interface Usuario {
  idUsuario: number;
  nombre: string;
  apellido: string;
}

interface PasoUsuarioProps {
  usuarios: Usuario[];
  idUsuarioSelected: number;
  onUsuarioChange: (id: number) => void;
  isEligible: boolean;
  prestamosActivos: Prestamo[];
}

export const PasoUsuario: React.FC<PasoUsuarioProps> = ({
  usuarios,
  idUsuarioSelected,
  onUsuarioChange,
  isEligible,
  prestamosActivos
}) => {
  return (
    <div style={styles.cardPaso}>
      <div style={styles.pasoHeader}>
        <span style={styles.pasoNumero}>1</span>
        <h3 style={styles.pasoTitulo}>Seleccionar Usuario</h3>
      </div>

      <div style={{ marginTop: '20px' }}>
        <label style={styles.label}>Usuario Solicitante:</label>
        <select 
          value={idUsuarioSelected} 
          onChange={(e) => onUsuarioChange(Number(e.target.value))}
          style={styles.select}
        >
          <option value={0}>-- Elige un usuario activo --</option>
          {usuarios.map((u) => (
            <option key={u.idUsuario} value={u.idUsuario}>
              {u.nombre} {u.apellido} (ID: {u.idUsuario})
            </option>
          ))}
        </select>
      </div>

      {!isEligible && idUsuarioSelected !== 0 && (
        <div style={styles.alertaRoja}>
          <strong>⚠️ Usuario NO elegible para préstamo.</strong> Supera el límite de préstamos activos (Límite: 3). Actualmente registra {prestamosActivos.length} préstamos sin devolver.
        </div>
      )}

      {idUsuarioSelected !== 0 && (
        <div style={styles.listaActivosContainer}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#f8fafc' }}>
            Préstamos Activos ({prestamosActivos.length}/3):
          </h4>
          {prestamosActivos.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>Ninguno en este momento.</p>
          ) : (
            <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>
              {prestamosActivos.map((p, idx) => (
                <li key={idx} style={{ fontFamily: 'monospace', marginBottom: '4px' }}>
                  {p.codigoInventario || `Ejemplar ID: ${p.idEjemplar}`}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  cardPaso: { background: 'rgba(30, 41, 59, 0.45)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)', flex: 1, minWidth: '300px' },
  pasoHeader: { display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' },
  pasoNumero: { display: 'flex', alignItems: 'center', justifycenter: 'center', width: '30px', height: '30px', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '50%', fontWeight: '700', fontSize: '0.9rem', color: '#ffffff', justifyContent: 'center' },
  pasoTitulo: { margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#ffffff' },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px', textTransform: 'uppercase' as const, letterSpacing: '0.03em' },
  select: { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.12)', background: 'rgba(15, 23, 42, 0.5)', color: '#ffffff', fontSize: '0.9rem', boxSizing: 'border-box' as const },
  alertaRoja: { backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '14px', borderRadius: '10px', fontSize: '0.85rem', marginTop: '16px' },
  listaActivosContainer: { marginTop: '16px', backgroundColor: 'rgba(15, 23, 42, 0.3)', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }
};
