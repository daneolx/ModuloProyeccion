# 🚀 Guía para Iniciar la Aplicación Localmente

## ✅ Pasos Completados

1. ✅ Dependencias instaladas
2. ✅ Archivo `.env` creado con configuración de MongoDB
3. ✅ Servidor iniciado en modo desarrollo

## 📋 Configuración Actual

### Archivo `.env` creado:
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/inflacion_ahorro
```

### MongoDB
- **Estado**: MongoDB parece estar corriendo en el puerto 27017
- **Base de datos**: `inflacion_ahorro`

## 🌐 Acceso a la Aplicación

Abre tu navegador y accede a:
```
http://localhost:3000
```

## 🔍 Verificar que el Servidor Está Corriendo

### Opción 1: Verificar en el navegador
1. Abre http://localhost:3000
2. Deberías ver la interfaz de la aplicación

### Opción 2: Verificar API
```bash
# Verificar información de la API
curl http://localhost:3000/api/v1/info

# O en PowerShell:
Invoke-WebRequest -Uri http://localhost:3000/api/v1/info
```

## 🛠️ Comandos Útiles

### Iniciar servidor (si no está corriendo)
```bash
npm run dev
```

### Detener servidor
Presiona `Ctrl + C` en la terminal donde está corriendo

### Ver logs del servidor
Los logs aparecen en la terminal donde ejecutaste `npm run dev`

## ⚠️ Solución de Problemas

### Si MongoDB no está corriendo:

#### Opción A: Usar MongoDB Local
1. Instala MongoDB si no lo tienes
2. Inicia MongoDB:
   ```bash
   # Windows (si está en el PATH)
   mongod
   
   # O como servicio
   net start MongoDB
   ```

#### Opción B: Usar MongoDB Atlas (Recomendado)
1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un cluster gratuito (M0)
3. Obtén la cadena de conexión
4. Edita el archivo `.env`:
   ```env
   MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/inflacion_ahorro
   ```
5. Reinicia el servidor

### Si el puerto 3000 está ocupado:
Edita el archivo `.env` y cambia el puerto:
```env
PORT=3001
```

### Si hay errores de conexión a MongoDB:
La aplicación continuará funcionando, pero no guardará las consultas en la base de datos. Verás un mensaje de advertencia en los logs.

## 📝 Pruebas Recomendadas

1. **Probar sin cuenta seleccionada**:
   - Ingresa monto, inflación y tiempo
   - Calcula (debería funcionar sin TREA)

2. **Probar con cuenta seleccionada**:
   - Selecciona tipo de cuenta (ej: Caja de Ahorro)
   - Selecciona entidad financiera (ej: BCP)
   - Verifica que aparezca la TREA
   - Ingresa monto, inflación y tiempo
   - Calcula y verifica que muestre información de la cuenta

3. **Probar API directamente**:
   ```bash
   # Sin TREA
   curl -X POST http://localhost:3000/api/v1/inflation/effect \
     -H "Content-Type: application/json" \
     -d '{"amount_nominal": 10000, "inflation_rate": 6.5, "years": 3, "granularity": "yearly"}'
   
   # Con TREA
   curl -X POST http://localhost:3000/api/v1/inflation/effect \
     -H "Content-Type: application/json" \
     -d '{"amount_nominal": 10000, "inflation_rate": 6.5, "years": 3, "granularity": "yearly", "account_type": "caja_ahorro", "institution": "bcp"}'
   ```

## 🎯 Estado del Servidor

El servidor debería estar corriendo en segundo plano. Para ver los logs:
- Busca la terminal donde ejecutaste `npm run dev`
- O inicia una nueva terminal y ejecuta `npm run dev` para ver los logs

## 📊 Endpoints Disponibles

- `GET /` - Interfaz web principal
- `GET /api/v1/info` - Información de la API
- `POST /api/v1/inflation/effect` - Calcular efecto de inflación
- `GET /api/v1/sbs/rates` - Obtener tasas SBS
- `GET /api/v1/inflation/history` - Historial de consultas
- `GET /api/v1/inflation/statistics` - Estadísticas

## 🚀 Listo para Desplegar

Una vez que hayas probado localmente y todo funcione correctamente, puedes desplegar en Render siguiendo estos pasos:

1. Asegúrate de tener MongoDB Atlas configurado
2. Configura las variables de entorno en Render
3. Despliega el código

¡La aplicación está lista para probar! 🎉

