# 📋 Plan de Mejoras - Alcance Técnico del Curso

## 🎯 Objetivo
Adaptar el proyecto actual para cumplir completamente con el alcance técnico del curso **DESARROLLO DE APLICACIONES WEB Y MÓVILES**.

## 📊 Estado Actual vs Requerimientos

### ✅ Cumplidos
- **Back-end**: Node.js + Express ✓
- **Front-end**: HTML, CSS, JavaScript ✓
- **Diseño responsivo**: Media Queries ✓ (ahora también con Tailwind CSS)

### ⚠️ Pendientes de Mejora

#### 1. Front-end Framework (Opcional pero Recomendado)
**Estado actual**: JavaScript vanilla (HTML, CSS, JS puro)  
**Requerimiento**: HTML, CSS, JavaScript, **React o Angular**

**Opciones**:
- **Opción A**: Mantener JavaScript vanilla (ya cumple el requisito básico)
- **Opción B**: Migrar a React (recomendado para proyectos modernos)
- **Opción C**: Migrar a Angular (más estructurado, mejor para equipos grandes)

**Recomendación**: Opción A (ya cumple) o Opción B (React) para mejor experiencia de desarrollo.

#### 2. Base de Datos
**Estado actual**: PostgreSQL  
**Requerimiento**: MongoDB, Firebase o MySQL

**Opciones**:
- **Opción A**: Migrar a **MongoDB** (NoSQL, más flexible, popular en proyectos académicos)
- **Opción B**: Migrar a **MySQL** (SQL, similar a PostgreSQL, migración más sencilla)
- **Opción C**: Migrar a **Firebase** (Backend as a Service, más rápido de implementar)

**Recomendación**: Opción A (MongoDB) - más moderno y popular en cursos de desarrollo web.

#### 3. Diseño Responsivo
**Estado actual**: Media Queries personalizadas + **Tailwind CSS** (recién agregado) ✓  
**Requerimiento**: Bootstrap, Tailwind CSS o Media Queries

**Estado**: ✅ **CUMPLIDO** - Ahora usa Tailwind CSS + Media Queries

#### 4. Diseño UX/UI
**Estado actual**: Diseño personalizado con CSS  
**Requerimiento**: Figma, Penpot, Canva

**Recomendación**: Crear mockups en Figma/Penpot antes de implementar mejoras visuales.

#### 5. Despliegue
**Estado actual**: No configurado  
**Requerimiento**: CodeSandbox, Replit, Vercel, Netlify, Firebase Hosting

**Recomendación**: 
- **Vercel** o **Netlify** para despliegue fácil y gratuito
- **Firebase Hosting** si se migra a Firebase como base de datos

## 🚀 Plan de Implementación Recomendado

### Fase 1: Mejoras Inmediatas (Ya completadas)
- [x] Agregar Tailwind CSS para diseño responsivo
- [x] Mejorar footer con información del curso
- [x] Agregar badge del curso en el header

### Fase 2: Migración de Base de Datos (Prioridad Alta)
**Objetivo**: Cambiar de PostgreSQL a MongoDB

**Pasos**:
1. Instalar `mongodb` o `mongoose` como dependencia
2. Crear nuevo módulo `src/persistence/mongodb.js`
3. Migrar esquema de PostgreSQL a MongoDB (colecciones)
4. Actualizar `queries.repository.js` para usar MongoDB
5. Actualizar `database/schema.sql` a `database/schema.js` (MongoDB no usa SQL)
6. Actualizar documentación

**Tiempo estimado**: 4-6 horas

### Fase 3: Mejora del Frontend (Opcional pero Recomendado)
**Objetivo**: Migrar a React para mejor experiencia de desarrollo

**Pasos**:
1. Configurar Vite o Create React App
2. Migrar componentes HTML a componentes React
3. Migrar lógica de `app.js` a componentes React
4. Configurar build para producción
5. Actualizar estructura del proyecto

**Tiempo estimado**: 8-12 horas

### Fase 4: Diseño UX/UI (Recomendado)
**Objetivo**: Crear mockups profesionales

**Pasos**:
1. Crear cuenta en Figma (gratis)
2. Diseñar wireframes de la aplicación
3. Crear mockups de alta fidelidad
4. Implementar mejoras basadas en los mockups

**Tiempo estimado**: 6-8 horas

### Fase 5: Despliegue (Prioridad Media)
**Objetivo**: Desplegar aplicación en Vercel/Netlify

**Pasos**:
1. Crear cuenta en Vercel o Netlify
2. Conectar repositorio Git
3. Configurar variables de entorno
4. Configurar base de datos en la nube (MongoDB Atlas)
5. Desplegar y probar

**Tiempo estimado**: 2-3 horas

## 📦 Dependencias a Agregar

### Para MongoDB
```bash
npm install mongodb
# o
npm install mongoose
```

### Para React (si se decide migrar)
```bash
npm install react react-dom
npm install -D @vitejs/plugin-react vite
```

### Para Tailwind CSS (producción)
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## 📝 Cambios en package.json

### Dependencias a agregar (MongoDB)
```json
{
  "dependencies": {
    "mongodb": "^6.0.0",
    // ... otras dependencias
  }
}
```

### Dependencias a remover (PostgreSQL)
```json
{
  "dependencies": {
    // "pg": "^8.16.3", // Remover si se migra a MongoDB
  }
}
```

## 🔄 Migración de Base de Datos: PostgreSQL → MongoDB

### Estructura Actual (PostgreSQL)
```sql
CREATE TABLE inflation_queries (
    id SERIAL PRIMARY KEY,
    amount_nominal NUMERIC(15, 2),
    inflation_rate NUMERIC(5, 2),
    years NUMERIC(5, 2),
    granularity VARCHAR(20),
    real_value NUMERIC(15, 2),
    absolute_loss NUMERIC(15, 2),
    loss_percent NUMERIC(5, 2),
    series JSONB,
    created_at TIMESTAMP,
    client_ip VARCHAR(45),
    user_agent TEXT
);
```

### Estructura Nueva (MongoDB)
```javascript
{
  _id: ObjectId,
  amount_nominal: Number,
  inflation_rate: Number,
  years: Number,
  granularity: String,
  real_value: Number,
  absolute_loss: Number,
  loss_percent: Number,
  series: Array,
  created_at: Date,
  client_ip: String,
  user_agent: String
}
```

## 📚 Documentación a Actualizar

1. **README.md**: Actualizar tecnologías utilizadas
2. **database/README.md**: Cambiar de PostgreSQL a MongoDB
3. **package.json**: Actualizar descripción y keywords
4. Crear **DEPLOYMENT.md**: Guía de despliegue en Vercel/Netlify

## ✅ Checklist de Cumplimiento

### Requisitos Mínimos
- [x] Front-end: HTML, CSS, JavaScript ✓
- [ ] Front-end: React o Angular (opcional, pero recomendado)
- [x] Back-end: Node.js + Express ✓
- [ ] Base de datos: MongoDB, Firebase o MySQL (pendiente)
- [x] Diseño responsivo: Tailwind CSS ✓
- [ ] Diseño UX/UI: Figma, Penpot, Canva (pendiente)
- [ ] Despliegue: Vercel, Netlify, etc. (pendiente)

### Requisitos Adicionales (Buenas Prácticas)
- [x] Testing con Vitest ✓
- [x] Validación con Zod ✓
- [x] Seguridad con Helmet ✓
- [x] Rate Limiting ✓
- [ ] CI/CD (opcional)
- [ ] Documentación de API (Swagger/OpenAPI) (opcional)

## 🎓 Notas para el Curso

Este proyecto demuestra:
- ✅ Arquitectura cliente-servidor
- ✅ API REST con Express
- ✅ Validación de datos
- ✅ Manejo de errores
- ✅ Testing unitario
- ✅ Diseño responsivo
- ✅ Buenas prácticas de código

**Próximos pasos recomendados**:
1. Migrar a MongoDB (cumplir requisito de BD)
2. Crear mockups en Figma (cumplir requisito de diseño)
3. Desplegar en Vercel/Netlify (cumplir requisito de despliegue)
4. Opcional: Migrar a React (mejorar experiencia de desarrollo)

