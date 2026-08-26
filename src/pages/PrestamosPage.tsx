import React, { useState, useEffect } from 'react';
import { librosService } from '../services/librosService';
import type { Ejemplar, Libro } from '../services/librosService';
import { prestamosService, type Prestamo } from '../services/prestamosServices';
import { usuariosService, type Usuario } from '../services/usuariosService';
import { PasoUsuario } from '../components/loans/PasoUsuario';
import { PasoLibro } from '../components/loans/PasoLibro';
import { PasoConfirmar } from '../components/loans/PasoConfirmar';

export const PrestamosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [libros, setLibros] = useState<Libro[]>([]);
  const [ejemplaresDisponibles, setEjemplaresDisponibles] = useState<Ejemplar[]>([]);

  const [idUsuarioSelected, setIdUsuarioSelected] = useState<number>(0);
  const [isbnLibroSelected, setIsbnLibroSelected] = useState<string>('');
  const [ejemplarSelected, setEjemplarSelected] = useState<Ejemplar | null>(null);
  const [diasPrestamo, setDiasPrestamo] = useState<number>(15);

  const [prestamosActivosUsuario, setPrestamosActivosUsuario] = useState<Prestamo[]>([]);
  const [isEligible, setIsEligible] = useState<boolean>(true);
  const [busquedaLibro, setBusquedaLibro] = useState<string>('');
  const [loadingEjemplares, setLoadingEjemplares] = useState<boolean>(false);
  const [prestamosPorLibro, setPrestamosPorLibro] = useState<Prestamo[]>([]);
  const [idLibroHistorial, setIdLibroHistorial] = useState<number>(0);
  const [loadingHistorial, setLoadingHistorial] = useState<boolean>(false);

  useEffect(() => {
    Promise.all([librosService.listar(), usuariosService.listar()])
      .then(([librosData, usuariosData]) => {
        setLibros(librosData);
        setUsuarios(usuariosData);
      })
      .catch(console.error);
  }, []);

  const handleUsuarioChange = async (id: number) => {
    setIdUsuarioSelected(id);
    setPrestamosActivosUsuario([]);
    setIsbnLibroSelected('');
    setEjemplarSelected(null);
    setBusquedaLibro('');

    if (id === 0) {
      setIsEligible(true);
      return;
    }

    try {
      const activos = await prestamosService.getPrestamosActivosByUsuario(id);
      setPrestamosActivosUsuario(activos);
      setIsEligible(activos.length < 3);
    } catch (error) {
      console.error(error);
      setIsEligible(false);
    }
  };

  const handleLibroChange = async (isbn: string) => {
    setIsbnLibroSelected(isbn);
    setEjemplarSelected(null);
    setEjemplaresDisponibles([]);
    if (!isbn) return;

    setLoadingEjemplares(true);
    try {
      const data = await librosService.getEjemplaresDisponibles(isbn);
      setEjemplaresDisponibles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingEjemplares(false);
    }
  };

  const handleHistorialLibroChange = async (idLibro: number) => {
    setIdLibroHistorial(idLibro);
    setPrestamosPorLibro([]);
    if (!idLibro) return;

    setLoadingHistorial(true);
    try {
      setPrestamosPorLibro(await prestamosService.getPrestamosByLibro(idLibro));
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingHistorial(false);
    }
  };

  const handleConfirmarPrestamo = async () => {
    if (!isEligible || !ejemplarSelected || idUsuarioSelected === 0 || diasPrestamo <= 0) return;
    try {
      await prestamosService.crear({
        idUsuario: idUsuarioSelected,
        idEjemplar: ejemplarSelected.idEjemplares,
        fechaPrestamo: new Date().toISOString().split('T')[0],
        diasPrestamo
      });
      alert("🎉 ¡Préstamo guardado con éxito!");
      setIdUsuarioSelected(0);
      setIsbnLibroSelected('');
      setEjemplarSelected(null);
      setBusquedaLibro('');
      setIsEligible(true);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Ocurrió un error al guardar el préstamo.");
    }
  };

  const librosFiltrados = libros.filter(l => 
    l.titulo.toLowerCase().includes(busquedaLibro.toLowerCase()) || l.isbn.includes(busquedaLibro)
  );

  const usuariosParaPrestamo = usuarios.filter(
    (usuario): usuario is Usuario & { idUsuario: number } => typeof usuario.idUsuario === 'number'
  );
  const usuarioActual = usuariosParaPrestamo.find(u => u.idUsuario === idUsuarioSelected);

  return (
    <div style={{ padding: '30px', color: '#fff' }}>
      <h2 style={{ margin: 0, fontSize: '1.8rem' }}>Proceso de Préstamo Guiado</h2>
      <p style={{ color: '#94a3b8', margin: '6px 0 30px 0' }}>Asistente administrativo inteligente.</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'start' }}>
        <PasoUsuario 
          usuarios={usuariosParaPrestamo} 
          idUsuarioSelected={idUsuarioSelected} 
          onUsuarioChange={handleUsuarioChange} 
          isEligible={isEligible} 
          prestamosActivos={prestamosActivosUsuario} 
        />
        <PasoLibro 
          idUsuarioSelected={idUsuarioSelected} isEligible={isEligible} busquedaLibro={busquedaLibro} 
          setBusquedaLibro={setBusquedaLibro} librosFiltrados={librosFiltrados} isbnLibroSelected={isbnLibroSelected} 
          handleLibroChange={handleLibroChange} loadingEjemplares={loadingEjemplares} 
          ejemplaresDisponibles={ejemplaresDisponibles} setEjemplarSelected={setEjemplarSelected} ejemplarSelected={ejemplarSelected} 
        />
        <PasoConfirmar 
          usuarioActual={usuarioActual} ejemplarSelected={ejemplarSelected} diasPrestamo={diasPrestamo} 
          setDiasPrestamo={setDiasPrestamo} handleConfirmarPrestamo={handleConfirmarPrestamo} 
          isEligible={isEligible} idUsuarioSelected={idUsuarioSelected} 
        />
      </div>

      <section style={styles.historial}>
        <h3 style={styles.historialTitulo}>Consultar préstamos por libro</h3>
        <select value={idLibroHistorial} onChange={(e) => handleHistorialLibroChange(Number(e.target.value))} style={styles.historialSelect}>
          <option value={0}>-- Selecciona un libro --</option>
          {libros.map((libro) => <option key={libro.idLibro} value={libro.idLibro}>{libro.titulo}</option>)}
        </select>
        {loadingHistorial ? <p>Consultando historial...</p> : idLibroHistorial !== 0 && prestamosPorLibro.length === 0 ? <p>No hay préstamos para este libro.</p> : (
          <ul>
            {prestamosPorLibro.map((prestamo) => <li key={prestamo.idPrestamo}>{prestamo.codigoInventario} - {prestamo.nombreUsuario} - {prestamo.estado}</li>)}
          </ul>
        )}
      </section>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  historial: { marginTop: '28px', padding: '24px', background: 'rgba(30, 41, 59, 0.45)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '16px', color: '#cbd5e1' },
  historialTitulo: { marginTop: 0, color: '#fff' },
  historialSelect: { width: '100%', maxWidth: '480px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.5)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.12)' },
};
