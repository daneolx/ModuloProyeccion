# 🔄 Guía de Migración: PostgreSQL → MongoDB

## ✅ Migración Completada

El proyecto ha sido migrado exitosamente de PostgreSQL a MongoDB para cumplir con el alcance técnico del curso.

## 📦 Cambios Realizados

### 1. Dependencias
- ❌ Removido: `pg` (PostgreSQL)
- ✅ Agregado: `mongoose` (MongoDB ODM)

### 2. Archivos Nuevos Creados
- `src/persistence/db.mongodb.js` - Módulo de conexión MongoDB
- `src/persistence/models/InflationQuery.js` - Modelo Mongoose
- `database/README.md` - Documentación actualizada para MongoDB
- `DESIGN_FIGMA.md` - Guía completa de diseño UX/UI
- `MIGRACION_MONGODB.md` - Este archivo

### 3. Archivos Modificados
- `package.json` - Actualizado dependencias
- `src/persistence/queries.repository.js` - Migrado a MongoDB
- `src/server.js` - Actualizado para usar MongoDB
- `README.md` - Documentación actualizada

### 4. Archivos Obsoletos (Mantener por referencia)
- `src/persistence/db.js` - PostgreSQL (ya no se usa)
- `database/schema.sql` - SQL schema (ya no se usa)

## 🚀 Instalación y Configuración

### Paso 1: Instalar dependencias
```bash
npm install
```

### Paso 2: Configurar MongoDB

#### Opción A: MongoDB Local
1. Instalar MongoDB localmente
2. Iniciar MongoDB:
   ```bash
   mongod
   ```
3. Configurar `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/inflacion_ahorro
   ```

#### Opción B: MongoDB Atlas (Recomendado)
1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear cluster gratuito (M0)
3. Crear usuario de base de datos
4. Configurar IP Whitelist (0.0.0.0/0 para desarrollo)
5. Obtener cadena de conexión
6. Configurar `.env`:
   ```env
   MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/inflacion_ahorro?retryWrites=true&w=majority
   ```

### Paso 3: Ejecutar la aplicación
```bash
npm run dev
```

La aplicación se conectará automáticamente a MongoDB al iniciar.

## 📊 Estructura de Datos

### PostgreSQL (Anterior)
```sql
CREATE TABLE inflation_queries (
    id SERIAL PRIMARY KEY,
    amount_nominal NUMERIC(15, 2),
    ...
    created_at TIMESTAMP
);
```

### MongoDB (Actual)
```javascript
{
  _id: ObjectId("..."),
  amount_nominal: Number,
  ...
  createdAt: Date,
  updatedAt: Date
}
```

## 🔄 Diferencias Clave

### IDs
- **PostgreSQL**: `id` (número entero)
- **MongoDB**: `_id` (ObjectId, convertido a `id` en JSON)

### Fechas
- **PostgreSQL**: `created_at` (TIMESTAMP)
- **MongoDB**: `createdAt` y `updatedAt` (automáticos con timestamps)

### Consultas
- **PostgreSQL**: SQL queries
- **MongoDB**: Mongoose queries y agregaciones

## ✅ Verificación

Para verificar que la migración funcionó correctamente:

1. **Iniciar la aplicación**:
   ```bash
   npm run dev
   ```

2. **Verificar conexión**:
   Deberías ver en la consola:
   ```
   ✅ Conectado a la base de datos MongoDB
   📊 MongoDB conectado: inflacion_ahorro
   ✅ Conexión a MongoDB exitosa
   ```

3. **Probar la API**:
   ```bash
   curl -X POST http://localhost:3000/api/v1/inflation/effect \
     -H "Content-Type: application/json" \
     -d '{
       "amount_nominal": 10000,
       "inflation_rate": 6.5,
       "years": 3,
       "granularity": "yearly"
     }'
   ```

4. **Verificar en MongoDB**:
   ```bash
   mongosh mongodb://localhost:27017/inflacion_ahorro
   db.inflation_queries.find().pretty()
   ```

## 🐛 Troubleshooting

### Error: "MongooseServerSelectionError"
- Verifica que MongoDB esté corriendo
- Verifica la cadena de conexión en `.env`
- Verifica firewall/red

### Error: "bad auth"
- Verifica usuario y contraseña en MONGODB_URI
- En Atlas, verifica permisos del usuario

### Error: "connect ECONNREFUSED"
- Verifica que MongoDB esté en el puerto correcto (27017)
- Verifica que el servicio esté corriendo

## 📚 Recursos

- [Documentación Mongoose](https://mongoosejs.com/docs/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [MongoDB Compass](https://www.mongodb.com/products/compass)

## 🎯 Próximos Pasos

1. ✅ Migración a MongoDB completada
2. ✅ Guía de diseño Figma creada
3. 📋 Crear mockups en Figma siguiendo `DESIGN_FIGMA.md`
4. 📋 Implementar mejoras visuales basadas en los mockups

