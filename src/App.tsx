import { Routes, Route, Navigate } from 'react-router-dom';
import { WelcomePage } from './pages/WelcomePage';
import { Sidebar } from './components/SideBar'; // Asegúrate de que las mayúsculas del nombre coincidan con tu archivo
import { UsuariosPage } from './pages/UsuariosPage';
import { LibrosPage } from './pages/LibrosPage';

function App() {
  return (
    <Routes>
      {/* 1. Ruta Inicial Espectacular (Limpia y sin propiedades viejas) */}
      <Route path="/" element={<WelcomePage />} />

      {/* 2. Rutas del Dashboard anidadas correctamente con el Layout Común */}
      <Route
        path="/dashboard/*"
        element={
          <div style={styles.layoutDashboard}>
            <Sidebar />
            <main style={styles.contenidoPrincipal}>
              <Routes>
                {/* Sub-rutas internas que heredarán el Menú Lateral automáticamente */}
                <Route path="usuarios" element={<UsuariosPage />} />
                <Route path="libros" element={<LibrosPage />} /> {/* Cargamos tu componente real de libros */}
                <Route path="prestamos" element={<div style={styles.vistaProvisional}><h2>📄 Gestión de Préstamos</h2><p>Próximamente...</p></div>} />
                
                {/* Redirección automática si entran a /dashboard a secas */}
                <Route path="*" element={<Navigate to="usuarios" replace />} />
              </Routes>
            </main>
          </div>
        }
      />

      {/* 3. Redirección global de seguridad para URLs inexistentes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

const styles = {
  layoutDashboard: { 
    display: 'flex', 
    height: '100vh', 
    width: '100vw', 
    overflow: 'hidden', 
    fontFamily: 'system-ui, sans-serif', 
    backgroundColor: '#f9fafb' 
  },
  contenidoPrincipal: { 
    flex: 1, 
    overflowY: 'auto' as const 
  },
  vistaProvisional: { 
    padding: '40px', 
    color: '#334155' 
  }
};

export default App;
