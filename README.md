# MaríaE MVP — Cómo iniciar la aplicación ✅

Esta guía explica las distintas formas de iniciar la aplicación teniendo en cuenta los scripts definidos en `package.json`.

## Resumen
- `server.js` (ubicado en `MariaE_API/routes/server.js`) es el punto de entrada del servidor Express. Usa `dotenv` para cargar variables de entorno (por ejemplo `SERVER_PORT`).

## Comandos recomendados (desde la raíz del proyecto)

### Producción / ejecución simple
- `npm start`  
  Ejecuta: `node MariaE_API/routes/server.js`.

### Desarrollo (reinicio automático)
- `npm run dev`  
  Ejecuta: `nodemon MariaE_API/routes/server.js` — reinicia automáticamente cuando detecta cambios en el código.

> Alternativa sin usar `npm` scripts:
> - `npx nodemon MariaE_API/routes/server.js`  
> - o `nodemon MariaE_API/routes/server.js` si tienes `nodemon` instalado globalmente.

## Ejecutar desde la carpeta `MariaE_API/routes` (donde está `server.js`)
- `node server.js`  
- `npx nodemon server.js` (desarrollo)

## Nota sobre `npm test`
- El script `test` ha sido **modificado** a un placeholder seguro:  
  `"test": "echo \"No tests\" && exit 0"`  
  Esto evita fallos en procesos CI si no hay pruebas definidas. `npm test` imprimirá "No tests" y saldrá con código 0.

## Variables de entorno (archivo `.env` en la raíz)
Asegúrate de tener un `.env` con al menos las siguientes variables:

```
SERVER_PORT=10000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=mariae_fashiongirls
DB_PORT=3306
```

## Salida esperada
Cuando la app arranca correctamente verás en consola algo similar a:
```
Servidor ejecutándose en http://localhost:10000
```

---

Si quieres, puedo añadir instrucciones para ejecutar con `cross-env` o un `dev` script específico para Windows. ¿Deseas que lo incluya? 🔧