# Base de Datos MongoDB

Este módulo utiliza **MongoDB** con **Mongoose** para almacenar el historial de consultas de inflación.

## 🚀 Configuración

### 1. Instalar MongoDB

#### Opción A: MongoDB Local
**Windows con chocolatey:**
```bash
choco install mongodb
```

**macOS con Homebrew:**
```bash
brew tap mongodb/brew
brew install mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

#### Opción B: MongoDB Atlas (Recomendado para producción)
1. Crear cuenta gratuita en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear un cluster gratuito (M0)
3. Obtener la cadena de conexión

### 2. Configurar variables de entorno

Copia `.env.example` a `.env` y configura:

#### Para MongoDB Local:
```env
MONGODB_URI=mongodb://localhost:27017/inflacion_ahorro
# O usando variables individuales:
DB_HOST=localhost
DB_PORT=27017
DB_NAME=inflacion_ahorro
```

#### Para MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/inflacion_ahorro?retryWrites=true&w=majority
```

### 3. Iniciar MongoDB

#### Local:
```bash
# Windows
mongod

# macOS/Linux
brew services start mongodb-community
# o
sudo systemctl start mongod
```

#### Atlas:
No requiere instalación local, solo la cadena de conexión.

### 4. Verificar conexión

El servidor probará automáticamente la conexión al iniciar. Verás en la consola:
```
✅ Conectado a la base de datos MongoDB
📊 MongoDB conectado: inflacion_ahorro
✅ Conexión a MongoDB exitosa
```

## 📊 Estructura de la Base de Datos

### Colección: `inflation_queries`

Documento de ejemplo:
```javascript
{
  "_id": ObjectId("..."),
  "amount_nominal": 10000.00,
  "inflation_rate": 6.5,
  "years": 3,
  "granularity": "yearly",
  "real_value": 8256.11,
  "absolute_loss": 1743.89,
  "loss_percent": 17.44,
  "series": [
    {
      "t": 1,
      "years": 1,
      "real_value": 9389.61,
      "loss_percent": 6.10
    },
    {
      "t": 2,
      "years": 2,
      "real_value": 8817.57,
      "loss_percent": 11.82
    },
    {
      "t": 3,
      "years": 3,
      "real_value": 8256.11,
      "loss_percent": 17.44
    }
  ],
  "client_ip": "127.0.0.1",
  "user_agent": "Mozilla/5.0...",
  "createdAt": ISODate("2025-01-XX..."),
  "updatedAt": ISODate("2025-01-XX...")
}
```

### Índices

La aplicación crea automáticamente los siguientes índices:
- `createdAt: -1` - Para ordenar por fecha descendente
- `amount_nominal: 1` - Para búsquedas por monto
- `inflation_rate: 1` - Para búsquedas por tasa
- `createdAt: 1, amount_nominal: 1` - Índice compuesto

## 🔧 Operaciones Disponibles

### Guardar consulta
```javascript
await saveInflationQuery({
  amount_nominal: 10000,
  inflation_rate: 6.5,
  years: 3,
  granularity: 'yearly',
  real_value: 8256.11,
  absolute_loss: 1743.89,
  loss_percent: 17.44,
  series: [...],
  client_ip: '127.0.0.1',
  user_agent: 'Mozilla/5.0...'
});
```

### Obtener consultas con paginación
```javascript
const result = await getAllInflationQueries({
  limit: 50,
  offset: 0
});
// Retorna: { data: [...], total: 100, limit: 50, offset: 0 }
```

### Obtener estadísticas
```javascript
const stats = await getQueryStatistics();
// Retorna: { total_queries, avg_amount_nominal, avg_inflation_rate, ... }
```

## 🛠️ Herramientas de Administración

### MongoDB Compass (GUI Recomendado)
Descarga desde: https://www.mongodb.com/products/compass

### MongoDB Shell (mongosh)
```bash
# Conectar a base de datos local
mongosh mongodb://localhost:27017/inflacion_ahorro

# Conectar a MongoDB Atlas
mongosh "mongodb+srv://cluster.mongodb.net/inflacion_ahorro"
```

### Comandos útiles en mongosh

```javascript
// Ver todas las colecciones
show collections

// Ver documentos de inflation_queries
db.inflation_queries.find().pretty()

// Contar documentos
db.inflation_queries.countDocuments()

// Buscar por monto
db.inflation_queries.find({ amount_nominal: { $gte: 10000 } })

// Eliminar documentos antiguos (más de 90 días)
db.inflation_queries.deleteMany({
  createdAt: { $lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
})
```

## 📦 Migración desde PostgreSQL

Si tenías datos en PostgreSQL, puedes migrarlos usando un script:

```javascript
// scripts/migrate-postgres-to-mongo.js
import pg from 'pg';
import mongoose from 'mongoose';
import InflationQuery from '../src/persistence/models/InflationQuery.js';

// Conectar a ambas bases de datos
const pgPool = new pg.Pool({ /* config PostgreSQL */ });
await mongoose.connect(process.env.MONGODB_URI);

// Migrar datos
const result = await pgPool.query('SELECT * FROM inflation_queries');
for (const row of result.rows) {
  await InflationQuery.create({
    amount_nominal: row.amount_nominal,
    inflation_rate: row.inflation_rate,
    years: row.years,
    granularity: row.granularity,
    real_value: row.real_value,
    absolute_loss: row.absolute_loss,
    loss_percent: row.loss_percent,
    series: row.series,
    client_ip: row.client_ip,
    user_agent: row.user_agent,
    createdAt: row.created_at,
  });
}
```

## 🔒 Seguridad

### MongoDB Atlas
- Usa autenticación con usuario y contraseña
- Configura IP Whitelist
- Habilita SSL/TLS

### MongoDB Local
- Configura autenticación en `mongod.conf`
- Limita acceso a localhost en producción
- Usa firewall

## 📈 Rendimiento

### Optimizaciones implementadas
- Pool de conexiones (máximo 10 conexiones)
- Índices en campos frecuentemente consultados
- Timeout de conexión configurado
- Queries optimizadas con `lean()` cuando no se necesita Mongoose

### Monitoreo
```javascript
// Ver estadísticas de conexión
mongoose.connection.db.stats()

// Ver índices
db.inflation_queries.getIndexes()
```

## 🐛 Troubleshooting

### Error: "MongoServerError: bad auth"
- Verifica usuario y contraseña en MONGODB_URI
- En Atlas, verifica que el usuario tenga permisos

### Error: "MongooseServerSelectionError: connect ECONNREFUSED"
- Verifica que MongoDB esté corriendo
- Verifica host y puerto en MONGODB_URI

### Error: "MongoNetworkError: failed to connect"
- Verifica firewall
- En Atlas, verifica IP Whitelist

## 📚 Recursos

- [Documentación MongoDB](https://docs.mongodb.com/)
- [Documentación Mongoose](https://mongoosejs.com/docs/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [MongoDB Compass](https://www.mongodb.com/products/compass)
