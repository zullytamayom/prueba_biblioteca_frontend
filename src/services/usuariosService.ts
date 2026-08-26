const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
}

export const usuariosService = {
  listar: async (): Promise<Usuario[]> => {
    const respuesta = await fetch(`${BASE_URL}/usuarios`);
    if (!respuesta.ok) {
      throw new Error("Error al obtener la lista de usuarios de la API");
    }
    return await respuesta.json();
  }
};
