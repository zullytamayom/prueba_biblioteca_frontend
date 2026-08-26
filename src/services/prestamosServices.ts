const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface PrestamoRequest {
  idUsuario: number;
  idEjemplar: number;
  fechaPrestamo: string;
  diasPrestamo: number;
}

export interface Prestamo {
  idPrestamo: number;
  idUsuario: number;
  nombreUsuario: string;
  idEjemplar: number;
  codigoInventario: string;
  tituloLibro: string;
  fechaPrestamo: string;
  estado: 'ACTIVO' | 'DEVUELTO' | 'VENCIDO' | string;
}

type PrestamoApi = Partial<Prestamo> & {
  usuarioId?: number | string;
  ejemplarId?: number | string;
  codigoEjemplar?: string;
  estadoPrestamo?: string;
};

const normalizarPrestamo = (prestamo: PrestamoApi): Prestamo => ({
  ...prestamo,
  idUsuario: Number(prestamo.idUsuario ?? prestamo.usuarioId),
  idEjemplar: Number(prestamo.idEjemplar ?? prestamo.ejemplarId),
  codigoInventario: prestamo.codigoInventario ?? prestamo.codigoEjemplar ?? '',
  estado: prestamo.estado ?? prestamo.estadoPrestamo ?? '',
} as Prestamo);

export const prestamosService = {
  getPrestamosByLibro: async (idLibro: number): Promise<Prestamo[]> => {
    const respuesta = await fetch(`${BASE_URL}/prestamos/libro/${idLibro}`);
    if (!respuesta.ok) throw new Error("Error al obtener los préstamos del libro");

    const data = await respuesta.json();
    return Array.isArray(data) ? data.map((prestamo: PrestamoApi) => normalizarPrestamo(prestamo)) : [];
  },

  contarActivos: async (): Promise<number> => {
    const respuesta = await fetch(`${BASE_URL}/usuarios`);
    if (!respuesta.ok) throw new Error("Error al obtener los usuarios");

    const usuarios = await respuesta.json();
    if (!Array.isArray(usuarios)) return 0;

    const prestamosPorUsuario = await Promise.all(
      usuarios.map((usuario: { idUsuario: number }) =>
        prestamosService.getPrestamosActivosByUsuario(Number(usuario.idUsuario))
      )
    );
    return prestamosPorUsuario.reduce((total, prestamos) => total + prestamos.length, 0);
  },

  listarTodos: async (): Promise<Prestamo[]> => {
    const respuesta = await fetch(`${BASE_URL}/prestamos`);
    if (!respuesta.ok) throw new Error("Error al obtener el historial de préstamos");
    const data = await respuesta.json();
    return Array.isArray(data) ? data.map(normalizarPrestamo) : [];
  },

  getPrestamosActivosByUsuario: async (idUsuario: number): Promise<Prestamo[]> => {
    const respuesta = await fetch(`${BASE_URL}/prestamos/usuario/${idUsuario}`);
    if (!respuesta.ok) throw new Error("Error al validar préstamos activos del usuario");
    
    const data = await respuesta.json();
    if (Array.isArray(data)) {
      // Filtramos solo los que sigan en estado ACTIVO o pendientes de devolución
      return data
        .map((prestamo: PrestamoApi) => normalizarPrestamo(prestamo))
        .filter((p: Prestamo) => p.estado.toUpperCase() === 'ACTIVO');
    }
    return [];
  },

  crear: async (datos: PrestamoRequest): Promise<Prestamo> => {
    const respuesta = await fetch(`${BASE_URL}/prestamos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuarioId: datos.idUsuario,
        ejemplarId: datos.idEjemplar,
        fechaPrestamo: datos.fechaPrestamo,
        diasPrestamo: datos.diasPrestamo,
      })
    });

    if (!respuesta.ok) {
      const errorData = await respuesta.json().catch(() => ({}));
      throw new Error(errorData.message || 'No se pudo procesar el préstamo. Verifica las reglas de negocio.');
    }

    return normalizarPrestamo(await respuesta.json());
  }
};
