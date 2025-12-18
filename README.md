# 💰 Módulo de Efecto de la Inflación sobre el Ahorro

Una aplicación web desarrollada en Node.js que calcula el impacto de la inflación en el poder adquisitivo del ahorro personal.

## 📋 Descripción

Este módulo permite calcular:
- **Valor real final** del ahorro considerando la inflación
- **Pérdida absoluta** en términos monetarios
- **Pérdida porcentual acumulada** por efecto de la inflación
- **Serie temporal** opcional (anual o trimestral) del deterioro del poder adquisitivo

## 📸 Captura de Pantalla

![Screenshot de la Aplicación](public/static/img/screenshot.png)

*Interfaz principal del Módulo de Efecto de la Inflación sobre el Ahorro*

## 🚀 Características

- ✅ **API REST** con validación robusta usando Zod
- ✅ **Interfaz web moderna** y responsiva
- ✅ **Cálculos precisos** con manejo de años fraccionales
- ✅ **Tests completos** con cobertura ≥80% en módulo core
- ✅ **Seguridad** con Helmet, CORS y rate limiting
- ✅ **Documentación** completa de la API

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js 20 LTS** - Runtime de JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos relacional
- **Zod** - Validación de esquemas
- **Vitest** - Framework de testing
- **Supertest** - Testing de APIs

### Base de Datos
- **MongoDB** - Base de datos NoSQL con Mongoose ODM
- **Mongoose** - Object Data Modeling para MongoDB

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con variables CSS
- **JavaScript ES2022** - Funcionalidad interactiva
- **Tailwind CSS** - Framework de diseño responsivo (CDN)
- **Canvas API** - Gráficos de evolución temporal

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **Prettier** - Formateo de código
- **Nodemon** - Desarrollo con recarga automática

## 📦 Instalación

### Prerrequisitos
- Node.js 20 LTS o superior
- npm o yarn
- MongoDB (local o MongoDB Atlas)

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd modulo-inflacion-ahorro
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales de MongoDB
# Para MongoDB local:
MONGODB_URI=mongodb://localhost:27017/inflacion_ahorro

# Para MongoDB Atlas:
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/inflacion_ahorro
```

4. **Iniciar MongoDB** (si usas instalación local)
```bash
# Windows
mongod

# macOS/Linux
brew services start mongodb-community
# o
sudo systemctl start mongod
```

5. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

6. **Acceder a la aplicación**
```
http://localhost:3000
```

## 🧪 Testing

### Ejecutar todos los tests
```bash
npm test
```

### Ejecutar tests con cobertura
```bash
npm run test:coverage
```

### Ejecutar tests específicos
```bash
# Tests del módulo core
npm test src/core/

# Tests de API
npm test src/api/
```

## 📊 API Documentation

### Endpoint Principal

**POST** `/api/v1/inflation/effect`

Calcula el efecto de la inflación sobre un monto de ahorro.

#### Request Body
```json
{
  "amount_nominal": 10000.0,
  "inflation_rate": 6.5,
  "years": 3,
  "granularity": "yearly"
}
```

#### Parámetros
- `amount_nominal` (number, requerido): Monto nominal inicial
- `inflation_rate` (number, requerido): Tasa de inflación anual en %
- `years` (number, requerido): Número de años (puede ser fraccional)
- `granularity` (string, opcional): "none", "yearly", "quarterly"

#### Response 200
```json
{
  "success": true,
  "data": {
    "amount_nominal": 10000.0,
    "inflation_rate": 6.5,
    "years": 3,
    "real_value": 8256.11,
    "absolute_loss": 1743.89,
    "loss_percent": 17.44,
    "series": [
      {"t": 1, "years": 1, "real_value": 9389.61, "loss_percent": 6.10},
      {"t": 2, "years": 2, "real_value": 8817.57, "loss_percent": 11.82},
      {"t": 3, "years": 3, "real_value": 8256.11, "loss_percent": 17.44}
    ]
  },
  "message": "Cálculo realizado exitosamente"
}
```

#### Response 400 (Error de validación)
```json
{
  "success": false,
  "error": "Datos de entrada inválidos: El monto nominal debe ser mayor a cero",
  "timestamp": "2025-01-XX..."
}
```

### Endpoint de Información

**GET** `/api/v1/info`

Retorna información sobre la API y sus endpoints.

## 🧮 Fórmulas Utilizadas

### Factor de Descuento
```
D = (1 + π)^t
```
Donde:
- π = tasa de inflación anual en decimal
- t = número de años

### Valor Real Final
```
A_real = A0 / D
```
Donde:
- A0 = monto nominal inicial
- D = factor de descuento

### Pérdida Absoluta
```
L_abs = A0 - A_real
```

### Pérdida Porcentual Acumulada
```
L_% = 1 - 1 / (1 + π)^t
```

## 📁 Estructura del Proyecto

```
modulo-inflacion-ahorro/
├── src/
│   ├── core/
│   │   ├── calculator.js          # Funciones puras de cálculo
│   │   └── calculator.test.js     # Tests del módulo core
│   ├── domain/
│   │   ├── validation.js          # Validaciones con Zod
│   │   └── validation.test.js     # Tests de validación
│   ├── api/
│   │   ├── effect.controller.js  # Controlador de la API
│   │   ├── routes.js              # Rutas Express
│   │   └── effect.api.test.js     # Tests de API
│   └── server.js                  # Servidor principal
├── public/
│   ├── index.html                 # Interfaz web
│   ├── styles.css                 # Estilos CSS
│   └── app.js                     # JavaScript del frontend
├── package.json                   # Dependencias y scripts
├── .eslintrc.cjs                  # Configuración ESLint
├── .prettierrc                    # Configuración Prettier
├── vitest.config.js               # Configuración Vitest
├── .gitignore                     # Archivos a ignorar
└── README.md                      # Este archivo
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Ejecutar con nodemon
npm start           # Ejecutar en producción

# Testing
npm test            # Ejecutar tests
npm run test:coverage # Tests con cobertura

# Calidad de código
npm run lint        # Verificar código con ESLint
npm run lint:fix    # Corregir errores de ESLint
npm run format      # Formatear código con Prettier
npm run format:check # Verificar formato
```

## 🌐 Despliegue en Producción

### Variables de Entorno
```bash
NODE_ENV=production
PORT=3000
```

### Comandos de despliegue
```bash
# Instalar dependencias de producción
npm ci --only=production

# Ejecutar tests
npm test

# Iniciar aplicación
npm start
```

### Configuración recomendada para AWS EC2
- **Instancia**: t3.micro o t3.small
- **Sistema operativo**: Ubuntu 22.04 LTS
- **Proxy reverso**: Nginx
- **Proceso**: PM2
- **SSL**: Let's Encrypt o AWS Certificate Manager

## 👥 Autores

- **Anibal Huaman**
- **Karen Medrano**
- **David Cantorín**
- **Sulmairy Garcia**
- **Diego Arrieta**

**Universidad Continental**  
**Curso**: DESARROLLO DE APLICACIONES WEB Y MÓVILES  
**Equipo**: Anibal Huaman, Karen Medrano, David Cantorín, Sulmairy Garcia, Diego Arrieta

## 📋 Alcance Técnico del Curso

Este proyecto cumple con los siguientes requisitos del curso:

- ✅ **Front-end**: HTML, CSS, JavaScript, Tailwind CSS
- ✅ **Back-end**: Node.js + Express
- ✅ **Base de datos**: MongoDB con Mongoose
- ✅ **Diseño responsivo**: Tailwind CSS + Media Queries
- ✅ **Diseño UX/UI**: Guía completa en `DESIGN_FIGMA.md`
- ✅ **Despliegue**: Render (configurado)

Para más detalles sobre el diseño, consultar `DESIGN_FIGMA.md`.
