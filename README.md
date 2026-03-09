# LOTR API - El Señor de los Anillos

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

## Documentación OpenAPI

El fichero `openapi.yaml` contiene la especificación completa de las operaciones CRUD del modelo `Character`. Se puede visualizar con [Swagger Editor](https://editor.swagger.io/) importando el archivo.
