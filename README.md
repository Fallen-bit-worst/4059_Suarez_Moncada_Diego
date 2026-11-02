# AiPixel - Inventario

Aplicación para registrar y administrar figuras de anime. Usa React, TypeScript, Node.js, Express y MongoDB.

## Requisitos

Node.js y MongoDB funcionando en la computadora.

## Instalación

En `server`:

```bash
npm install
```

Copia `.env.example` a `.env`. Revisa `MONGO_URI` y cambia `JWT_SECRET` por una clave aleatoria propia de al menos 32 caracteres.

```bash
npm run dev
```

En otra terminal, dentro de `client`:

```bash
npm install
```

Copia `.env.example` a `.env` y ejecuta:

```bash
npm run dev
```

Abre http://localhost:5173, crea tu cuenta e inicia sesión. Desde el panel puedes agregar, consultar, editar y eliminar tus productos. Cada cuenta gestiona sus propios registros.

Para verificar el frontend: `npm run build` dentro de `client`.

## API

`POST /api/auth/registro` · `POST /api/auth/login` · `GET /api/auth/perfil`

Las rutas `/api/productos` usan `Authorization: Bearer <token>` y permiten GET, POST, PUT y DELETE.

Repositorio: https://github.com/Fallen-bit-worst/4059_Suarez_Moncada_Diego
