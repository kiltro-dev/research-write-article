# Diseño — Deploy con GitHub Actions

## Idea general
Usar GitHub Actions como capa de automatización para orquestar el despliegue del proyecto en dos servicios distintos:
- Render para el backend
- Vercel para el frontend

La idea es mantener el repositorio como fuente de verdad y dejar que cada plataforma despliegue solo la parte que corresponde.

## Arquitectura propuesta

### 1. Frontend en Vercel
- El frontend vive en la carpeta frontend/.
- Se construye con npm run build.
- Se despliega en Vercel con la variable VITE_API_URL apuntando al backend.
- El pipeline puede detectar cambios dentro de frontend/ y disparar solo ese deploy.

### 2. Backend en Render
- El backend vive en la carpeta backend/.
- Se despliega con Python y dependencias definidas en requirements.txt.
- Usa variables de entorno sensibles como GROQ_API_KEY, GEMINI_API_KEY, PROVIDER_PRIORITY, etc.
- El pipeline puede detectar cambios dentro de backend/ y disparar solo ese deploy.

### 3. GitHub Actions
El workflow debe:
- detectar qué carpetas cambiaron en el push,
- decidir si correr build y deploy de frontend, backend o ambos,
- usar secrets de GitHub para variables sensibles,
- y permitir revisiones claras por job.

## Flujo de trabajo sugerido
1. Push a la rama principal.
2. GitHub Actions evalúa cambios en backend/ y frontend/.
3. Si cambió frontend:
   - instalar dependencias,
   - correr build,
   - disparar deploy en Vercel.
4. Si cambió backend:
   - instalar dependencias,
   - validar importación y configuración,
   - disparar deploy en Render.
5. Si cambiaron ambos:
   - correr ambos jobs en paralelo.

## Recomendación de implementación
- Usar un workflow principal con jobs separados por contexto.
- Usar paths filters para reducir el tiempo de ejecución.
- Mantener la lógica de deploy simple y fácil de leer.

## Ventajas
- Despliegues independientes
- Menos tiempo y menos ruido al cambiar una sola parte
- Mejor control para un proyecto de portafolio
- Fácil de escalar si luego agregas tests o staging

## Consideraciones
- Vercel y Render tienen sus propios secretos y configuraciones.
- El frontend necesitará la URL correcta del backend en producción.
- El backend debe tener un endpoint de health para validar el servicio.
