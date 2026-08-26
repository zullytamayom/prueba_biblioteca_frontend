const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface Libro {
  id?: number;
  titulo: string;      // Corregido
  autor: string;       // Corregido
  isbn: string;        // Corregido
  edicion?: string;
}

export const librosService = {
  listar: async (): Promise<Libro[]> => {
    const respuesta = await fetch(`${BASE_URL}/libros`);
    if (!respuesta.ok) {
      throw new Error("Error al obtener la lista de libros de la API");
    }
    return await respuesta.json();
  }
};
