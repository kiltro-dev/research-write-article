# Requisitos — Idioma y personalización del pipeline

## Objetivo
Permitir que la demo de artículos se ejecute en varios idiomas y que el usuario pueda ajustar ciertas características del resultado desde el frontend, sin romper el flujo actual del sistema de agentes.

## Requisitos funcionales
1. El usuario debe poder elegir el idioma del artículo entre español y al menos 5 idiomas adicionales.
2. El sistema debe adaptar el prompt de los agentes al idioma seleccionado.
3. El resultado final debe escribirse en ese idioma.
4. El usuario debe poder elegir al menos 3 opciones de personalización desde el frontend, por ejemplo:
   - tono (formal, casual, editorial)
   - longitud (corto, medio, largo)
   - enfoque (informativo, persuasivo, analítico)
5. La configuración elegida debe influir en el prompt de los agentes.
6. La interfaz debe mostrar de forma clara qué idioma y qué estilo se está usando.
7. El backend debe aceptar estas opciones en la solicitud de generación.
8. Si una opción no es válida, el sistema debe responder con un error claro.

## Requisitos no funcionales
1. El sistema debe seguir funcionando con el fallback actual de proveedores.
2. La personalización debe ser opcional; si no se pasa nada, debe usar valores por defecto.
3. El diseño debe ser simple y fácil de mantener.
4. La lógica de idioma debe ser centralizada para facilitar futuras ampliaciones.

## Idiomas sugeridos
- Español
- Inglés
- Portugués
- Francés
- Italiano
- Alemán

## Personalizaciones sugeridas
- language: idioma del artículo
- tone: formal / casual / editorial
- length: short / medium / long
- perspective: informative / persuasive / analytical

## Criterios de aceptación
1. Se puede elegir un idioma desde el frontend.
2. El artículo generado aparece en ese idioma.
3. Las opciones de personalización modifican el resultado de forma visible.
4. El sistema sigue funcionando con el fallback de proveedores actual.
