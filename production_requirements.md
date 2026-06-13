# Requisitos para convertir la demo en una app de producción

## 1. Objetivo del proyecto
Convertir la demo actual de agentes en una aplicación simple, atractiva y desplegable, con:
- un backend en FastAPI,
- un frontend ligero en React,
- una experiencia de usuario que muestre el valor del sistema de agentes,
- y una demostración que sirva bien como portafolio.

## 2. Requisitos funcionales

### MVP (versión inicial)
1. El usuario escribe un tema o una pregunta.
2. El backend crea una ejecución con agentes:
   - Planner
   - Writer
   - Editor
3. El sistema devuelve:
   - un artículo generado,
   - una versión resumen del proceso,
   - y una señal visual de progreso.
4. La app debe poder correr con una sola orden local.
5. La app debe aceptar configuración por variables de entorno.

### Requisitos de portafolio
1. La interfaz debe verse moderna, limpia y profesional.
2. Debe mostrar que hay un proceso de agentes detrás, no solo un output final.
3. Debe ser fácil de explicar en una demo de 2 a 5 minutos.
4. Debe poder ejecutarse con un presupuesto bajo o gratis.

## 3. Requisitos no funcionales
- Seguridad: no guardar claves en el repo.
- Configuración: usar .env o secretos del hosting.
- Rendimiento: la respuesta inicial debe ser visible en menos de 10 segundos para temas simples.
- Mantenibilidad: separar backend, frontend y lógica de agentes.
- Escalabilidad: permitir cambiar el modelo sin tocar la lógica de negocio.

## 4. Stack recomendado

### Backend
- FastAPI
- Pydantic
- Python 3.11+
- crewai
- python-dotenv

### Frontend
- React + Vite
- Tailwind CSS
- Framer Motion

### Opciones de hosting gratis o de bajo costo
- Frontend: Vercel, Netlify, GitHub Pages (solo si la app es simple)
- Backend: Render, Railway, Fly.io, Hugging Face Spaces

## 5. Estrategia de proveedores (importante)
La app no debe estar atada a un único modelo ni a un único proveedor. La arquitectura debe permitir:
- usar Groq como primera opción,
- si no está disponible o no tiene crédito, probar Gemini,
- si también falla, usar OpenRouter o Hugging Face Inference,
- y registrar el proveedor que finalmente respondió.

Esto evita depender de una sola API y hace la app más robusta para un deploy gratuito o de bajo costo.

### Propuesta de orden de prioridad
1. Groq
2. Gemini
3. OpenRouter
4. Hugging Face Inference

La prioridad puede configurarse por variables de entorno.

## 6. Modelos gratis o de bajo costo para usar
Como la app se desplegará en Render, no conviene depender de Ollama ni de un modelo corriendo en la misma máquina. La opción correcta es usar un proveedor externo con API.

### A. Opciones recomendadas para Render
1. Groq
   - Muy rápido.
   - Excelente para una demo de portafolio.
   - Suele tener un plan gratuito o créditos iniciales.
   - Muy buena opción si quieres velocidad y simplicidad.

2. Google Gemini (Google AI Studio)
   - Tiene un tier gratuito / créditos de prueba.
   - Muy buena opción para prototipos y demos.
   - Compatible con un backend en Render.

3. OpenRouter
   - Permite acceder a varios modelos desde una sola API.
   - Útil para comparar modelos sin cambiar mucho el código.
   - Buena opción si quieres probar modelos gratuitos o con créditos.

4. Hugging Face Inference
   - Buena alternativa para modelos open-source.
   - Más apropiada para experimentación y demos simples.
   - Requiere revisar límites por proveedor y región.

### B. Qué NO conviene para Render
- Ollama: no sirve para un deploy en Render porque corre en la máquina local, no en el servidor de hosting.
- Modelos que dependan de GPU local o de un entorno específico del escritorio.

### Recomendación para este proyecto
- Para el MVP: Groq o Google Gemini.
- Para una demo de portafolio: Groq por velocidad y facilidad.
- Para producción real: un proveedor externo con límites claros y control de presupuesto.

## 6. Decisión clave sobre la interfaz
La interfaz no debe ser solo una caja de texto y un botón.
Debe mostrar:
- el tema que se está procesando,
- qué etapa está ejecutando el sistema,
- una pequeña explicación del progreso,
- y el resultado final.

Eso convierte la demo en algo más interesante para un portafolio.

## 7. Criterios de aceptación
La versión inicial se considera lista cuando:
- se puede enviar un tema desde el frontend,
- FastAPI ejecuta la tarea de agentes,
- el resultado se muestra en el navegador,
- y la experiencia se ve profesional y clara.
