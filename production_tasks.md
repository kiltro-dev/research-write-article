# Tareas para convertir la app en producción

## Fase 1: Preparación base
1. Crear un proyecto estructurado con:
   - backend/fastapi
   - frontend/react
   - config/env
2. Definir variables de entorno:
   - OPENAI_API_KEY o la clave del proveedor elegido
   - SERPER_API_KEY (si se usa una capa de búsqueda)
   - MODEL_PROVIDER
   - MODEL_NAME
3. Asegurar que la lógica actual del notebook se pueda ejecutar desde Python puro.
4. Elegir un proveedor externo compatible con Render, como Groq, Google Gemini o OpenRouter.

## Fase 2: Migrar la lógica de agentes a backend
4. Extraer la lógica del notebook a un módulo Python reutilizable.
5. Crear una función que reciba un topic y devuelva:
   - plan,
   - artículo,
   - resumen final,
   - estado del proceso.
6. Añadir manejo de errores si falta una API key o falla una llamada.

## Fase 3: Crear el servicio FastAPI
7. Implementar el endpoint /api/generate.
8. Implementar el endpoint /api/health.
9. Añadir validación de entrada con Pydantic.
10. Devolver JSON limpio y comprensible para el frontend.

## Fase 4: Diseñar la interfaz de usuario
11. Crear una landing page simple con:
   - input del tema,
   - botón de generación,
   - panel de resultado,
   - y sección explicativa.
12. Añadir una animación de progreso para los 3 pasos del pipeline.
13. Mostrar al usuario qué está haciendo el sistema en ese momento.

## Fase 5: Diseñar el sistema de proveedores
11. Definir un selector de proveedor con prioridad configurable.
12. Implementar fallback en este orden: Groq → Gemini → OpenRouter → Hugging Face.
13. Registrar cuál proveedor fue usado en cada ejecución para depurar y medir.
14. Añadir un modo de fallback seguro si todos los proveedores fallan.

## Fase 6: Hacer que la demo sea “portafolio-ready”
14. Añadir una sección “Cómo funciona” con explicación visual de agentes.
15. Añadir una sección de “beneficios” o “por qué esta demo es interesante”.
16. Asegurar que la interfaz se vea moderna pero no sobrecargada.

## Fase 7: Deployment y pruebas
17. Probar la app localmente con un tema simple.
18. Verificar que no hay fugas de secretos.
19. Preparar una versión deployable en Render usando un proveedor externo de IA.
20. Confirmar que la app no depende de Ollama ni de hardware local.
21. Documentar cómo correr la app en local y en producción.

## Fase 8: Optimización opcional
21. Añadir soporte para modelos gratuitos o de bajo costo.
22. Añadir un modo demo sin depender de una API externa.
23. Añadir historial de ejecuciones recientes si se desea.

## Prioridad recomendada
- Prioridad alta: backend + endpoint + ejecución básica.
- Prioridad media: UI simple + animaciones de progreso.
- Prioridad baja: extras visuales y extras de producción.

## Criterio de finalización del MVP
La versión MVP está lista cuando:
- se puede usar desde el navegador,
- el backend genera un artículo real,
- la app se ve limpia y profesional,
- y el proceso de agentes es visible para la persona que lo está viendo.
