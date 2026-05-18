# LOTR API - El Señor de los Anillos

![CI/CD](https://github.com/AntonioBarcel0/LOTR-openAPI-TEST/actions/workflows/ci-cd.yml/badge.svg)

API REST para gestionar personajes, armas y regiones de la Tierra Media, construida con **Node.js**, **Express** y **MongoDB**.

---

## Tecnologías

- **Node.js** + **Express** — servidor y enrutamiento
- **Mongoose** — modelado y validación de datos con MongoDB
- **Jest** + **mongodb-memory-server** — pruebas unitarias con base de datos en memoria
- **nodemon** — recarga automática en desarrollo

---

## Estructura del proyecto

```
LOTR-openAPI-TEST/
├── models/
│   ├── Character.js     # Modelo de personajes
│   ├── Weapon.js        # Modelo de armas
│   └── Region.js        # Modelo de regiones
├── tests/
│   ├── character.test.js  # 6 pruebas (3 positivas, 3 negativas)
│   └── weapon.test.js     # 5 pruebas (3 positivas, 2 negativas)
├── openapi.yaml         # Especificación OpenAPI 3.0 del modelo Character
├── server.js            # Punto de entrada
└── package.json
```

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd LOTR-openAPI-TEST

# 2. Instalar dependencias
npm install
```

---

## Uso

### Iniciar el servidor

Requiere tener **MongoDB** corriendo en `localhost:27017`.

```bash
# Producción
npm start

# Desarrollo (con recarga automática)
npm run dev
```

El servidor arranca en `http://localhost:3000`.

### Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Información general de la API |
| GET | `/health` | Comprobación de salud (API + conexión a la base de datos) |
| GET/POST | `/api/characters` | Listar o crear personajes |
| GET/PUT/DELETE | `/api/characters/:id` | Obtener, actualizar o eliminar un personaje |
| GET/POST | `/api/weapons` | Listar o crear armas |
| GET/PUT/DELETE | `/api/weapons/:id` | Obtener, actualizar o eliminar un arma |
| GET/POST | `/api/regions` | Listar o crear regiones |
| GET/PUT/DELETE | `/api/regions/:id` | Obtener, actualizar o eliminar una región |

---

## Ejecutar pruebas

Las pruebas no necesitan MongoDB instalado, usan una base de datos en memoria.

```bash
npm test
```

**11 pruebas en total** sobre los modelos `Character` y `Weapon`, incluyendo **5 casos negativos** que verifican las validaciones de Mongoose.

---

## Comprobación de salud (`/health`)

Endpoint pensado para monitorización y para el health check de Render. Comprueba
que la API responde y que la conexión a MongoDB está operativa (estado de
Mongoose + `ping` real a la base de datos).

- **`200 OK`** cuando todo está sano:

```json
{
  "status": "ok",
  "timestamp": "2026-05-19T10:00:00.000Z",
  "uptime": 42,
  "api": "ok",
  "database": { "status": "conectada", "healthy": true }
}
```

- **`503 Service Unavailable`** con `"status": "degraded"` si la base de datos
  no está accesible.

---

## Logs

La aplicación registra eventos por consola mediante `middleware/logger.js`:

- Formato: `[<timestamp ISO>] [<NIVEL>] <mensaje>`, con color por nivel
  (`INFO` cian, `WARN` amarillo, `ERROR` rojo).
- Cada petición HTTP se registra al finalizar con método, ruta, código de
  estado y duración: `GET /health 200 - 1ms`. El nivel se ajusta según el
  código (`>=500` → ERROR, `>=400` → WARN).
- Eventos de arranque, conexión a MongoDB y errores no controlados.

---

## CI/CD (GitHub Actions + Render)

El workflow [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml) se
ejecuta en cada `push` y `pull_request` a `main`:

1. **Job `test`** — instala dependencias (`npm ci`), ejecuta los tests con
   **cobertura** (`npm run test:coverage`) y sube el reporte de cobertura como
   *artifact* descargable.
2. **Job `deploy`** — solo en `push` a `main` y **solo si el job `test`
   pasa**. Lanza el despliegue en Render llamando a un *Deploy Hook*.

### Configuración necesaria en Render y GitHub

1. En Render, crea el *Web Service* a partir de este repositorio
   (build: `npm ci`, start: `npm start`) y configura la variable de entorno
   `MONGODB_URI`.
2. Configura el **Health Check Path** del servicio en Render a `/health`.
3. En Render, **Settings → Deploy Hook**, copia la URL del deploy hook.
4. En GitHub, **Settings → Secrets and variables → Actions**, crea el secreto
   `RENDER_DEPLOY_HOOK_URL` con esa URL. Si falta, el job `deploy` falla con un
   mensaje claro en lugar de quedarse colgado.

### Verificación en Render (paso manual)

Tras el primer despliegue, comprueba en el panel de Render que el health check
y los logs funcionan (requiere capturas de pantalla):

- **Logs**: pestaña *Logs* del servicio → deben verse las líneas con el formato
  `[timestamp] [INFO] ...`, incluyendo `Conectado a MongoDB`,
  `Servidor corriendo...` y una línea por cada petición.
- **Health check**: abre `https://<tu-servicio>.onrender.com/health` → debe
  devolver `200` con `"status": "ok"` y `"database": { "healthy": true }`.
  En *Events* / *Health* de Render el servicio debe figurar como *Live / Healthy*.

> Nota: este paso requiere acceso al panel de Render y a un servicio
> desplegado, por lo que debe realizarse manualmente y documentarse con
> capturas; no puede automatizarse desde el repositorio.

---

## Documentación OpenAPI

El fichero `openapi.yaml` contiene la especificación completa de las operaciones CRUD del modelo `Character`. Se puede visualizar con [Swagger Editor](https://editor.swagger.io/) importando el archivo.
