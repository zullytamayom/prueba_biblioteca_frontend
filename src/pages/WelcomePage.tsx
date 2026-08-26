import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const WelcomePage: React.FC = () => {
  const [hovered, setHovered] = useState<boolean>(false);
  const navigate = useNavigate(); // Hook profesional de React Router para cambiar de URL

  return (
    <div style={styles.heroContainer}>
      {/* Capa de gradiente profundo para fusionar la imagen con un acabado premium */}
      <div style={styles.overlayGradiente}>
        
        <header style={styles.header}>
          <div style={styles.logoContainer}>
            <span style={styles.logoIcono}>🏛️</span>
            <span style={styles.logoTexto}>BiblioGest</span>
          </div>
          <span style={styles.versionBadge}>v1.0.0 Stable</span>
        </header>

        <main style={styles.mainContent}>
          <p style={styles.tagline}>BIENVENIDO AL SISTEMA DE CONTROL</p>
          <h1 style={styles.tituloPrincipal}>
            El conocimiento, <br />
            <span style={styles.tituloDestacado}>perfectamente organizado.</span>
          </h1>
          <p style={styles.descripcion}>
            Gestiona de manera eficiente la colección de libros, el registro de lectores 
            y el control de préstamos activos en una plataforma unificada de alto rendimiento.
          </p>
          
          <button
            onClick={() => navigate('/dashboard/usuarios')} // Navegación nativa por URL
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              ...styles.botonAcceso,
              backgroundColor: hovered ? '#a15c11' : '#854d0e',
              transform: hovered ? 'scale(1.03) translateY(-2px)' : 'scale(1)',
              boxShadow: hovered ? '0 12px 24px rgba(133, 77, 14, 0.4)' : '0 4px 14px rgba(133, 77, 14, 0.3)'
            }}
          >
            <span>Ingresar al Dashboard</span>
            <span style={{ 
              ...styles.flechaIcono, 
              transform: hovered ? 'translateX(4px)' : 'translateX(0)' 
            }}>→</span>
          </button>
        </main>

        <footer style={styles.footer}>
          <p style={styles.footerText}>© 2026 Sistema de Gestión de Biblioteca Pública. Desarrollado en React + TypeScript.</p>
        </footer>

      </div>
    </div>
  );
};

const styles = {
  heroContainer: {
    // URL arreglada con los parámetros correctos de renderizado para Unsplash
    backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.88)), url('https://unsplash.com')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  overlayGradiente: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    height: '100%',
    width: '100%',
    padding: '40px 80px',
    boxSizing: 'border-box' as const,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcono: {
    fontSize: '28px',
  },
  logoTexto: {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: '800',
    letterSpacing: '0.5px',
    fontFamily: 'system-ui, sans-serif',
  },
  versionBadge: {
    color: '#94a3b8',
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  mainContent: {
    maxWidth: '650px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
  },
  tagline: {
    color: '#d97706',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '2px',
    margin: '0 0 16px 0',
  },
  tituloPrincipal: {
    color: '#ffffff',
    fontSize: '52px',
    fontWeight: '800',
    lineHeight: '1.15',
    margin: '0 0 20px 0',
    letterSpacing: '-1px',
    fontFamily: 'system-ui, sans-serif',
  },
  tituloDestacado: {
    color: '#fef3c7',
    fontWeight: '700',
  },
  descripcion: {
    color: '#cbd5e1',
    fontSize: '16px',
    lineHeight: '1.6',
    margin: '0 0 36px 0',
  },
  botonAcceso: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#ffffff',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  flechaIcono: {
    fontSize: '18px',
    display: 'inline-block',
    transition: 'transform 0.2s ease',
  },
  footer: {
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    paddingTop: '20px',
  },
  footerText: {
    color: '#64748b',
    fontSize: '13px',
    margin: 0,
  }
};
