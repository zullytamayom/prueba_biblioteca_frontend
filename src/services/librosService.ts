const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface Libro {
  idLibro?: number;
  titulo: string;
  autor: string;       
  isbn: string;     
  edicion?: string;
  fechaPublicacion?: string;
}

export interface Ejemplar {
  idEjemplares: number;
  codigoInventario: string;
  estado: 'DISPONIBLE' | 'PRESTADO' | string; 
  libroId: number;     
  tituloLibro: string;  
}

export const librosService = {
  listar: async (): Promise<Libro[]> => {
    const respuesta = await fetch(`${BASE_URL}/libros`);
    if (!respuesta.ok) {
      throw new Error("Error al obtener la lista de libros de la API");
    }
    return await respuesta.json();
  },

  crear: async (libro: Libro): Promise<Libro> => {
    const respuesta = await fetch(`${BASE_URL}/libros`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(libro)
    });

    if (!respuesta.ok) {
      const errorData = await respuesta.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al registrar el libro en el servidor.');
    }

    return await respuesta.json();
  },

  actualizar: async (idLibro: number, libro: Libro): Promise<Libro> => {
    const respuesta = await fetch(`${BASE_URL}/libros/${idLibro}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(libro)
    });

    if (!respuesta.ok) {
      const errorData = await respuesta.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al actualizar el libro en el servidor.');
    }

    return await respuesta.json();
  },

  eliminar: async (idLibro: number): Promise<void> => {
    const res = await fetch(`${BASE_URL}/libros/${idLibro}`, { method: 'DELETE' });
    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status}`);
    }
  },

  // === EJEMPLARES===

  getEjemplaresDisponibles: async (isbn: string): Promise<Ejemplar[]> => {
    const response = await fetch(`${BASE_URL}/ejemplares/disponibles?isbn=${isbn}`);
    
    if (!response.ok) {
      throw new Error('Error al obtener los ejemplares disponibles desde el servidor');
    }
    
    return await response.json();
  },


  crearEjemplar: async (libroId: number, codigoEjemplar: string): Promise<Ejemplar> => {
    const response = await fetch(`${BASE_URL}/ejemplares`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        codigoEjemplar: codigoEjemplar,
        libroId: libroId
      }),
    });
    if (!response.ok) throw new Error('Error al crear el ejemplar');
    return response.json();
  },

   

};
