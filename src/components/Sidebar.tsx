import React from 'react';
import { NavLink } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const opciones = [
    { id: 'usuarios', nombre: '👥 Gestión Usuarios', ruta: '/dashboard/usuarios' },
    { id: 'libros', nombre: '📚 Gestión Libros', ruta: '/dashboard/libros' },
    { id: 'prestamos', nombre: '📄 Gestión Préstamos', ruta: '/dashboard/prestamos' }
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.brandContainer}>
        <span style={styles.iconoLibro}>🏛️</span>
        <h2 style={styles.titulo}>BiblioGest</h2>
        <p style={styles.subtitulo}>Sistema de Control</p>
      </div>
      <hr style={styles.separador} />
      
      <nav style={styles.nav}>
        {opciones.map((opcion) => (
          <NavLink
            key={opcion.id}
            to={opcion.ruta}
            style={({ isActive }) => ({
              ...styles.boton,
              backgroundColor: isActive ? '#854d0e' : 'transparent',
              color: isActive ? '#ffffff' : '#cbd5e1',
              boxShadow: isActive ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)' : 'none',
              textDecoration: 'none', // Evita que aparezca la línea azul de link clásico
              display: 'block'
            })}
          >
            {opcion.nombre}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '260px',
    backgroundColor: '#0f172a',
    height: '100vh',
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  brandContainer: {
    textAlign: 'center' as const,
    marginBottom: '16px',
  },
  iconoLibro: {
    fontSize: '32px',
    display: 'block',
    marginBottom: '8px',
  },
  titulo: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#f8fafc',
    margin: 0,
    letterSpacing: '0.5px',
  },
  subtitulo: {
    fontSize: '12px',
    color: '#94a3b8',
    margin: '4px 0 0 0',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  },
  separador: {
    border: '0',
    borderTop: '1px solid #334155',
    marginBottom: '24px',
    width: '100%',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  boton: {
    padding: '12px 16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'left' as const,
    fontSize: '15px',
    transition: 'all 0.2s ease',
    fontWeight: '500',
    boxSizing: 'border-box' as const,
  }
};
