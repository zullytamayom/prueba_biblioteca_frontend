# BiblioGest Frontend

Aplicación React + TypeScript para gestionar usuarios, libros y préstamos mediante la API de biblioteca.

## Requisitos

- Node.js 22+ y npm, para ejecución local.
- Docker, para construir y ejecutar el despliegue.
- Backend disponible y accesible desde el navegador o el contenedor.

## Ejecución local

1. `cp .env.example .env`
2. Configura `VITE_API_BASE_URL` con la URL base del backend.
3. `npm ci`
4. `npm run dev`
5. Abre `http://localhost:5173`.

## Validación

1. `npm run build`
2. `npm run lint`

## Despliegue con Docker

La URL del backend se incorpora durante el build de Vite mediante `VITE_API_BASE_URL`.

1. `docker build --build-arg VITE_API_BASE_URL=http://localhost:8080/api -t bibliogest-frontend .`
2. `docker run --rm -p 8081:80 bibliogest-frontend`
3. Abre `http://localhost:8081`.

Si el backend está en otro host, reemplaza la URL del argumento por una dirección accesible desde el navegador del evaluador.

## Funcionalidades

- Usuarios: listar, crear, editar y eliminar.
- Libros: listar, crear, editar y eliminar.
- Préstamos: registrar, consultar por usuario y por libro, y consultar ejemplares disponibles por ISBN.
