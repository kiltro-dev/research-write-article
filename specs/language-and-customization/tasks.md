# Tareas — Idioma y personalización del pipeline

## Fase 1: Preparación
1. Revisar el modelo actual de solicitud en el backend.
2. Definir los valores por defecto para idioma y personalización.
3. Confirmar que el frontend actual admite extensiones sin romper el flujo.

## Fase 2: Backend
4. Extender la solicitud de generación con:
   - language
   - tone
   - length
   - perspective
5. Añadir una función centralizada para construir prompts dinámicos por idioma.
6. Asegurar que los prompts de Planner, Writer y Editor usen esa configuración.
7. Mantener el fallback de proveedores existente.

## Fase 3: Frontend
8. Añadir selectores simples al formulario de entrada:
   - idioma
   - tono
   - longitud
   - enfoque
9. Mostrar la configuración activa en la UI.
10. Enviar la configuración al backend junto con el topic.

## Fase 4: Validación
11. Probar con al menos un idioma distinto al español.
12. Verificar que el artículo generado está realmente en ese idioma.
13. Probar distintos tonos y longitudes para confirmar que afectan el resultado.
14. Verificar que la app sigue funcionando si el usuario no cambia nada.

## Fase 5: Pulido
15. Añadir mensajes de ayuda en la UI para explicar cada opción.
16. Mejorar el resumen visible del resultado con la configuración usada.
17. Documentar los valores posibles para cada control.

## Criterio de aceptación
La feature se considera lista cuando el usuario puede elegir idioma y estilo, y el sistema genera contenido adaptado a esa configuración sin romper el flujo principal.
