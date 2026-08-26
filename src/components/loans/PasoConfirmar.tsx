import React from 'react';
import type { Ejemplar } from '../../services/librosService';

interface PasoConfirmarProps {
  usuarioActual: { nombre: string; apellido: string } | undefined;
  ejemplarSelected: Ejemplar | null;
  diasPrestamo: number;
  setDiasPrestamo: (d: number) => void;
  handleConfirmarPrestamo: () => void;
  isEligible: boolean;
  idUsuarioSelected: number;
}

export const PasoConfirmar: React.FC<PasoConfirmarProps> = ({
  usuarioActual,
  ejemplarSelected,
  diasPrestamo,
  setDiasPrestamo,
  handleConfirmarPrestamo,
  isEligible,
  idUsuarioSelected
}) => {
  const isButtonDisabled = !isEligible || !ejemplarSelected || idUsuarioSelected === 0;

  return (
    <div style={{ ...styles.cardPaso, opacity: !ejemplarSelected ? 0.4 : 1, transition: 'opacity 0.3s' }}>
      <div style={styles.pasoHeader}>
        <span style={styles.pasoNumero}>3</span>
        <h3 style={styles.pasoTitulo}>Confirmar Préstamo</h3>
      </div>

      <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.8' }}>
        <p style={{ margin: '0 0 6px 0' }}>
          <strong style={{ color: '#fff' }}>Usuario:</strong> {usuarioActual ? `${usuarioActual.nombre} ${usuarioActual.apellido}` : '[Ninguno seleccionado]'}
        </p>
        <p style={{ margin: '0 0 12px 0' }}>
          <strong style={{ color: '#fff' }}>Ejemplar:</strong> {ejemplarSelected ? ejemplarSelected.codigoInventario : '[Ninguno seleccionado]'}
        </p>
        
        <label style={styles.label}>Días de Préstamo Concedidos:</label>
        <input 
          type="number" 
          min="1"
          value={diasPrestamo}
          onChange={(e) => setDiasPrestamo(Number(e.target.value))}
          disabled={!ejemplarSelected}
          style={styles.input}
        />
      </div>

      <button 
        type="button" 
        onClick={handleConfirmarPrestamo}
        disabled={isButtonDisabled}
        style={{
          ...styles.btnFinal,
          backgroundColor: isButtonDisabled ? 'rgba(255,255,255,0.05)' : '#854d0e',
          color: isButtonDisabled ? '#64748b' : '#ffffff',
          border: isButtonDisabled ? '1px solid rgba(255,255,255,0.05)' : 'none',
          cursor: isButtonDisabled ? 'not-allowed' : 'pointer'
        }}
      >
        Confirmar Préstamo
      </button>

      {!isEligible && (
        <div style={styles.bloqueBloqueadoFinal}>
          🔒 <strong>PRÉSTAMO BLOQUEADO:</strong> El solicitante superó el límite de deudas vigentes. Debe realizar una devolución.
        </div>
      )}
    </div>
  );
};

const styles = {
  cardPaso: { background: 'rgba(30, 41, 59, 0.45)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)', flex: 1, minWidth: '300px' },
  pasoHeader: { display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' },
  pasoNumero: { display: 'flex', alignItems: 'center', width: '30px', height: '30px', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '50%', fontWeight: '700', fontSize: '0.9rem', color: '#ffffff', justifyContent: 'center' },
  pasoTitulo: { margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#ffffff' },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px', textTransform: 'uppercase' as const, letterSpacing: '0.03em' },
  input: { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.12)', background: 'rgba(15, 23, 42, 0.5)', color: '#ffffff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' as const },
  btnFinal: { width: '100%', padding: '12px', border: 'none', borderRadius: '10px', fontWeight: '600', marginTop: '16px', fontSize: '0.95rem', boxShadow: '0 4px 12px rgba(133, 77, 14, 0.15)' },
  bloqueBloqueadoFinal: { backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#fca5a5', padding: '12px', borderRadius: '10px', fontSize: '0.85rem', marginTop: '16px', textAlign: 'center' as const, lineHeight: '1.4' }
};
