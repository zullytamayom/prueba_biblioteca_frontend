import React, { useState } from 'react';
import { librosService, type Libro, type Ejemplar } from '../services/librosService';

interface FilaLibroProps {
  libro: Libro; 
  onEditar: (libro: Libro) => void;
  onEliminar: (id: number) => void;
}

export const FilaLibro: React.FC<FilaLibroProps> = ({ libro, onEditar, onEliminar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ejemplares, setEjemplares] = useState<Ejemplar[]>([]);
  const [loading, setLoading] = useState(false);

  const idLibroActual = libro.idLibro || 0;

  const handleToggle = async () => {
    if (!isOpen) {
      setLoading(true);
      try {
        const data = await librosService.getEjemplaresDisponibles(libro.isbn);
        setEjemplares(data);
      } catch (error) {
        console.error("Error al traer ejemplares:", error);
      } finally {
        setLoading(false);
      }
    }
    setIsOpen(!isOpen);
  };

  const handleAddEjemplar = async () => {
    const codigoInput = prompt(`Ingresa el código del ejemplar para "${libro.titulo}":\nEjemplo: EJ-${libro.isbn}-005`);
    if (!codigoInput) return;

    try {
      const nuevoEjemplar = await librosService.crearEjemplar(idLibroActual, codigoInput);
      setEjemplares(prev => [...prev, nuevoEjemplar]);
    } catch {
      alert("Ocurrió un error al guardar el ejemplar en el backend.");
    }
  };

 return (
  <>
    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', transition: 'background-color 0.2s' }}>
      {/* Columna 1: El botón de expansión */}
      <td style={{ padding: '16px 20px', textAlign: 'center' }}>
        <button 
          type="button"
          onClick={handleToggle} 
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            color: '#cbd5e1'
          }}
        >
          {isOpen ? '▼' : '▶'}
        </button>
      </td>
      {/* Resto de Columnas alineadas con las cabeceras */}
      <td style={{ padding: '16px 20px', fontWeight: '500', color: '#ffffff' }}>{libro.titulo}</td>
      <td style={{ padding: '16px 20px', color: '#cbd5e1' }}>{libro.autor}</td>
      <td style={{ padding: '16px 20px', fontFamily: 'monospace', fontWeight: '600', color: '#94a3b8' }}>{libro.isbn}</td>
      <td style={{ padding: '16px 20px', color: '#cbd5e1' }}>{libro.edicion || 'N/A'}</td>
      <td style={{ padding: '16px 20px', color: '#cbd5e1' }}>{libro.fechaPublicacion || 'N/A'}</td>
      <td style={{ padding: '16px 20px' }}>
        <button onClick={() => onEditar(libro)} style={{ marginRight: '10px', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>Editar</button>
        <button onClick={() => onEliminar(idLibroActual)} style={{ color: '#ef4444', cursor: 'pointer', background: 'none', border: 'none' }}>Eliminar</button>
      </td>
    </tr>

    {/* SECCIÓN EXPANDIBLE (ACORDEÓN DE EJEMPLARES ESTILO CRISTAL) */}
    {isOpen && (
      <tr>
        <td colSpan={7} style={{ 
          backgroundColor: 'rgba(15, 23, 42, 0.35)',
          padding: '24px', 
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h5 style={{ margin: 0, color: '#ffffff', fontSize: '1rem', fontWeight: '600', letterSpacing: '-0.01em' }}>
              📦 Ejemplares Físicos Registrados
            </h5>
            <button 
              type="button" 
              onClick={handleAddEjemplar}
              style={{ 
                backgroundColor: '#854d0e', // Tono ocre/dorado a juego con el botón principal
                color: '#fff', 
                border: 'none', 
                padding: '8px 16px', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                fontWeight: '600',
                fontSize: '0.85rem',
                boxShadow: '0 4px 12px rgba(133, 77, 14, 0.2)',
                transition: 'all 0.2s'
              }}
            >
              + Añadir Ejemplar
            </button>
          </div>

          {loading ? (
            <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Consultando stock en tiempo real...</p>
          ) : ejemplares.length === 0 ? (
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', fontStyle: 'italic', margin: 0, padding: '10px 0' }}>
              No hay copias físicas registradas para este libro. Registra una copia para habilitar préstamos.
            </p>
          ) : (
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse', 
              backgroundColor: 'rgba(255, 255, 255, 0.03)', 
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px', 
              overflow: 'hidden' 
            }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', textAlign: 'left', color: '#cbd5e1', fontSize: '0.85rem' }}>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>ID Ejemplar</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Código de Inventario</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Estado Actual</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>
                {ejemplares.map((ej) => (
                  <tr key={ej.idEjemplares} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '12px 16px', color: '#94a3b8' }}>{ej.idEjemplares}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: '600', color: '#ffffff' }}>{ej.codigoInventario}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '20px', 
                        fontSize: '0.75rem', 
                        fontWeight: '700',
                        color: '#fff',
                        backgroundColor: ej.estado === 'DISPONIBLE' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        border: ej.estado === 'DISPONIBLE' ? '1px solid #22c55e' : '1px solid #ef4444',
                        display: 'inline-block'
                      }}>
                        {ej.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </td>
      </tr>
    )}
  </>
);

};
