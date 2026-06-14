# Requisitos — Idioma y personalización del pipeline

## Objetivo
Permitir que la demo de artículos se ejecute en varios idiomas y que el usuario pueda ajustar ciertas características del resultado desde el frontend, sin romper el flujo actual del sistema de agentes.

## Requisitos funcionales
1. La app debe soportar dos conceptos de idioma:
   - idioma de la interfaz (texto del front)
   - idioma del contenido generado por los agentes
2. Estas dos configuraciones deben poder ser independientes entre sí.
3. El usuario debe poder elegir el idioma del artículo entre español y al menos 5 idiomas adicionales.
4. El sistema debe adaptar el prompt de los agentes al idioma seleccionado para el contenido.
5. El resultado final debe escribirse en ese idioma.
6. El usuario debe poder elegir al menos 3 opciones de personalización desde el frontend, por ejemplo:
   - tono (formal, casual, editorial)
   - longitud (corto, medio, largo)
   - enfoque (informativo, persuasivo, analítico)
5. La configuración elegida debe influir en el prompt de los agentes.
7. La interfaz debe mostrar de forma clara qué idioma y qué estilo se está usando.
8. El backend debe aceptar estas opciones en la solicitud de generación.
9. Si una opción no es válida, el sistema debe responder con un error claro.
10. Si el usuario no selecciona un idioma explícito, el sistema debe usar por defecto el idioma detectado desde el navegador del usuario.
11. Si el usuario no selecciona idioma de interfaz, la UI debe usar el idioma del navegador como valor inicial.

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
