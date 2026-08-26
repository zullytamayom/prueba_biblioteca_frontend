import { Routes, Route, Navigate } from 'react-router-dom';
import { WelcomePage } from './pages/WelcomePage';
import { Sidebar } from './components/SideBar';
import { UsuariosPage } from './pages/UsuariosPage';
import { LibrosPage } from './pages/LibrosPage';


function App() {
  return (
    <Routes>
      {}
      <Route path="/" element={<WelcomePage />} />

      {}
      <Route
        path="/dashboard/*"
        element={
          <div style={styles.layoutDashboard}>
            <Sidebar />
            <main style={styles.contenidoPrincipal}>
              <Routes>
                {/* 2. Rutas anidadas */}
                <Route path="usuarios" element={<UsuariosPage />} />
                <Route path="libros" element={<LibrosPage />} /> {}
          
                
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
