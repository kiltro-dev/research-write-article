# Diseño — Idioma y personalización del pipeline

## Idea general
Agregar una capa pequeña pero útil de configuración al flujo existente:
- el usuario elige idioma,
- además puede elegir tono y longitud,
- y el sistema ajusta los prompts de los agentes de forma dinámica.

## Arquitectura propuesta

### Backend
1. Extender el modelo de solicitud de generación para aceptar:
   - language
   - tone
   - length
   - perspective
2. Crear una función que construya los prompts base de los agentes usando el idioma y las opciones elegidas.
3. Mantener el sistema actual de proveedores y fallback sin cambios mayores.
4. Devolver el idioma usado y la configuración aplicada como parte del resultado o del meta de la ejecución.

### Frontend
1. Añadir controles simples al formulario actual:
   - selector de idioma,
   - selector de tono,
   - selector de longitud,
   - selector de enfoque.
2. Mantener la interfaz limpia y visualmente atractiva.
3. Mostrar una pequeña etiqueta como:
   - “Writing in English • Formal • Medium length”

## Diseño del prompt dinámico
El prompt de cada agente debe tener una base común y una capa de personalización:

- Planner: define la estructura del artículo según idioma y tono.
- Writer: genera el contenido en el idioma seleccionado y con el tono solicitado.
- Editor: corrige estilo, claridad y coherencia en el mismo idioma.

Ejemplo conceptual:
- Si language = English
- tone = formal
- length = medium

Entonces los prompts del Writer y Editor deben reforzar:
- redacción profesional,
- estilo claro y formal,
- estructura bien organizada,
- y salida en inglés.

## Recomendaciones de UX
- Mantener los controles visibles pero no invasivos.
- Usar valores por defecto razonables si el usuario no cambia nada.
- Mostrar un resumen breve de la configuración en la tarjeta del resultado.

## Propuesta de mejora adicional
Además del idioma, podríamos considerar más opciones en el futuro:
- target audience (general / technical / business)
- format (article / essay / summary)
- include SEO keywords

Pero para el MVP conviene empezar solo con idioma + tono + longitud + enfoque.

## Resultado esperado
Una demo más flexible, más útil para mostrar en portafolio, y con una experiencia más cercana a una app real de IA generativa.
