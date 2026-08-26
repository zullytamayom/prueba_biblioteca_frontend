import React, { useState, useEffect } from 'react';
import { librosService } from '../services/librosService';
import { prestamosService } from '../services/prestamosServices';
import type { Libro } from '../services/librosService';
import { LibroModal } from '../components/LibroModal';
import { FilaLibro } from '../components/FilaLibro'; // Importamos tu nuevo componente de fila expandible
import SearchFilter from '../components/SearchFilter';
import PaginationControls from '../components/PaginationControls';

export const LibrosPage: React.FC = () => {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [hoveredBtnNuevo, setHoveredBtnNuevo] = useState<boolean>(false);
  const [libroSeleccionado, setLibroSeleccionado] = useState<Libro | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  const [totalEjemplares, setTotalEjemplares] = useState<number>(0);
  const [prestamosActivos, setPrestamosActivos] = useState<number | null>(null);

  // Search & pagination
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    prestamosService.contarActivos().then(setPrestamosActivos).catch(console.error);
  }, []);

  useEffect(() => {
    const cargarLibros = async () => {
      try {
        setCargando(true);
        const data = await librosService.listar();
        setLibros(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('No se pudo conectar con el servidor.');
        }
      } finally {
        setCargando(false);
      }
    };

    cargarLibros();
  }, []);
  useEffect(() => {
    const calcularTotalEjemplares = async () => {
      if (libros.length === 0) {
        setTotalEjemplares(0);
        return;
      }

      try {
        const promesas = libros.map(async (libro) => {
          if (!libro.idLibro) return 0;
          try {
            const ejemplaresLibro = await librosService.getEjemplaresDisponibles(libro.isbn);
            if (!Array.isArray(ejemplaresLibro)) return 0;
            return ejemplaresLibro.filter((ej) => (ej.estado ?? '').toString().toUpperCase() === 'DISPONIBLE').length;
          } catch (error) {
            console.warn(`Error obteniendo ejemplares para libro id ${libro.idLibro}:`, error);
            return 0;
          }
        });

        const resultados = await Promise.all(promesas);
        const sumaTotal = resultados.reduce((acc, cur) => acc + cur, 0);
        setTotalEjemplares(sumaTotal);
      } catch (err) {
        console.error('Error crítico calculando el KPI de ejemplares:', err);
      }
    };

    calcularTotalEjemplares();
  }, [libros]);



  if (cargando) return <div style={styles.centro}>Cargando panel de libros...</div>;
  if (error) return <div style={{...styles.centro, color: '#ef4444'}}>{error}</div>;

  return (
    <div style={styles.contenedorConFondo}>
      <div style={styles.overlayOscuro}>
        <div style={styles.contenidoInterno}>
          
          <div style={styles.kpiGrid}>
            <div style={styles.kpiCardCristal}>
              <div>
                <p style={styles.kpiTitulo}>Títulos Catalogados</p>
                <h3 style={styles.kpiNumero}>{libros.length}</h3>
              </div>
              <span style={styles.kpiIcono}>📚</span>
            </div>
            
            {/* AJUSTE: Tarjeta KPI ahora muestra el estado dinámico */}
            <div style={styles.kpiCardCristal}>
              <div>
                <p style={styles.kpiTitulo}>Ejemplares Disponibles</p>
                <h3 style={styles.kpiNumero}>{totalEjemplares}</h3>
              </div>
              <span style={styles.kpiIcono}>📖</span>
            </div>
            
            <div style={styles.kpiCardCristal}>
              <div>
                <p style={styles.kpiTitulo}>Préstamos Activos</p>
                <h3 style={styles.kpiNumero}>{prestamosActivos ?? '--'}</h3>
              </div>
              <span style={styles.kpiIcono}>⏳</span>
            </div>
          </div>

          {/* Tarjeta de la Tabla Principal */}
          <div style={styles.cardTablaCristal}>
            <div style={styles.encabezado}>
              <div>
                <h2 style={styles.tituloSeccion}>Catálogo de Libros</h2>
                <p style={styles.subtituloSeccion}>Inventario oficial de la biblioteca pública y control de ISBN.</p>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <SearchFilter value={searchTerm} onChange={(v) => { setSearchTerm(v); setPage(1); }} placeholder="Buscar por cualquier campo" />
                <button
                  onClick={() => { setLibroSeleccionado(null); setIsModalOpen(true); }}
                  style={{
                    ...styles.botonNuevo,
                    backgroundColor: hoveredBtnNuevo ? '#a15c11' : '#854d0e',
                    transform: hoveredBtnNuevo ? 'translateY(-1px)' : 'none'
                  }}
                  onMouseEnter={() => setHoveredBtnNuevo(true)}
                  onMouseLeave={() => setHoveredBtnNuevo(false)}
                >
                  + Registrar Libro
                </button>
              </div>
            </div>

            {libros.length === 0 ? (
              <p style={styles.vacioText}>No hay libros registrados en el catálogo.</p>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.tabla}>
                  <thead>
                    <tr style={styles.filaHeader}>
                      <th style={{...styles.th, width: '50px'}}></th>
                      <th style={styles.th}>Título del Libro</th>
                      <th style={styles.th}>Autor</th>
                      <th style={styles.th}>ISBN / Registro</th>
                      <th style={styles.th}>Edición</th>
                      <th style={styles.th}>Fecha de Publicación</th>
                      <th style={styles.th}>Acciones de Control</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const filtered = libros.filter((l) => JSON.stringify(l).toLowerCase().includes(searchTerm.toLowerCase()));
                      const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
                      const current = Math.min(page, totalPages);
                      const paginated = filtered.slice((current - 1) * pageSize, current * pageSize);
                      
                      return paginated.map((libro) => (
                        <FilaLibro 
                          key={libro.idLibro}
                          libro={libro}
                          onEditar={(l) => { setLibroSeleccionado(l); setIsModalOpen(true); }}
                          onEliminar={async (id) => {
                            if (window.confirm(`¿Eliminar definitivamente este libro?`)) {
                              try {
                                await librosService.eliminar(id);
                                setLibros(libros.filter((l) => l.idLibro !== id));
                              } catch (err: unknown) {
                                if (err instanceof Error) alert(err.message); else alert('No se pudo eliminar el libro.');
                              }
                            }
                          }}
                        />
                      ));
                    })()}
                  </tbody>
                </table>
                <PaginationControls currentPage={page} totalPages={Math.max(1, Math.ceil(libros.filter((l) => JSON.stringify(l).toLowerCase().includes(searchTerm.toLowerCase())).length / pageSize))} onPageChange={setPage} pageSize={pageSize} onPageSizeChange={(s) => { setPageSize(s); setPage(1); }} />
              </div>
            )}
          </div>

        </div>
      </div>
      <LibroModal
        key={libroSeleccionado ? `editar-${libroSeleccionado.idLibro}` : 'nuevo'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGuardar={async (datos: Libro) => {
          if (datos.idLibro) {
            const editado = await librosService.actualizar(datos.idLibro, datos);
            setLibros(libros.map((l) => (l.idLibro === datos.idLibro ? editado : l)));
          } else {
            const creado = await librosService.crear(datos);
            setLibros([...libros, creado]);
          }
        }}
        libroAEditar={libroSeleccionado}
      />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  contenedorConFondo: {
    minHeight: '100vh',
    width: '100%',
    backgroundImage: 'url("https://unsplash.com")', 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  overlayOscuro: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)', // Fondo oscuro profundo que resalta el cristal
    minHeight: '100vh',
    width: '100%',
    padding: '40px 20px',
    boxSizing: 'border-box',
  },
  contenidoInterno: {
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
  centro: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '1.2rem',
    fontWeight: '500',
    color: '#94a3b8',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  // CAMBIADO: Efecto cristal premium con desenfoque y brillo sutil para los KPIs
  kpiCardCristal: {
    background: 'rgba(30, 41, 59, 0.45)', 
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
    color: '#ffffff',
  },
  kpiTitulo: {
    margin: 0,
    fontSize: '0.85rem',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '600'
  },
  kpiNumero: {
    margin: '6px 0 0 0',
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#ffffff',
  },
  kpiIcono: {
    fontSize: '2.2rem',
    background: 'rgba(255, 255, 255, 0.06)',
    padding: '10px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  // CAMBIADO: Contenedor principal de la tabla con transparencia fluida
  cardTablaCristal: {
    background: 'rgba(30, 41, 59, 0.4)', 
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.6)',
    color: '#ffffff',
  },
  encabezado: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '28px',
  },
  tituloSeccion: {
    margin: 0,
    fontSize: '1.85rem',
    fontWeight: '700',
    letterSpacing: '-0.025em',
    color: '#ffffff'
  },
  subtituloSeccion: {
    margin: '6px 0 0 0',
    color: '#94a3b8',
    fontSize: '0.95rem',
  },
  botonNuevo: {
    padding: '12px 24px',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 14px rgba(217, 119, 6, 0.25)',
  },
  vacioText: {
    textAlign: 'center',
    padding: '40px',
    color: '#94a3b8',
    fontStyle: 'italic',
    margin: 0,
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '14px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    background: 'rgba(15, 23, 42, 0.2)'
  },
  tabla: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  // CAMBIADO: Encabezado de tabla oscuro traslúcido para dar profundidad
  filaHeader: {
    background: 'rgba(15, 23, 42, 0.6)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  th: {
    padding: '18px 20px',
    color: '#cbd5e1',
    fontWeight: '600',
    fontSize: '0.9rem',
    letterSpacing: '0.02em'
  },
};
