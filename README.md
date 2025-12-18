# 💰 Calculadora de Inflación Inteligente

Aplicación web que calcula el impacto real de la inflación en tus ahorros, integrando tasas de interés (TREA) de la Superintendencia de Banca, Seguros y AFP (SBS) del Perú.

## 📋 Descripción

Herramienta financiera que permite:
- Calcular el **valor real final** del ahorro considerando inflación
- Integrar **tasas TREA** de diferentes entidades financieras (SBS)
- Visualizar **pérdida absoluta y porcentual** del poder adquisitivo
- Analizar **evolución temporal** con gráficos interactivos
- Comparar escenarios con y sin interés

## 🚀 Características Principales

- ✅ **Integración SBS**: Selección de tipo de cuenta y entidad financiera con tasas TREA
- ✅ **Cálculos Avanzados**: Considera inflación e interés para análisis neto preciso
- ✅ **Diseño Bancario**: Interfaz profesional con estilo corporativo
- ✅ **Totalmente Responsivo**: Diseño adaptativo para móvil, tablet y desktop
- ✅ **API REST**: Endpoints documentados con validación robusta (Zod)
- ✅ **Base de Datos**: MongoDB con historial de consultas y estadísticas
- ✅ **Seguridad**: Helmet, CORS, rate limiting y validación de datos

## 🛠️ Stack Tecnológico

### Backend
- **Node.js 20 LTS** + **Express.js**
- **MongoDB** + **Mongoose ODM**
- **Zod** para validación
- **Vitest** para testing

### Frontend
- **HTML5** semántico
- **CSS3** con variables y diseño adaptativo
- **JavaScript ES2022** (vanilla)
- **Tailwind CSS** (CDN) para utilidades
- **Canvas API** para gráficos

### Seguridad y Herramientas
- **Helmet**, **CORS**, **Rate Limiting**
- **ESLint**, **Prettier**, **Nodemon**

## 📦 Instalación Rápida

### Prerrequisitos
- Node.js 20+ y npm
- MongoDB (local o MongoDB Atlas)

### Pasos

1. **Clonar e instalar**
```bash
git clone <url-repositorio>
cd ModuloProyeccion
npm install
```

2. **Configurar variables de entorno**
```bash
# Crear archivo .env
MONGODB_URI=mongodb://localhost:27017/inflacion_ahorro
# O para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/inflacion_ahorro
PORT=3000
NODE_ENV=development
```

3. **Iniciar aplicación**
```bash
npm run dev    # Desarrollo con recarga automática
npm start      # Producción
```

4. **Acceder**
```
http://localhost:3000
```

## 📊 API Endpoints

### POST `/api/v1/inflation/effect`
Calcula el efecto de la inflación sobre un ahorro.

**Body:**
```json
{
  "amount_nominal": 10000,
  "inflation_rate": 6.5,
  "years": 3,
  "granularity": "yearly",
  "account_type": "caja_ahorro",    // Opcional
  "institution": "bcp"              // Opcional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "real_value": 8256.11,
    "absolute_loss": 1743.89,
    "loss_percent": 17.44,
    "trea_rate": 2.5,
    "future_value_with_interest": 10768.90,
    "net_rate": -4.0,
    "series": [...]
  }
}
```

### GET `/api/v1/sbs/rates`
Obtiene información de tasas SBS (tipos de cuenta, entidades, TREA).

### GET `/api/v1/inflation/history`
Historial de consultas con paginación.

### GET `/api/v1/inflation/statistics`
Estadísticas agregadas de uso.

### GET `/api/v1/info`
Información de la API.

## 🧪 Testing

```bash
npm test              # Ejecutar todos los tests
npm run test:coverage # Tests con cobertura
```

## 📁 Estructura del Proyecto

```
ModuloProyeccion/
├── src/
│   ├── api/              # Rutas y controladores
│   ├── core/             # Lógica de cálculo
│   ├── domain/           # Validación (Zod)
│   ├── persistence/      # MongoDB y repositorio
│   ├── data/             # Datos SBS
│   └── server.js         # Servidor Express
├── public/
│   ├── index.html        # Interfaz principal
│   ├── styles.css        # Estilos bancarios
│   └── app.js           # Lógica frontend
├── database/             # Documentación MongoDB
└── package.json
```

## 🎨 Diseño

- **Paleta**: Azul corporativo (#003d82, #0066cc)
- **Tipografía**: Inter con diferentes pesos
- **Responsive**: Mobile-first con 3 breakpoints
- **Componentes**: Cards, formularios, gráficos Canvas
- **Guía completa**: Ver `DESIGN_FIGMA.md`

## 🌐 Despliegue

### Render (Configurado)
- Variables de entorno: `MONGODB_URI`, `PORT`, `NODE_ENV`
- Build command: `npm install`
- Start command: `npm start`

## 📚 Documentación Adicional

- **`INFORME_TECNICO.md`**: Informe completo del proyecto
- **`DESIGN_FIGMA.md`**: Guía de diseño UX/UI
- **`MIGRACION_MONGODB.md`**: Proceso de migración
- **`database/README.md`**: Configuración MongoDB

## 👥 Equipo

**Curso:** DESARROLLO DE APLICACIONES WEB Y MÓVILES  
**Universidad Continental**

- Anibal Huaman
- Karen Medrano
- David Cantorín
- Sulmairy Garcia
- Diego Arrieta

## ✅ Alcance Técnico Cumplido

- ✅ **Front-end**: HTML, CSS, JavaScript, Tailwind CSS
- ✅ **Back-end**: Node.js + Express
- ✅ **Base de datos**: MongoDB con Mongoose
- ✅ **Diseño responsivo**: Tailwind CSS + Media Queries
- ✅ **Diseño UX/UI**: Guía en `DESIGN_FIGMA.md`
- ✅ **Despliegue**: Render

## 📄 Licencia

MIT

---

**Versión:** 1.0.0  
**Última actualización:** Diciembre 2024
