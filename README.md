# Biblioteca# BibliotecaApp - Sistema de Gestión de Biblioteca

Sistema completo para la gestión de una biblioteca, desarrollado con arquitectura de microservicios (monorepo). Permite gestionar libros, préstamos, devoluciones, y ofrecer estadísticas y recomendaciones a los usuarios.

## Tecnologías

### Frontend
- **React 18** - Framework de UI
- **React Router v7** - Enrutamiento SPA
- **Axios** - Cliente HTTP
- **Context API** - Manejo de estado global
- **Vite** - Build tool y dev server
- **CSS personalizado** - Diseño glassmorphism dark mode

### Backend
- **Node.js** - Runtime
- **Express** - Framework HTTP
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación basada en tokens
- **Argon2** - Hashing seguro de contraseñas
- **express-validator** - Validación de entradas

### Base de datos
- **MongoDB** - Base de datos NoSQL

## Arquitectura

Monorepo con 3 microservicios independientes comunicándose vía HTTP:

```
biblioteca-app/
├── frontend/            → React (Vite)        → Puerto 5173
├── service-auth/        → Express + JWT       → Puerto 3001
├── service-library/     → Express + Mongoose  → Puerto 3002
├── service-statistics/  → Express + HTTP      → Puerto 3003
├── README.md
└── .gitignore
```

### Comunicación entre servicios
- **Frontend** → service-auth (registro, login)
- **Frontend** → service-library (CRUD libros, préstamos, devoluciones)
- **Frontend** → service-statistics (estadísticas, recomendaciones, resumen)
- **service-statistics** → service-library (obtener datos vía HTTP interno)

## Instalación

### Prerrequisitos
- Node.js >= 18
- MongoDB corriendo en `localhost:27017`
- Git

### 1. Clonar el repositorio
```bash
git clone URL_DEL_REPOSITORIO
cd biblioteca-app
```

### 2. Instalar dependencias del Frontend
```bash
cd frontend
npm install
```

### 3. Instalar dependencias del Servicio Auth
```bash
cd ../service-auth
npm install
```

### 4. Instalar dependencias del Servicio Library
```bash
cd ../service-library
npm install
```

### 5. Instalar dependencias del Servicio Statistics
```bash
cd ../service-statistics
npm install
```

## Variables de Entorno

Los archivos `.env` ya vienen configurados. Verifica que coincidan con tu entorno.

### service-auth/.env
```env
PORT=3001
MONGO_URI=mongodb://localhost:27017/biblioteca-auth
JWT_SECRET=biblioteca_auth_super_secret_key_2026
JWT_EXPIRES_IN=24h
```

### service-library/.env
```env
PORT=3002
MONGO_URI=mongodb://localhost:27017/biblioteca-library
JWT_SECRET=biblioteca_auth_super_secret_key_2026
```

### service-statistics/.env
```env
PORT=3003
MONGO_URI=mongodb://localhost:27017/biblioteca-statistics
JWT_SECRET=biblioteca_auth_super_secret_key_2026
SERVICE_LIBRARY_URL=http://localhost:3002
```

### frontend/.env
```env
VITE_API_AUTH=http://localhost:3001
VITE_API_LIBRARY=http://localhost:3002
VITE_API_STATISTICS=http://localhost:3003
```

## Ejecución

Abrir **4 terminales** y ejecutar cada servicio desde su carpeta:

### Terminal 1 - Servicio Auth
```bash
cd service-auth
npm run dev
```
> Servidor corriendo en http://localhost:3001

### Terminal 2 - Servicio Library
```bash
cd service-library
npm run dev
```
> Servidor corriendo en http://localhost:3002

### Terminal 3 - Servicio Statistics
```bash
cd service-statistics
npm run dev
```
> Servidor corriendo en http://localhost:3003

### Terminal 4 - Frontend
```bash
cd frontend
npm run dev
```
> Aplicación corriendo en http://localhost:5173

## Puertos

| Servicio      | Puerto |
|---------------|--------|
| Frontend      | 5173   |
| Auth          | 3001   |
| Library       | 3002   |
| Statistics    | 3003   |
| MongoDB       | 27017  |

## API Endpoints

### Auth (puerto 3001)
| Método | Ruta              | Descripción        |
|--------|-------------------|--------------------|
| POST   | /auth/register    | Registrar usuario  |
| POST   | /auth/login       | Iniciar sesión     |
| GET    | /auth/profile     | Obtener perfil     |

### Library (puerto 3002)
| Método | Ruta              | Descripción            |
|--------|-------------------|------------------------|
| GET    | /books            | Listar libros          |
| GET    | /books/:id        | Obtener libro por ID   |
| POST   | /books            | Crear libro            |
| PUT    | /books/:id        | Actualizar libro       |
| DELETE | /books/:id        | Eliminar libro         |
| GET    | /loans            | Listar préstamos       |
| GET    | /loans/active     | Préstamos activos      |
| POST   | /loans            | Registrar préstamo     |
| POST   | /returns          | Registrar devolución   |

### Statistics (puerto 3003)
| Método | Ruta                      | Descripción          |
|--------|---------------------------|----------------------|
| GET    | /statistics               | Estadísticas generales |
| GET    | /statistics/categories    | Por categorías       |
| GET    | /recommendations/:category| Recomendaciones      |
| GET    | /summary                  | Resumen general      |

## Estructura de Carpetas

```
biblioteca-app/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── Layout.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Books.jsx
│   │   │   ├── AddBook.jsx
│   │   │   ├── EditBook.jsx
│   │   │   ├── Loans.jsx
│   │   │   ├── Returns.jsx
│   │   │   ├── Statistics.jsx
│   │   │   ├── Recommendations.jsx
│   │   │   └── Summary.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── service-auth/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   └── authController.js
│   │   ├── helpers/
│   │   │   └── tokenHelper.js
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js
│   │   │   └── validation.js
│   │   ├── models/
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   └── authRoutes.js
│   │   └── index.js
│   ├── .env
│   └── package.json
├── service-library/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── bookController.js
│   │   │   └── loanController.js
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js
│   │   │   └── validation.js
│   │   ├── models/
│   │   │   ├── Book.js
│   │   │   └── Loan.js
│   │   ├── routes/
│   │   │   ├── bookRoutes.js
│   │   │   └── loanRoutes.js
│   │   └── index.js
│   ├── .env
│   └── package.json
├── service-statistics/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   │   └── statisticsController.js
│   │   ├── middlewares/
│   │   │   └── authMiddleware.js
│   │   ├── routes/
│   │   │   └── statisticsRoutes.js
│   │   ├── services/
│   │   │   └── libraryService.js
│   │   └── index.js
│   ├── .env
│   └── package.json
├── README.md
└── .gitignore
```

## Seguridad

- **Argon2** para hashing de contraseñas (más seguro que bcrypt)
- **JWT** con expiración de 24 horas
- **Validación** server-side con express-validator
- **Validación** client-side en todos los formularios
- **CORS** habilitado entre servicios
- **Manejo centralizado de errores**

## Diseño

- Modo oscuro con paleta: negro, azul oscuro, café, gris, azul eléctrico
- Glassmorphism con backdrop-filter
- Sidebar colapsable
- Animaciones CSS suaves
- Responsive design
- Sin dependencias de UI externas (CSS puro)

## Git - Ramas

```
main           → Producción estable
develop        → Integración
feature/auth   → Funcionalidad de autenticación
feature/library → CRUD de biblioteca
feature/statistics → Estadísticas y recomendaciones
feature/frontend   → Interfaz de usuario
```

## Autores

Desarrollado como proyecto de laboratorio.

## Licencia

Proyecto educativo. Todos los derechos reservados.