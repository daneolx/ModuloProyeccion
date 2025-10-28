# Base de Datos PostgreSQL

Este módulo utiliza PostgreSQL para almacenar el historial de consultas de inflación.

## Configuración

### 1. Instalar PostgreSQL

En Windows con chocolatey:
```bash
choco install postgresql
```

O descarga desde: https://www.postgresql.org/download/

### 2. Crear la base de datos

```sql
CREATE DATABASE inflacion_ahorro;
```

### 3. Configurar variables de entorno

Copia `.env.example` a `.env` y configura las credenciales:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inflacion_ahorro
DB_USER=postgres
DB_PASSWORD=tu_contraseña
```

### 4. Ejecutar el esquema

```bash
psql -U postgres -d inflacion_ahorro -f database/schema.sql
```

O usando la interfaz gráfica de pgAdmin.

## Estructura de Tablas

### inflation_queries

Almacena todas las consultas realizadas:

- `id`: Identificador único (auto-incremental)
- `amount_nominal`: Monto nominal inicial
- `inflation_rate`: Tasa de inflación anual
- `years`: Número de años
- `granularity`: Nivel de detalle (none, yearly, quarterly)
- `real_value`: Valor real calculado
- `absolute_loss`: Pérdida absoluta
- `loss_percent`: Porcentaje de pérdida
- `series`: Serie temporal (JSON)
- `created_at`: Fecha y hora de creación
- `client_ip`: IP del cliente
- `user_agent`: User agent del cliente

### query_statistics

Tabla para estadísticas agregadas (opcional).

## API Endpoints

### POST /api/v1/inflation/effect

Calcula el efecto de la inflación y guarda la consulta en la base de datos.

### GET /api/v1/inflation/history

Obtiene el historial de consultas con paginación:

```
GET /api/v1/inflation/history?limit=50&offset=0
```

### GET /api/v1/inflation/statistics

Obtiene estadísticas agregadas de todas las consultas.

## Mantenimiento

### Limpiar consultas antiguas

```sql
DELETE FROM inflation_queries 
WHERE created_at < NOW() - INTERVAL '90 days';
```

### Backup

```bash
pg_dump -U postgres -d inflacion_ahorro > backup.sql
```

### Restaurar backup

```bash
psql -U postgres -d inflacion_ahorro < backup.sql
```

