# 🌐 Language & Customization — Implementación Completa

## ¿Qué se implementó?

El usuario ahora puede personalizar completamente la generación de artículos:

- **🌐 Idioma del artículo**: 6 idiomas (Español, English, Português, Français, Italiano, Deutsch)
- **🎨 Tono**: 5 opciones (Casual, Formal, Editorial, Técnico, Inspirador)
- **📏 Longitud**: 3 niveles (Corto ~350 palabras, Medio ~800 palabras, Largo ~1500 palabras)
- **🔍 Enfoque**: 3 perspectivas (Informativo, Persuasivo, Analítico)

Todo con **detección automática del idioma del navegador** como valor inicial inteligente y **persistencia en localStorage** para recordar preferencias.

---

## 📂 Archivos nuevos (5)

| Archivo | Propósito |
|---------|----------|
| `backend/prompt_adapter.py` | Capa centralizada de adaptación de prompts por idioma/tono/longitud/enfoque |
| `frontend/src/i18n.js` | Sistema de traducciones (6 idiomas) + opciones de personalización |
| `frontend/src/hooks/useBrowserLanguage.js` | Detección de idioma del navegador + persistencia en localStorage |
| `frontend/src/components/CustomizationPanel.jsx` | Panel colapsable con selectores de idioma, tono, longitud y enfoque |

## 📝 Archivos modificados (8)

| Archivo | Cambios |
|---------|---------|
| `backend/main.py` | `GenerateRequest` extendido con `content_language`, `tone`, `length`, `perspective` (validados con regex) |
| `backend/agents.py` | `run_article_pipeline()` y `_create_tasks()` aceptan y aplican opciones de personalización |
| `frontend/src/App.jsx` | Estado de personalización, detección de idioma, selector de UI, pase de params al API |
| `frontend/src/components/TopicInput.jsx` | Panel de personalización integrado debajo del input |
| `frontend/src/components/Hero.jsx` | Textos traducidos dinámicamente |
| `frontend/src/components/AgentProgress.jsx` | Etiquetas de etapas traducidas |
| `frontend/src/components/ArticleResult.jsx` | Badges de configuración usada + botones traducidos |
| `frontend/src/components/HowItWorks.jsx` | Descripciones de agentes traducidas |

---

## 🧠 Cómo funciona

### Flujo completo

```
Usuario abre la app
  → Detecta idioma del navegador (navigator.language)
  → Carga preferencias guardadas de localStorage
  → Muestra la UI en ese idioma
  → Sugiere idioma de contenido = idioma del navegador

Usuario personaliza (o no)
  → Abre panel "Personalizar" (colapsable)
  → Cambia idioma, tono, longitud, enfoque
  → Cada cambio se guarda en localStorage automáticamente

Usuario escribe tema + click en Generar
  → Frontend envía: { topic, content_language, tone, length, perspective }
  → Backend valida con Pydantic (regex patterns)
  → prompt_adapter construye instrucciones específicas
  → Las instrucciones se inyectan en los 3 agentes (Planner, Writer, Editor)
  → Los agentes generan contenido en el idioma + estilo solicitado
  → El resultado incluye la configuración usada
  → Frontend muestra badges con idioma, tono, longitud, enfoque
```

### Ejemplo de adaptación de prompt

Si el usuario selecciona: **Français + Formal + Long + Analytique**

El Writer recibe estas instrucciones inyectadas en su task:

```
🎯 CONTENT CONFIGURATION (apply these to ALL your work):

1. LANGUAGE: Rédigez tout le contenu en français.
2. TONE: Use a formal, professional tone. Avoid slang and colloquialisms.
3. LENGTH: Write a comprehensive, long-form article — aim for 1200-2000 words.
4. PERSPECTIVE: Focus on deep analysis. Break down complex ideas...
```

El Editor recibe instrucciones complementarias enfocadas en corrección gramatical para francés.

---

## 🎨 Decisiones de UX (basadas en investigación)

### 1. Panel colapsable, no abrumador
- El panel de personalización empieza **cerrado** — solo se ve un link sutil "Personalizar"
- Muestra un **resumen compacto** de la configuración actual incluso cerrado
- Animación suave al expandir/colapsar (Framer Motion, 300ms)
- Sigue el patrón de "advanced options" de herramientas como Notion AI

### 2. Sin banderas — nombres nativos
- Los idiomas se muestran en su **forma nativa** (Español, English, Français, etc.)
- Sin banderas: las banderas representan países, no idiomas (consenso en UX research)
- Ícono de globo terráqueo 🌐 como indicador visual universal

### 3. Segmented controls para tono/longitud/enfoque
- **Botones tipo pill** — todas las opciones visibles de un vistazo
- No dropdowns ocultos — el usuario ve instantáneamente qué puede elegir
- El seleccionado usa color brand (indigo) + escala sutil (105%)
- Feedback visual inmediato en cada clic

### 4. Smart defaults
- El idioma del navegador se detecta como valor inicial
- Las preferencias se guardan en localStorage — sobreviven refrescos
- Si el usuario nunca abre el panel, los defaults producen buen resultado

### 5. Badges de configuración en el resultado
- Cuando el artículo se genera, se muestran **4 badges** con la configuración usada
- Colores distintos por categoría: azul (idioma), púrpura (tono), ámbar (longitud), esmeralda (enfoque)
- Cada badge tiene un emoji distintivo: 🌐 ✍️ 📏 🔍

### 6. Selector de idioma de UI en la esquina
- Esquina superior derecha — ubicación estándar que los usuarios esperan
- Sutil, fondo semitransparente con backdrop-blur
- Cambia instantáneamente toda la interfaz

---

## 📊 Validación

### Backend
- `GenerateRequest` usa **regex patterns** de Pydantic para validar cada campo
- Valores inválidos → error 422 con mensaje claro
- `prompt_adapter.validate_options()` aplica defaults seguros si algo falla
- Prompt genérico + capa de personalización inyectada (no reemplaza, extiende)

### Testing manual recomendado
1. Probar con `content_language=fr` → el artículo debe salir en francés
2. Probar `tone=formal` vs `tone=casual` → diferencia clara en estilo
3. Probar `length=short` → artículo notablemente más corto
4. Probar `perspective=analytical` → más profundidad y análisis
5. Cambiar idioma de UI → toda la interfaz cambia sin recargar
6. Recargar la página → preferencias persisten

---

## 🔄 Compatibilidad

- ✅ El fallback de proveedores (Groq→Gemini→OpenRouter→HF) sigue funcionando
- ✅ El pipeline Planner→Writer→Editor no se modificó estructuralmente
- ✅ SSE streaming de progreso intacto
- ✅ Si no se envían params de personalización, se usan defaults (backward compatible)
- ✅ El endpoint `/api/health` no cambió

---

## 📝 Notas para el futuro

### Añadir más idiomas
1. Agregar entrada en `SUPPORTED_LANGUAGES` en `backend/prompt_adapter.py`
2. Agregar traducciones en `frontend/src/i18n.js`
3. Agregar código en el regex de `GenerateRequest.content_language`

### Añadir más opciones de personalización
Seguir el mismo patrón:
1. Agregar al diccionario en `prompt_adapter.py`
2. Agregar al modelo `GenerateRequest` en `main.py`
3. Agregar opciones en `CustomizationPanel.jsx`
4. Agregar traducciones en `i18n.js`

---

*Implementado el 13 de junio de 2026*
*Basado en investigación de UX de Jasper, Copy.ai, ChatGPT, Notion AI y guías de diseño de Nielsen Norman Group*
