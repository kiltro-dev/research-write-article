# Tareas — Deploy con GitHub Actions

## Fase 1: Preparación
1. Confirmar que el backend está listo para desplegarse en Render.
2. Confirmar que el frontend está listo para desplegarse en Vercel.
3. Definir las variables de entorno necesarias para cada servicio.

## Fase 2: GitHub Actions
4. Crear un workflow principal en .github/workflows/.
5. Añadir detección de cambios por ruta (frontend/ y backend/).
6. Crear jobs separados para frontend y backend.
7. Configurar secretos en GitHub para claves APIs y variables sensibles.

## Fase 3: Frontend
8. Añadir un paso de build para frontend con npm install y npm run build.
9. Configurar la variable VITE_API_URL para producción.
10. Preparar el deploy automático en Vercel usando GitHub Actions o la integración nativa.

## Fase 4: Backend
11. Añadir un paso de validación de entorno y dependencias para FastAPI.
12. Preparar el deploy automático en Render usando un trigger o webhook.
13. Verificar que /api/health responde correctamente.

## Fase 5: Validación
14. Hacer un push de cambios solo en frontend y confirmar que no se despliega el backend.
15. Hacer un push de cambios solo en backend y confirmar que no se despliega el frontend.
16. Hacer un push con cambios en ambas partes y confirmar que ambos jobs corren.
17. Verificar que los secretos no aparecen en el log.

## Fase 6: Pulido
18. Añadir un estado visual de éxito/fallo por job.
19. Documentar el flujo para futuros cambios.
20. Ajustar el workflow si se quiere agregar staging o pruebas automáticas luego.

## Criterio de aceptación
La feature se considera lista cuando el repositorio puede desplegar frontend y backend por separado con GitHub Actions, y cada servicio se actualiza solo cuando corresponde.
