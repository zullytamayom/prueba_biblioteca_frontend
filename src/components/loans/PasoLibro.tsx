import React from 'react';
import type { Ejemplar, Libro } from '../../services/librosService';

interface PasoLibroProps {
  idUsuarioSelected: number;
  isEligible: boolean;
  busquedaLibro: string;
  setBusquedaLibro: (v: string) => void;
  librosFiltrados: Libro[];
  isbnLibroSelected: string;
  handleLibroChange: (isbn: string) => void;
  loadingEjemplares: boolean;
  ejemplaresDisponibles: Ejemplar[];
  setEjemplarSelected: (ej: Ejemplar | null) => void;
  ejemplarSelected: Ejemplar | null;
}

export const PasoLibro: React.FC<PasoLibroProps> = ({
  idUsuarioSelected, isEligible, busquedaLibro, setBusquedaLibro,
  librosFiltrados, isbnLibroSelected, handleLibroChange,
  loadingEjemplares, ejemplaresDisponibles, setEjemplarSelected, ejemplarSelected
}) => {
  const isDisabled = idUsuarioSelected === 0 || !isEligible;

  return (
    <div style={{ ...styles.cardPaso, opacity: isDisabled ? 0.4 : 1, transition: 'opacity 0.3s' }}>
      <div style={styles.pasoHeader}>
        <span style={styles.pasoNumero}>2</span>
        <h3 style={styles.pasoTitulo}>Seleccionar Libro / Ejemplar</h3>
      </div>

      <div style={{ marginTop: '20px' }}>
        <label style={styles.label}>Buscar por ISBN o Título:</label>
        <input 
          type="text" 
          placeholder={isDisabled ? "Bloqueado hasta validar Paso 1" : "Escribe el título..."}
          value={busquedaLibro}
          onChange={(e) => setBusquedaLibro(e.target.value)}
          disabled={isDisabled}
          style={styles.input}
        />
      </div>

      {busquedaLibro && !isbnLibroSelected && (
        <div style={styles.subContenedorBusqueda}>
          {librosFiltrados.length === 0 ? (
            <div style={{ padding: '10px', fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>No hay coincidencias.</div>
          ) : (
            librosFiltrados.slice(0, 4).map((l) => (
              <div 
                key={l.isbn} 
                onClick={() => { handleLibroChange(l.isbn); setBusquedaLibro(l.titulo); }}
                style={styles.itemLibroBusqueda}
              >
                <strong style={{ color: '#fff' }}>{l.titulo}</strong> <br/>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ISBN: {l.isbn}</span>
              </div>
            ))
          )}
        </div>
      )}

      {isbnLibroSelected && (
        <div style={{ marginTop: '20px' }}>
          {loadingEjemplares ? (
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Consultando existencias físicas...</p>
          ) : ejemplaresDisponibles.length === 0 ? (
            <div style={styles.stockRojo}>
              🔴 <strong>SIN STOCK DISPONIBLE</strong> (0 copias libres en la base de datos)
            </div>
          ) : (
            <>
              <div style={styles.stockVerde}>
                🟢 <strong>STOCK DISPONIBLE</strong> ({ejemplaresDisponibles.length} copias listas)
              </div>
              
              <label style={{ ...styles.label, marginTop: '15px' }}>Selecciona la Copia Física:</label>
              <select 
                onChange={(e) => {
                  const ej = ejemplaresDisponibles.find((x) => x.idEjemplares === Number(e.target.value));
                  setEjemplarSelected(ej || null);
                }}
                style={styles.select}
              >
                <option value="">-- Elige un código de barras --</option>
                {ejemplaresDisponibles.map((ej) => (
                  <option key={ej.idEjemplares} value={ej.idEjemplares}>
                    {ej.codigoInventario} (ID: {ej.idEjemplares})
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      )}

      {ejemplarSelected && (
        <div style={styles.detalleEjemplarBox}>
          <strong style={{ fontSize: '0.9rem', display: 'block', marginBottom: '4px' }}>Ejemplar Seleccionado:</strong>
          <p style={{ margin: '2px 0', fontSize: '0.85rem' }}>Código: <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{ejemplarSelected.codigoInventario}</span></p>
          <p style={{ margin: '2px 0', fontSize: '0.85rem' }}>Estado: {ejemplarSelected.estado}</p>
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
  select: { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.12)', background: 'rgba(15, 23, 42, 0.5)', color: '#ffffff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' as const },
  input: { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.12)', background: 'rgba(15, 23, 42, 0.5)', color: '#ffffff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' as const },
  subContenedorBusqueda: { border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', marginTop: '6px', overflow: 'hidden', background: 'rgba(15, 23, 42, 0.85)' },
  itemLibroBusqueda: { padding: '10px 14px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', cursor: 'pointer' },
  stockRojo: { backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#fca5a5', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '12px' },
  stockVerde: { backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.25)', color: '#86efac', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '12px' },
  detalleEjemplarBox: { marginTop: '14px', backgroundColor: 'rgba(14, 165, 233, 0.12)', border: '1px solid rgba(14, 165, 233, 0.25)', padding: '12px', borderRadius: '10px', color: '#7dd3fc' }
};
