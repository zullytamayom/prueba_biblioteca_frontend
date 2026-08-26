const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface Usuario {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  fechaNacimiento: string;
}

export const usuariosService = {
  listar: async (): Promise<Usuario[]> => {
    const respuesta = await fetch(`${BASE_URL}/usuarios`);
    if (!respuesta.ok) {
      throw new Error("Error al obtener la lista de usuarios de la API");
    }
    return await respuesta.json();
  },
  crear: async (usuario: Usuario): Promise<Usuario> => {
    const respuesta = await fetch(`${BASE_URL}/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usuario)
    });

    if (!respuesta.ok) {
      const errorData = await respuesta.json().catch(() => ({}));
      throw new Error(errorData.message || "Error al registrar el lector en el servidor.");
    }

    return await respuesta.json();
  }
};
