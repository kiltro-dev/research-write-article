# Requisitos — Deploy con GitHub Actions y separación frontend/backend

## Objetivo
Establecer un flujo de despliegue profesional para la app usando GitHub Actions, con:
- backend en Render,
- frontend en Vercel,
- y despliegues independientes según qué parte del proyecto cambió.

## Requisitos funcionales
1. El repositorio debe poder desplegar el backend y el frontend por separado.
2. Los cambios en la carpeta frontend deben disparar solo el deploy del frontend.
3. Los cambios en la carpeta backend deben disparar solo el deploy del backend.
4. Si cambian ambas partes, ambos despliegues deben poder ejecutarse.
5. El pipeline debe usar secretos de GitHub para las claves de API y otras variables sensibles.
6. Debe existir una forma clara de validar el build antes del deploy.
7. Debe existir un estado visible del deploy para revisión y troubleshooting.

## Requisitos no funcionales
1. El proceso debe ser simple de mantener.
2. Debe evitar exponer claves en el repositorio.
3. Debe ser compatible con un flujo de desarrollo típico de GitHub.
4. Debe permitir futuras extensiones, como pruebas automáticas o despliegue a otras plataformas.

## Requisitos de arquitectura
1. Frontend: React + Vite + Tailwind.
2. Backend: FastAPI + crewAI.
3. El frontend debe apuntar al backend mediante una variable de entorno como VITE_API_URL.
4. El backend debe usar variables de entorno para proveedores y secretos.

## Criterios de aceptación
1. Un cambio en frontend dispara solo el deploy de Vercel.
2. Un cambio en backend dispara solo el deploy de Render.
3. Los secretos se manejan desde GitHub Actions.
4. El flujo puede ejecutarse sin cambios manuales complejos en cada push.
