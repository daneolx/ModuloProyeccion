# 📊 Informe Técnico del Proyecto
## Calculadora de Inflación Inteligente

**Curso:** DESARROLLO DE APLICACIONES WEB Y MÓVILES  
**Equipo de Desarrollo:**
- Anibal Huaman
- Karen Medrano
- David Cantorín
- Sulmairy Garcia
- Diego Arrieta

**Universidad Continental**  
**Fecha:** Diciembre 2024

---

## 📑 Tabla de Contenidos

1. [Desarrollo de la Aplicación](#1-desarrollo-de-la-aplicación)
2. [Pruebas de Usabilidad y Validación](#2-pruebas-de-usabilidad-y-validación)
3. [Documentación y Presentación Final](#3-documentación-y-presentación-final)
4. [Pitch Grupal](#4-pitch-grupal)

---

## 1. Desarrollo de la Aplicación

### 1.1 Estructura Front-end con Diseño Adaptativo

#### 1.1.1 Arquitectura Front-end

La aplicación utiliza una arquitectura de **Single Page Application (SPA)** con JavaScript vanilla, siguiendo el patrón de diseño orientado a objetos.

**Estructura de Archivos:**
```
public/
├── index.html          # Estructura HTML semántica
├── styles.css          # Estilos CSS con variables y diseño adaptativo
└── app.js             # Lógica de la aplicación (clase InflationCalculator)
```

#### 1.1.2 Tecnologías Front-end Implementadas

**HTML5 Semántico:**
- Estructura semántica con elementos `<header>`, `<main>`, `<footer>`
- Formularios accesibles con labels y validación HTML5
- Meta tags para SEO y viewport responsivo

**CSS3 Avanzado:**
- **Variables CSS (Custom Properties)** para mantener consistencia de colores
- **Sistema de diseño bancario** con paleta corporativa (#003d82, #0066cc)
- **Media Queries** para diseño responsivo en 3 breakpoints:
  - Mobile: < 640px
  - Tablet: 640px - 768px
  - Desktop: > 768px
- **Tailwind CSS** (CDN) para utilidades adicionales de diseño responsivo
- **Animaciones CSS** suaves con cubic-bezier para transiciones profesionales

**JavaScript ES2022:**
- **Clase `InflationCalculator`** que encapsula toda la lógica del frontend
- **Programación asíncrona** con async/await para llamadas a la API
- **Manejo de eventos** con Event Listeners nativos
- **Validación en tiempo real** de inputs
- **Canvas API** para renderizado de gráficos de evolución temporal

#### 1.1.3 Diseño Adaptativo (Responsive Design)

**Estrategia de Diseño Mobile-First:**

1. **Breakpoints Definidos:**
   ```css
   /* Mobile */
   @media (max-width: 640px) { ... }
   
   /* Tablet */
   @media (max-width: 768px) { ... }
   
   /* Desktop */
   @media (min-width: 769px) { ... }
   ```

2. **Ajustes por Dispositivo:**

   **Mobile (< 640px):**
   - Layout de una columna
   - Header con padding reducido
   - Formulario con padding optimizado
   - Tarjetas de resultados en columna única
   - Tabla con scroll horizontal
   - Footer con integrantes en columna

   **Tablet (640px - 768px):**
   - Layout de dos columnas para formulario y resultados
   - Grid de resultados de 2 columnas
   - Espaciado medio

   **Desktop (> 768px):**
   - Layout completo de 2 columnas (formulario | resultados)
   - Grid de resultados de 3 columnas
   - Espaciado máximo de 1280px

3. **Componentes Adaptativos:**
   - **Inputs:** Se ajustan automáticamente al ancho disponible
   - **Botones:** Ancho completo en mobile, auto en desktop
   - **Tablas:** Scroll horizontal en dispositivos pequeños
   - **Gráficos Canvas:** Se redimensionan según el contenedor

#### 1.1.4 Características de UX/UI Implementadas

**Diseño Bancario Profesional:**
- Paleta de colores corporativa (azul oscuro #003d82)
- Tipografía Inter con diferentes pesos (300-700)
- Iconos SVG profesionales (sin emojis)
- Espaciado consistente basado en múltiplos de 4px
- Sombras sutiles para profundidad
- Bordes conservadores (radius: 4-8px)

**Feedback Visual:**
- Estados hover en todos los elementos interactivos
- Estados focus visibles con outline azul
- Indicadores de carga con spinner animado
- Mensajes de error claros y específicos
- Validación en tiempo real de inputs

**Accesibilidad:**
- Contraste mínimo 4.5:1 para texto
- Navegación por teclado funcional
- Labels descriptivos en todos los campos
- Textos de ayuda bajo cada input
- ARIA labels implícitos en HTML semántico

#### 1.1.5 Integración con API SBS

**Funcionalidad de Selección de Cuenta:**
- Selector de tipo de cuenta (Caja de Ahorro, Cuenta de Ahorro, Depósito a Plazo)
- Carga dinámica de entidades financieras según tipo seleccionado
- Visualización de TREA (Tasa de Rendimiento Efectiva Anual) en tiempo real
- Sistema de caché para evitar múltiples llamadas a la API
- Manejo robusto de errores con mensajes informativos

**Código Clave:**
```javascript
// Carga asíncrona de instituciones
async loadInstitutions() {
    const response = await fetch('/api/v1/sbs/rates');
    const result = await response.json();
    this.institutions = result.data.institutions || [];
}

// Actualización dinámica del select
async handleAccountTypeChange(event) {
    // Carga instituciones según tipo de cuenta
    // Actualiza el DOM con nuevas opciones
}
```

### 1.2 Desarrollo de Rutas y Lógica del Back-end

#### 1.2.1 Arquitectura Back-end

La aplicación sigue una **arquitectura en capas (Layered Architecture)** con separación clara de responsabilidades:

```
src/
├── server.js              # Configuración del servidor Express
├── api/
│   ├── routes.js          # Definición de rutas REST
│   └── effect.controller.js  # Controladores de la API
├── core/
│   └── calculator.js      # Lógica de negocio (cálculos)
├── domain/
│   └── validation.js      # Validación de datos con Zod
├── persistence/
│   ├── db.mongodb.js      # Conexión a MongoDB
│   ├── models/
│   │   └── InflationQuery.js  # Modelo Mongoose
│   └── queries.repository.js  # Repositorio de datos
└── data/
    └── sbs-rates.js       # Datos de tasas SBS
```

#### 1.2.2 Configuración del Servidor (server.js)

**Tecnologías y Middlewares:**

1. **Express.js 4.18.2**
   - Framework web minimalista y flexible
   - Manejo de rutas y middlewares

2. **Seguridad Implementada:**
   ```javascript
   // Helmet - Protección de headers HTTP
   app.use(helmet({
     contentSecurityPolicy: { ... }
   }));
   
   // CORS - Control de acceso cross-origin
   app.use(cors({
     origin: process.env.NODE_ENV === 'production' ? [...] : true,
     credentials: true
   }));
   
   // Rate Limiting - Prevención de ataques DDoS
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutos
     max: 100 // 100 requests por IP
   });
   ```

3. **Optimización:**
   - **Compression:** Comprime respuestas HTTP (gzip)
   - **Static Files:** Servicio de archivos estáticos con caché
   - **JSON Parsing:** Validación de JSON antes de procesar

4. **Manejo de Errores:**
   - Middleware global de manejo de errores
   - Logging de errores no capturados
   - Graceful shutdown del servidor

#### 1.2.3 Rutas de la API (routes.js)

**Endpoints Implementados:**

1. **GET `/api/v1/info`**
   - **Propósito:** Información sobre la API y sus endpoints
   - **Respuesta:** JSON con documentación de la API
   - **Uso:** Documentación y debugging

2. **GET `/api/v1/sbs/rates`**
   - **Propósito:** Obtener información de tasas SBS
   - **Query Params Opcionales:**
     - `account_type`: Tipo de cuenta
     - `institution`: ID de entidad financiera
   - **Respuesta:**
     ```json
     {
       "success": true,
       "data": {
         "account_types": [...],
         "institutions": [...],
         "trea_rate": 2.5  // Si se especifican account_type e institution
       }
     }
     ```

3. **POST `/api/v1/inflation/effect`**
   - **Propósito:** Calcular el efecto de la inflación
   - **Body:**
     ```json
     {
       "amount_nominal": 10000,
       "inflation_rate": 6.5,
       "years": 3,
       "granularity": "yearly",
       "account_type": "caja_ahorro",  // Opcional
       "institution": "bcp"            // Opcional
     }
     ```
   - **Respuesta:**
     ```json
     {
       "success": true,
       "data": {
         "real_value": 8256.11,
         "absolute_loss": 1743.89,
         "loss_percent": 17.44,
         "trea_rate": 2.5,
         "future_value_with_interest": 10768.90,
         "series": [...]  // Si granularity != "none"
       }
     }
     ```

4. **GET `/api/v1/inflation/history`**
   - **Propósito:** Obtener historial de consultas
   - **Query Params:**
     - `limit`: Número de resultados (default: 50)
     - `offset`: Offset para paginación (default: 0)
   - **Respuesta:** Array de consultas con paginación

5. **GET `/api/v1/inflation/statistics`**
   - **Propósito:** Estadísticas agregadas de consultas
   - **Respuesta:** Promedios, totales, fechas mín/máx

#### 1.2.4 Lógica de Negocio (calculator.js)

**Funciones de Cálculo Implementadas:**

1. **`calculateDiscountFactor(inflationRate, years)`**
   - Calcula el factor de descuento: `(1 + π)^t`
   - Validación de parámetros negativos

2. **`calculateRealValue(nominalAmount, inflationRate, years)`**
   - Calcula valor real: `A0 / (1 + π)^t`
   - Manejo de años fraccionales

3. **`calculateFutureValueWithInterest(nominalAmount, treaRate, years)`**
   - Calcula valor futuro con interés: `A0 * (1 + TREA)^t`
   - Nueva funcionalidad para considerar tasas de interés

4. **`calculateRealValueWithInterest(...)`**
   - Calcula valor real considerando inflación e interés
   - Combina ambos efectos: interés positivo vs inflación negativa

5. **`calculateNetRate(inflationRate, treaRate, years)`**
   - Calcula tasa neta: `inflación - TREA`
   - Retorna 0 si TREA >= inflación (no hay pérdida neta)

6. **`generateTimeSeries(...)`**
   - Genera serie temporal anual o trimestral
   - Calcula valores por período para gráficos

**Características:**
- Funciones puras (sin efectos secundarios)
- Totalmente testables
- Manejo de errores con mensajes descriptivos
- Precisión decimal con redondeo a 2 decimales

#### 1.2.5 Validación de Datos (validation.js)

**Zod Schema de Validación:**

```javascript
export const inflationEffectSchema = z.object({
  amount_nominal: z.number()
    .positive('El monto nominal debe ser mayor a cero')
    .max(999999999, 'El monto nominal no puede exceder 999,999,999'),
  
  inflation_rate: z.number()
    .min(0, 'La tasa de inflación no puede ser negativa')
    .max(100, 'La tasa de inflación no puede exceder 100%'),
  
  years: z.number()
    .min(0, 'El número de años no puede ser negativo')
    .max(100, 'El número de años no puede exceder 100'),
  
  granularity: z.enum(['none', 'yearly', 'quarterly'])
    .optional()
    .default('none'),
  
  account_type: z.enum(['caja_ahorro', 'cuenta_ahorro', 'deposito_plazo'])
    .optional(),
  
  institution: z.string().min(1).optional(),
  
  trea_rate: z.number()
    .min(0)
    .max(100)
    .optional()
});
```

**Ventajas de Zod:**
- Validación en tiempo de ejecución
- Mensajes de error descriptivos
- TypeScript-friendly (inferencia de tipos)
- Validación de tipos y rangos

#### 1.2.6 Controladores (effect.controller.js)

**Patrón Controller Implementado:**

1. **`calculateInflationEffectController`**
   - Valida datos de entrada
   - Obtiene TREA si se proporciona account_type e institution
   - Ejecuta cálculos
   - Guarda en base de datos
   - Retorna respuesta JSON estructurada

2. **`getSBSRatesController`**
   - Retorna información de tasas SBS
   - Soporta consulta específica de TREA
   - Logging para debugging

3. **`getHistoryController`**
   - Obtiene historial con paginación
   - Manejo de errores de base de datos

4. **`getStatisticsController`**
   - Agregaciones de MongoDB
   - Estadísticas de uso de la aplicación

**Manejo de Errores:**
- Try-catch en todos los controladores
- Códigos de estado HTTP apropiados (400, 500)
- Mensajes de error descriptivos
- Logging de errores para debugging

### 1.3 Conexión con Base de Datos y Almacenamiento

#### 1.3.1 Base de Datos: MongoDB

**Tecnología:** MongoDB con Mongoose ODM

**Razón de Elección:**
- Cumple con el alcance técnico del curso (MongoDB, Firebase o MySQL)
- Flexibilidad para almacenar datos estructurados y no estructurados
- Fácil escalabilidad
- Integración nativa con Node.js

#### 1.3.2 Modelo de Datos (InflationQuery.js)

**Schema Mongoose:**

```javascript
{
  amount_nominal: Number,        // Monto inicial
  inflation_rate: Number,         // Tasa de inflación
  years: Number,                  // Período en años
  granularity: String,           // 'none', 'yearly', 'quarterly'
  real_value: Number,             // Valor real calculado
  absolute_loss: Number,          // Pérdida absoluta
  loss_percent: Number,           // Pérdida porcentual
  trea_rate: Number,              // Tasa TREA (opcional)
  series: Array,                  // Serie temporal (opcional)
  client_ip: String,              // IP del cliente
  user_agent: String,            // User agent
  createdAt: Date,               // Timestamp automático
  updatedAt: Date                // Timestamp automático
}
```

**Índices Optimizados:**
- `createdAt: -1` - Para ordenar por fecha descendente
- `amount_nominal: 1` - Para búsquedas por monto
- `inflation_rate: 1` - Para búsquedas por tasa
- `createdAt: 1, amount_nominal: 1` - Índice compuesto

#### 1.3.3 Conexión a MongoDB (db.mongodb.js)

**Configuración:**

```javascript
const MONGODB_URI = process.env.MONGODB_URI || 
  `mongodb://${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 27017}/${process.env.DB_NAME || 'inflacion_ahorro'}`;

const mongooseOptions = {
  maxPoolSize: 10,              // Pool de conexiones
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};
```

**Características:**
- Pool de conexiones para mejor rendimiento
- Timeouts configurados
- Event listeners para monitoreo
- Función de prueba de conexión
- Manejo graceful de desconexión

#### 1.3.4 Repositorio de Datos (queries.repository.js)

**Operaciones CRUD Implementadas:**

1. **`saveInflationQuery(queryData)`**
   - Guarda una nueva consulta
   - Retorna el documento guardado

2. **`getInflationQueryById(id)`**
   - Obtiene consulta por ID
   - Manejo de IDs inválidos

3. **`getAllInflationQueries({ limit, offset })`**
   - Obtiene consultas con paginación
   - Retorna total, data, limit, offset

4. **`getQueryStatistics()`**
   - Agregación MongoDB para estadísticas
   - Promedios, totales, fechas

5. **`getQueriesByDateRange(startDate, endDate)`**
   - Filtrado por rango de fechas
   - Útil para reportes

6. **`deleteOldQueries(days)`**
   - Limpieza de datos antiguos
   - Mantenimiento de la base de datos

7. **`getRecentQueries(limit)`**
   - Obtiene consultas más recientes
   - Para dashboards

**Patrón Repository:**
- Abstracción de la lógica de acceso a datos
- Fácil cambio de base de datos en el futuro
- Código reutilizable y testeable

#### 1.3.5 Almacenamiento de Datos SBS

**Archivo `src/data/sbs-rates.js`:**

- **Tipos de Cuenta:** Caja de Ahorro, Cuenta de Ahorro, Depósito a Plazo
- **Entidades Financieras:** 8 bancos + 3 financieras
- **Tasas TREA:** Por tipo de cuenta y entidad (valores de ejemplo)

**Nota:** En producción, estos datos deberían:
- Actualizarse periódicamente desde la SBS
- Almacenarse en base de datos para mejor rendimiento
- Implementar caché con TTL

---

## 2. Pruebas de Usabilidad y Validación

### 2.1 Pruebas Internas de Funcionamiento y Navegación

#### 2.1.1 Testing Unitario

**Framework:** Vitest 1.0.4

**Cobertura de Tests:**

1. **Tests del Módulo Core (`calculator.test.js`):**
   - ✅ `calculateDiscountFactor` - Valida cálculos correctos
   - ✅ `calculateRealValue` - Verifica fórmulas financieras
   - ✅ `calculateAbsoluteLoss` - Comprueba pérdidas
   - ✅ `calculateLossPercentage` - Valida porcentajes
   - ✅ `generateTimeSeries` - Verifica series temporales
   - ✅ `calculateInflationEffect` - Test de integración

2. **Tests de Validación (`validation.test.js`):**
   - ✅ Validación de esquemas Zod
   - ✅ Mensajes de error descriptivos
   - ✅ Validación de rangos y tipos

3. **Tests de API (`effect.api.test.js`):**
   - ✅ Endpoint POST `/api/v1/inflation/effect`
   - ✅ Validación de respuestas
   - ✅ Manejo de errores
   - ✅ Códigos de estado HTTP

**Ejecución de Tests:**
```bash
npm test              # Ejecutar todos los tests
npm run test:coverage # Tests con cobertura de código
```

#### 2.1.2 Pruebas de Navegación y Flujo de Usuario

**Escenarios Probados:**

1. **Flujo Completo sin Cuenta:**
   - ✅ Ingreso de monto, inflación y tiempo
   - ✅ Cálculo exitoso
   - ✅ Visualización de resultados
   - ✅ Gráfico de evolución (si se selecciona granularidad)

2. **Flujo Completo con Cuenta SBS:**
   - ✅ Selección de tipo de cuenta
   - ✅ Carga de entidades financieras
   - ✅ Selección de entidad
   - ✅ Visualización de TREA
   - ✅ Cálculo con interés incluido
   - ✅ Visualización de información de cuenta

3. **Validación de Formulario:**
   - ✅ Campos requeridos
   - ✅ Validación de rangos (min/max)
   - ✅ Mensajes de error en tiempo real
   - ✅ Prevención de envío con datos inválidos

4. **Responsive Design:**
   - ✅ Pruebas en diferentes tamaños de pantalla
   - ✅ Navegación en mobile
   - ✅ Funcionalidad de tabla con scroll
   - ✅ Gráficos adaptativos

#### 2.1.3 Pruebas de Rendimiento

**Métricas Evaluadas:**
- Tiempo de carga inicial: < 2 segundos
- Tiempo de respuesta de API: < 500ms
- Carga de instituciones: < 300ms
- Renderizado de gráficos: < 100ms

**Optimizaciones Implementadas:**
- Caché de instituciones en frontend
- Compresión de respuestas HTTP (gzip)
- Caché de archivos estáticos
- Índices en base de datos

#### 2.1.4 Pruebas de Compatibilidad

**Navegadores Probados:**
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (iOS)
- ✅ Navegadores móviles

**Características Verificadas:**
- ✅ Fetch API (soportado en todos los navegadores modernos)
- ✅ Canvas API (renderizado de gráficos)
- ✅ CSS Grid y Flexbox
- ✅ Variables CSS (Custom Properties)

### 2.2 Retroalimentación entre Equipos

#### 2.2.1 Proceso de Desarrollo Colaborativo

**Metodología:**
- Desarrollo iterativo e incremental
- Revisión de código entre pares
- Comunicación constante vía Git

**Herramientas de Colaboración:**
- **Git:** Control de versiones
- **GitHub/GitLab:** Repositorio remoto
- **Comunicación:** Reuniones de sincronización

#### 2.2.2 Retroalimentación Recibida e Implementada

**Mejoras Basadas en Feedback:**

1. **Integración de Tasas SBS:**
   - **Feedback:** "Sería útil poder seleccionar bancos y ver sus tasas"
   - **Implementación:** Sistema completo de selección de cuenta y banco con TREA

2. **Diseño Bancario:**
   - **Feedback:** "El diseño debe verse más profesional y corporativo"
   - **Implementación:** Rediseño completo con paleta bancaria y estilo minimalista

3. **Mejora de UX:**
   - **Feedback:** "Falta feedback visual durante las cargas"
   - **Implementación:** Estados de carga, mensajes informativos, validación en tiempo real

4. **Optimización de Rendimiento:**
   - **Feedback:** "La carga de instituciones es lenta en producción"
   - **Implementación:** Sistema de caché y carga asíncrona mejorada

#### 2.2.3 Resolución de Conflictos

**Estrategias Aplicadas:**
- Merge de ramas con revisión previa
- Resolución de conflictos mediante consenso
- Testing después de cada merge
- Documentación de decisiones técnicas

---

## 3. Documentación y Presentación Final

### 3.1 Manual del Usuario

#### 3.1.1 Introducción

La **Calculadora de Inflación Inteligente** es una herramienta web que permite calcular el impacto real de la inflación en tus ahorros, considerando las tasas de interés (TREA) ofrecidas por diferentes entidades financieras según la Superintendencia de Banca, Seguros y AFP (SBS) del Perú.

#### 3.1.2 Acceso a la Aplicación

1. Abre tu navegador web (Chrome, Firefox, Safari, Edge)
2. Ingresa la URL de la aplicación (proporcionada por el equipo)
3. La aplicación se cargará automáticamente

#### 3.1.3 Guía Paso a Paso

**Paso 1: Seleccionar Tipo de Cuenta (Opcional pero Recomendado)**

1. En el formulario, encuentra el campo "Tipo de Cuenta"
2. Selecciona una opción:
   - **Caja de Ahorro:** Cuenta de ahorro tradicional
   - **Cuenta de Ahorro:** Cuenta de ahorro estándar
   - **Depósito a Plazo Fijo:** Depósito con plazo determinado

**Paso 2: Seleccionar Entidad Financiera (Opcional)**

1. Después de seleccionar el tipo de cuenta, aparecerá el campo "Entidad Financiera"
2. Selecciona el banco o financiera de tu preferencia
3. Se mostrará automáticamente la **TREA** (Tasa de Rendimiento Efectiva Anual) de esa cuenta

**Paso 3: Ingresar Monto Nominal**

1. En el campo "Monto Nominal Inicial"
2. Ingresa el monto que planeas ahorrar (ejemplo: 10000)
3. El formato acepta decimales (ejemplo: 10000.50)

**Paso 4: Ingresar Tasa de Inflación**

1. En el campo "Tasa de Inflación Anual (%)"
2. Ingresa la tasa de inflación esperada (ejemplo: 6.5)
3. Puedes usar decimales (ejemplo: 6.5, 7.25)

**Paso 5: Ingresar Período de Tiempo**

1. En el campo "Período de Tiempo (años)"
2. Ingresa el número de años (puede ser fraccional)
3. Ejemplos: 3, 2.5, 1.25

**Paso 6: Seleccionar Granularidad (Opcional)**

1. En el campo "Granularidad del Análisis"
2. Opciones:
   - **Solo resultado final:** Muestra solo el resultado final
   - **Análisis anual:** Muestra evolución año por año
   - **Análisis trimestral:** Muestra evolución trimestre por trimestre

**Paso 7: Calcular**

1. Haz clic en el botón "CALCULAR EFECTO DE INFLACIÓN"
2. Espera unos segundos mientras se procesa
3. Los resultados aparecerán automáticamente

#### 3.1.4 Interpretación de Resultados

**Valor Real Final:**
- Es el poder adquisitivo que tendrá tu ahorro después del período especificado
- Si seleccionaste una cuenta con TREA, este valor considera el interés ganado

**Pérdida Absoluta:**
- Es la diferencia entre el monto inicial y el valor real final
- Representa cuánto dinero "perdiste" en términos de poder adquisitivo

**Pérdida Porcentual:**
- Es el porcentaje de pérdida de poder adquisitivo
- Si seleccionaste una cuenta con TREA, muestra la pérdida neta (inflación - interés)

**Información de la Cuenta (si se seleccionó):**
- Muestra el tipo de cuenta, entidad financiera y TREA
- Muestra el valor futuro con interés antes de aplicar inflación

**Gráfico de Evolución:**
- Si seleccionaste análisis anual o trimestral
- Muestra la evolución del valor real a lo largo del tiempo
- Línea azul: Valor real
- Línea roja: Valor nominal (sin inflación)
- Línea verde: Valor con interés (si aplica)

#### 3.1.5 Solución de Problemas

**Problema: No aparecen las entidades financieras**
- **Solución:** Asegúrate de haber seleccionado primero el tipo de cuenta
- **Solución:** Recarga la página si el problema persiste

**Problema: El cálculo no funciona**
- **Solución:** Verifica que todos los campos requeridos estén completos
- **Solución:** Verifica que los valores estén dentro de los rangos permitidos
- **Solución:** Revisa la consola del navegador (F12) para ver errores

**Problema: La página se ve mal en mi dispositivo**
- **Solución:** Actualiza tu navegador a la última versión
- **Solución:** Limpia la caché del navegador
- **Solución:** Prueba en otro navegador

### 3.2 Memoria Técnica del Proyecto

#### 3.2.1 Objetivo del Proyecto

**Objetivo Principal:**
Desarrollar una aplicación web funcional que calcule el efecto de la inflación sobre el ahorro personal, integrando información de tasas de interés de la SBS para proporcionar análisis más precisos y útiles para la toma de decisiones financieras.

**Objetivos Específicos:**
1. Crear una interfaz web intuitiva y responsiva
2. Implementar cálculos financieros precisos
3. Integrar datos de tasas SBS para análisis realista
4. Almacenar historial de consultas para análisis
5. Cumplir con el alcance técnico del curso

#### 3.2.2 Herramientas Utilizadas

**Desarrollo:**
- **Node.js 20 LTS:** Runtime de JavaScript
- **Express.js 4.18.2:** Framework web
- **MongoDB + Mongoose:** Base de datos NoSQL
- **Zod 3.22.4:** Validación de esquemas
- **Vitest 1.0.4:** Framework de testing

**Frontend:**
- **HTML5:** Estructura semántica
- **CSS3:** Estilos con variables y diseño adaptativo
- **JavaScript ES2022:** Lógica de la aplicación
- **Tailwind CSS (CDN):** Utilidades de diseño responsivo
- **Canvas API:** Renderizado de gráficos

**Seguridad:**
- **Helmet 7.1.0:** Protección de headers HTTP
- **CORS 2.8.5:** Control de acceso cross-origin
- **express-rate-limit 7.1.5:** Prevención de ataques DDoS

**Herramientas de Desarrollo:**
- **ESLint 8.55.0:** Linting de código
- **Prettier 3.1.0:** Formateo de código
- **Nodemon 3.0.2:** Desarrollo con recarga automática
- **Supertest 6.3.3:** Testing de APIs

**Despliegue:**
- **Render:** Plataforma de hosting
- **MongoDB Atlas:** Base de datos en la nube

#### 3.2.3 Dificultades Encontradas y Soluciones

**Dificultad 1: Migración de PostgreSQL a MongoDB**

**Problema:**
- El proyecto inicial usaba PostgreSQL, pero el alcance del curso requería MongoDB, MySQL o Firebase
- Necesidad de migrar toda la lógica de acceso a datos

**Solución:**
- Implementación de Mongoose ODM para facilitar la migración
- Creación de modelo Mongoose equivalente al schema SQL
- Actualización del repositorio para usar métodos de Mongoose
- Mantenimiento de la misma interfaz del repositorio para minimizar cambios

**Resultado:**
- Migración exitosa sin romper la funcionalidad existente
- Mejor rendimiento con índices optimizados
- Código más mantenible

**Dificultad 2: Integración de Tasas SBS**

**Problema:**
- La SBS no proporciona API pública para obtener tasas en tiempo real
- Necesidad de integrar datos de tasas de manera estructurada

**Solución:**
- Creación de archivo de datos estático con estructura de tasas
- Implementación de endpoints para consultar tasas
- Sistema de selección dinámica de entidades según tipo de cuenta
- Diseño extensible para futura integración con API real

**Resultado:**
- Funcionalidad completa de selección de cuenta y banco
- Visualización de TREA en tiempo real
- Cálculos precisos considerando interés

**Dificultad 3: Problemas de Carga en Producción (Render)**

**Problema:**
- El selector de entidades financieras no se actualizaba en producción
- Diferencia de comportamiento entre desarrollo y producción

**Solución:**
- Implementación de sistema de caché de instituciones
- Mejora del manejo asíncrono de carga de datos
- Agregado de logging para debugging
- Verificación de inicialización del DOM
- Mejora de manejo de errores con mensajes informativos

**Resultado:**
- Funcionalidad estable en producción
- Mejor experiencia de usuario con feedback visual
- Código más robusto y mantenible

**Dificultad 4: Diseño Responsivo Complejo**

**Problema:**
- Necesidad de diseño que funcione en múltiples dispositivos
- Mantener diseño bancario profesional en todos los tamaños

**Solución:**
- Implementación de diseño mobile-first
- Uso de CSS Grid y Flexbox para layouts flexibles
- Media queries en 3 breakpoints principales
- Testing en diferentes dispositivos y navegadores

**Resultado:**
- Diseño completamente responsivo
- Experiencia consistente en todos los dispositivos
- Código CSS mantenible y escalable

**Dificultad 5: Cálculos Financieros con Interés**

**Problema:**
- Necesidad de combinar efectos de inflación e interés
- Fórmulas financieras complejas

**Solución:**
- Investigación de fórmulas financieras correctas
- Implementación de funciones puras y testeables
- Validación de resultados con casos de prueba
- Documentación de fórmulas utilizadas

**Resultado:**
- Cálculos precisos y verificados
- Código claro y documentado
- Fácil mantenimiento y extensión

#### 3.2.4 Soluciones Implementadas

**Arquitectura en Capas:**
- Separación clara de responsabilidades
- Código modular y reutilizable
- Fácil testing y mantenimiento

**Validación Robusta:**
- Validación en frontend y backend
- Mensajes de error descriptivos
- Prevención de datos inválidos

**Seguridad:**
- Headers HTTP seguros (Helmet)
- Rate limiting para prevenir abusos
- Validación de entrada en todos los endpoints
- Sanitización de datos

**Rendimiento:**
- Índices en base de datos
- Caché de datos estáticos
- Compresión de respuestas
- Pool de conexiones MongoDB

**Experiencia de Usuario:**
- Feedback visual inmediato
- Validación en tiempo real
- Estados de carga claros
- Mensajes de error útiles

#### 3.2.5 Conclusiones

**Logros del Proyecto:**

1. ✅ **Aplicación Funcional Completa**
   - Frontend responsivo y profesional
   - Backend robusto con API REST
   - Base de datos MongoDB funcionando
   - Integración de tasas SBS

2. ✅ **Cumplimiento del Alcance Técnico**
   - Front-end: HTML, CSS, JavaScript, Tailwind CSS
   - Back-end: Node.js + Express
   - Base de datos: MongoDB
   - Diseño responsivo: Tailwind CSS + Media Queries
   - Diseño UX/UI: Guía completa en DESIGN_FIGMA.md
   - Despliegue: Render

3. ✅ **Buenas Prácticas Implementadas**
   - Arquitectura en capas
   - Testing unitario
   - Validación de datos
   - Seguridad
   - Documentación completa

4. ✅ **Funcionalidades Adicionales**
   - Integración con tasas SBS
   - Cálculo con interés (TREA)
   - Historial de consultas
   - Estadísticas de uso
   - Gráficos de evolución

**Aprendizajes:**

1. **Trabajo en Equipo:**
   - Importancia de la comunicación constante
   - Valor de la retroalimentación
   - Necesidad de documentación clara

2. **Desarrollo Web:**
   - Complejidad de aplicaciones full-stack
   - Importancia del diseño responsivo
   - Necesidad de testing exhaustivo

3. **Tecnologías:**
   - Flexibilidad de MongoDB vs SQL
   - Potencia de Express.js
   - Importancia de la seguridad

**Mejoras Futuras:**

1. **Integración Real con SBS:**
   - Scraping o API oficial de la SBS
   - Actualización automática de tasas
   - Notificaciones de cambios

2. **Funcionalidades Adicionales:**
   - Comparación entre múltiples cuentas
   - Exportación de resultados (PDF, Excel)
   - Historial personalizado por usuario
   - Dashboard de estadísticas avanzadas

3. **Optimizaciones:**
   - Implementar Service Workers para offline
   - Mejorar caché de datos
   - Optimizar imágenes y assets
   - Implementar lazy loading

4. **Migración a Framework:**
   - Considerar migración a React o Angular
   - Mejorar estructura del frontend
   - Facilitar mantenimiento

---

## 4. Pitch Grupal

### 4.1 Presentación del Proyecto

**Calculadora de Inflación Inteligente**

Una solución web innovadora que combina análisis financiero preciso con datos reales de la Superintendencia de Banca, Seguros y AFP (SBS) del Perú, permitiendo a los usuarios tomar decisiones informadas sobre sus ahorros.

### 4.2 Problema que Resuelve

**Situación Actual:**
- Las personas ahorran sin considerar el efecto de la inflación
- No conocen el impacto real de la inflación en su poder adquisitivo
- No comparan tasas de interés entre diferentes entidades financieras
- Toman decisiones financieras sin información precisa

**Nuestra Solución:**
- Calcula el impacto real de la inflación en los ahorros
- Integra tasas de interés reales de la SBS
- Muestra visualizaciones claras de la evolución temporal
- Proporciona análisis detallados para toma de decisiones

### 4.3 Características Principales

1. **Cálculo Preciso de Inflación**
   - Fórmulas financieras validadas
   - Soporte para años fraccionales
   - Análisis anual y trimestral

2. **Integración con SBS**
   - Selección de tipo de cuenta
   - Comparación de entidades financieras
   - Visualización de TREA en tiempo real
   - Cálculo neto considerando interés e inflación

3. **Interfaz Profesional**
   - Diseño bancario corporativo
   - Totalmente responsivo
   - Gráficos interactivos
   - Feedback visual inmediato

4. **Historial y Estadísticas**
   - Almacenamiento de consultas
   - Análisis de tendencias
   - Estadísticas agregadas

### 4.4 Tecnologías y Arquitectura

**Stack Tecnológico:**
- **Frontend:** HTML5, CSS3, JavaScript ES2022, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Base de Datos:** MongoDB con Mongoose
- **Validación:** Zod
- **Testing:** Vitest
- **Seguridad:** Helmet, CORS, Rate Limiting

**Arquitectura:**
- Cliente-Servidor
- API REST
- Arquitectura en capas
- Separación de responsabilidades

### 4.5 Valor Agregado

**Para Usuarios:**
- Herramienta gratuita y accesible
- Información precisa y actualizada
- Visualizaciones claras
- Toma de decisiones informadas

**Para el Curso:**
- Demuestra dominio de tecnologías web
- Aplicación funcional y desplegada
- Código bien estructurado y documentado
- Cumplimiento completo del alcance técnico

### 4.6 Demostración

**Flujo de Uso:**
1. Usuario selecciona tipo de cuenta y banco
2. Ve la TREA ofrecida
3. Ingresa monto, inflación y tiempo
4. Obtiene análisis completo con gráficos
5. Puede comparar diferentes escenarios

**Resultados:**
- Valor real final del ahorro
- Pérdida neta considerando interés
- Evolución temporal visual
- Recomendaciones basadas en datos

### 4.7 Conclusión del Pitch

Esta aplicación demuestra nuestra capacidad para:
- Desarrollar aplicaciones web completas
- Integrar múltiples tecnologías
- Crear interfaces profesionales
- Resolver problemas reales con tecnología

**Equipo comprometido con la excelencia técnica y la experiencia de usuario.**

---

## 📎 Anexos

### A. Estructura Completa del Proyecto

```
ModuloProyeccion/
├── database/
│   ├── README.md          # Documentación MongoDB
│   └── schema.sql         # Schema PostgreSQL (legacy)
├── public/
│   ├── index.html         # Interfaz principal
│   ├── styles.css         # Estilos CSS
│   ├── app.js             # Lógica frontend
│   └── static/
│       └── img/
│           └── screenshot.png
├── src/
│   ├── api/
│   │   ├── routes.js              # Rutas API
│   │   ├── effect.controller.js   # Controladores
│   │   └── effect.api.test.js     # Tests API
│   ├── core/
│   │   ├── calculator.js          # Lógica de cálculo
│   │   └── calculator.test.js     # Tests cálculo
│   ├── data/
│   │   └── sbs-rates.js           # Datos tasas SBS
│   ├── domain/
│   │   ├── validation.js          # Validación Zod
│   │   └── validation.test.js     # Tests validación
│   ├── persistence/
│   │   ├── db.mongodb.js          # Conexión MongoDB
│   │   ├── db.js                  # PostgreSQL (legacy)
│   │   ├── models/
│   │   │   └── InflationQuery.js  # Modelo Mongoose
│   │   └── queries.repository.js # Repositorio
│   └── server.js                  # Servidor Express
├── package.json                    # Dependencias
├── vitest.config.js               # Config Vitest
├── README.md                       # Documentación principal
├── DESIGN_FIGMA.md                # Guía diseño UX/UI
├── MIGRACION_MONGODB.md           # Guía migración
└── INFORME_TECNICO.md             # Este documento
```

### B. Endpoints de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/info` | Información de la API |
| GET | `/api/v1/sbs/rates` | Obtener tasas SBS |
| POST | `/api/v1/inflation/effect` | Calcular efecto de inflación |
| GET | `/api/v1/inflation/history` | Historial de consultas |
| GET | `/api/v1/inflation/statistics` | Estadísticas agregadas |

### C. Fórmulas Financieras Utilizadas

**Factor de Descuento:**
```
D = (1 + π)^t
```
Donde:
- π = tasa de inflación anual (decimal)
- t = número de años

**Valor Real Final:**
```
A_real = A0 / D
```
Donde:
- A0 = monto nominal inicial
- D = factor de descuento

**Valor Futuro con Interés:**
```
A_futuro = A0 * (1 + TREA)^t
```

**Valor Real con Interés:**
```
A_real_con_interes = A_futuro / D
```

**Pérdida Neta:**
```
L_neta = A0 - A_real_con_interes
```

**Tasa Neta:**
```
T_neta = inflación - TREA
```

### D. Referencias

- [Documentación Express.js](https://expressjs.com/)
- [Documentación Mongoose](https://mongoosejs.com/)
- [Documentación Zod](https://zod.dev/)
- [SBS Perú - Tasas de Interés](https://www.sbs.gob.pe/app/retasas/paginas/retasasInicio.aspx?p=D)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Render Documentation](https://render.com/docs)

---

**Fin del Informe Técnico**

*Documento generado: Diciembre 2024*  
*Versión: 1.0*

