# 🎉 Article Agent Demo — Implementación Completa

## ¿Qué se construyó?

Una aplicación web completa donde **3 agentes de IA colaboran** para escribir artículos:

```
Usuario escribe un tema → Planner investiga → Writer escribe → Editor pule → ¡Artículo listo!
```

Todo el progreso se ve en tiempo real con animaciones.

### Arquitectura

| Capa | Tecnología | ¿Dónde se despliega? |
|------|-----------|---------------------|
| **Backend** | FastAPI + crewAI | [Render](https://render.com) (gratis) |
| **Frontend** | React + Vite + Tailwind CSS + Framer Motion | [Vercel](https://vercel.com) (gratis) |
| **IA** | Groq, Gemini, OpenRouter, HuggingFace (fallback automático) | APIs externas |

---

## 📂 Estructura del proyecto

```
research-write-article/
├── backend/
│   ├── main.py          ← FastAPI: endpoints /api/generate, /api/health
│   ├── config.py        ← Variables de entorno
│   ├── providers.py     ← Router multi-proveedor con fallback
│   └── agents.py        ← Pipeline de agentes (Planner → Writer → Editor)
├── frontend/
│   ├── src/
│   │   ├── App.jsx      ← Lógica principal, conexión SSE
│   │   └── components/
│   │       ├── Hero.jsx          ← Sección de bienvenida
│   │       ├── TopicInput.jsx    ← Input del tema + botón generar
│   │       ├── AgentProgress.jsx ← Timeline animado de los 3 agentes
│   │       ├── ArticleResult.jsx ← Artículo final + copiar/regenerar
│   │       └── HowItWorks.jsx    ← Explicación del sistema multi-agente
│   └── package.json
├── specs/article-agent-demo/    ← Documentos de diseño originales
├── CLAUDE.md                    ← Guía para asistentes de IA
├── .env.example                 ← Template de variables de entorno
└── requirements.txt             ← Dependencias Python
```

---

## 🚀 Cómo correrlo en tu computadora (local)

### Requisitos
- Python 3.11 o más nuevo
- Node.js 18 o más nuevo
- Un editor de código (VS Code recomendado)

### Paso 1: Clonar el proyecto
```bash
git clone <url-de-tu-repo>
cd research-write-article
```

### Paso 2: Configurar las claves de IA (BACKEND)

Necesitas **al menos una** de estas APIs (recomendación: empieza con Groq, es la más rápida y tiene capa gratuita):

#### Opción A: Groq (RECOMENDADA — más rápida, plan gratuito)
1. Entra a 👉 **[console.groq.com](https://console.groq.com)**
2. Crea una cuenta (puedes usar Google/GitHub)
3. En el menú izquierdo, haz clic en **"API Keys"**
4. Haz clic en **"Create API Key"**
5. Copia la clave (empieza con `gsk_...`)

#### Opción B: Google Gemini (también gratuita)
1. Entra a 👉 **[aistudio.google.com](https://aistudio.google.com)**
2. Inicia sesión con tu cuenta de Google
3. En el menú izquierdo, haz clic en **"Get API Key"**
4. Haz clic en **"Create API Key"**
5. Copia la clave

#### Opción C: OpenRouter (acceso a muchos modelos)
1. Entra a 👉 **[openrouter.ai/keys](https://openrouter.ai/keys)**
2. Crea una cuenta
3. Haz clic en **"Create Key"**
4. Copia la clave

### Paso 3: Crear el archivo .env
```bash
# En la carpeta del proyecto, copia el template:
cp .env.example .env
```

Abre el archivo `.env` con tu editor y pega tu clave. Ejemplo si usas Groq:
```
GROQ_API_KEY=gsk_tuClaveAqui...
PROVIDER_PRIORITY=groq,gemini,openrouter,huggingface
```

¡Las otras líneas déjalas como están! Solo necesitas UNA clave.

### Paso 4: Instalar dependencias del backend
```bash
# En la carpeta del proyecto:
pip install -r requirements.txt
```

### Paso 5: Instalar dependencias del frontend
```bash
cd frontend
npm install
```

### Paso 6: ¡Ejecutar!

Abre **DOS terminales**:

**Terminal 1 — Backend:**
```bash
cd research-write-article
python backend/main.py
```
Verás algo como: `Uvicorn running on http://0.0.0.0:8000`

**Terminal 2 — Frontend:**
```bash
cd research-write-article/frontend
npm run dev
```
Verás: `Local: http://localhost:5173`

### Paso 7: Abrir en el navegador
Abre 👉 **[http://localhost:5173](http://localhost:5173)**

Escribe un tema (ej: "Artificial Intelligence in Healthcare") y haz clic en **Generate**.

Verás el timeline con los 3 agentes trabajando en tiempo real. Cuando terminen, verás el artículo completo.

---

## 🌐 Cómo subirlo a producción (GRATIS)

Vamos a usar **Render** para el backend y **Vercel** para el frontend. Ambos tienen capa gratuita.

---

### PARTE A: Subir el Backend a Render.com

> **¿Qué es Render?** Un servicio que ejecuta tu código Python en internet 24/7 (bueno, en capa gratuita se duerme después de 15 minutos sin uso, pero se despierta solo cuando alguien entra).

#### A1. Subir el código a GitHub

Render necesita leer tu código desde GitHub. Si no has subido el proyecto todavía:

```bash
cd research-write-article
git add .
git commit -m "Article Agent Demo ready for deployment"
git push origin main
```

#### A2. Crear una cuenta en Render

1. Entra a 👉 **[dashboard.render.com](https://dashboard.render.com)**
2. Haz clic en **"Sign Up"** (recomendado: usar GitHub para registrarte)
3. Autoriza a Render para que se conecte con tu cuenta de GitHub

#### A3. Crear el servicio web

1. En el dashboard de Render, haz clic en el botón **"New +"** (arriba a la derecha)
2. Selecciona **"Web Service"**
3. Render te mostrará tus repositorios de GitHub. Busca y selecciona **`research-write-article`**
4. Ahora configura estos campos:

| Campo | Qué poner |
|-------|----------|
| **Name** | `article-agent-api` (o el nombre que quieras) |
| **Region** | `Oregon (US West)` — es la más cercana si estás en América |
| **Branch** | `main` |
| **Root Directory** | Déjalo vacío |
| **Environment** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT` |

> ⚠️ **IMPORTANTE**: Ese `$PORT` se pone literalmente así, con signo de pesos. Render lo reemplaza automáticamente.

5. **ANTES de hacer clic en "Create Web Service"**, baja hasta la sección **"Advanced"** y agrega las variables de entorno:

| Key | Value |
|-----|-------|
| `GROQ_API_KEY` | `gsk_tuClaveAqui` |
| `PROVIDER_PRIORITY` | `groq,gemini,openrouter,huggingface` |
| `PYTHON_VERSION` | `3.11.0` |

(Si usas Gemini en vez de Groq, pon `GEMINI_API_KEY` en lugar de `GROQ_API_KEY`)

6. En **"Plan"**, selecciona **"Free"**
7. Haz clic en **"Create Web Service"**

8. 🎉 **Render empezará a construir y desplegar tu app.** Verás logs en vivo. Cuando termine, tu backend estará vivo en:
   ```
   https://article-agent-api.onrender.com
   ```

9. Verifica que funciona: entra a `https://article-agent-api.onrender.com/docs` — deberías ver la página de Swagger con tus endpoints.

> ⚠️ **Ojo con el sleep mode**: En capa gratuita, si nadie usa tu app por 15 minutos, Render la "duerme". La primera petición después de dormir tarda ~30-60 segundos en responder. ¡Es normal! Las siguientes peticiones son rápidas.

---

### PARTE B: Subir el Frontend a Vercel

> **¿Qué es Vercel?** Un servicio que publica sitios web. Ideal para React/Vite. Gratis, rápido, y no se duerme como Render.

#### B1. Preparar el frontend

Tu frontend YA está listo. Solo necesitas decirle a Vercel dónde está el backend. Para eso crea una **variable de entorno en Vercel** (lo haremos en el paso B3).

#### B2. Crear cuenta en Vercel e importar el proyecto

1. Entra a 👉 **[vercel.com](https://vercel.com)**
2. Haz clic en **"Sign Up"** (recomendado: usar GitHub)
3. Después de registrarte, haz clic en **"Add New..."** → **"Project"**
4. Busca y selecciona tu repo `research-write-article`
5. Vercel detecta automáticamente que es un proyecto Vite. Verifica estos campos:

| Campo | Valor |
|-------|-------|
| **Framework Preset** | `Vite` (debe detectarse solo) |
| **Root Directory** | `frontend` ← ⚠️ ¡IMPORTANTE! Pon `frontend` aquí |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

#### B3. Agregar la variable de entorno del backend

Antes de hacer clic en Deploy, en esa misma pantalla busca **"Environment Variables"** y agrega:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://article-agent-api.onrender.com` |

(⚠️ Usa la URL exacta que te dio Render en el paso A3.8)

#### B4. ¡Desplegar!

Haz clic en **"Deploy"**. Vercel construirá tu frontend y en ~30 segundos te dará una URL:

```
https://research-write-article.vercel.app
```

(O una URL similar con el nombre de tu proyecto)

#### B5. Verificar

Entra a la URL que te dio Vercel. Escribe un tema, haz clic en Generate, y deberías ver a los agentes trabajar.

---

## 🔑 Resumen de dónde conseguir cada cosa

| Servicio | URL | ¿Qué obtienes? |
|----------|-----|----------------|
| **Groq API Key** | [console.groq.com/keys](https://console.groq.com/keys) | Clave que empieza con `gsk_` |
| **Gemini API Key** | [aistudio.google.com](https://aistudio.google.com) | Clave de Google AI |
| **OpenRouter Key** | [openrouter.ai/keys](https://openrouter.ai/keys) | Clave para múltiples modelos |
| **Render (backend)** | [dashboard.render.com](https://dashboard.render.com) | Hosting gratuito para Python |
| **Vercel (frontend)** | [vercel.com](https://vercel.com) | Hosting gratuito para React |

---

## 🧪 Cómo probar que todo funciona

### Probar el backend solo
```bash
# Con el backend corriendo localmente:
curl -X POST http://localhost:8000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"topic": "El futuro de la inteligencia artificial"}'
```

Si todo está bien, verás un stream de eventos SSE con el progreso de los agentes.

### Probar el health check
```bash
curl http://localhost:8000/api/health
```
Debería responder: `{"status":"ok","configured_providers":["groq"]}`

### Probar el frontend solo
```bash
cd frontend
npm run build    # Verifica que compile sin errores
npm run preview  # Previsualiza la versión de producción
```

---

## ⚙️ Cómo funciona el fallback de proveedores

El sistema intenta usar los proveedores de IA en este orden (configurable en `.env`):

```
Groq → Gemini → OpenRouter → HuggingFace
```

1. Intenta con **Groq** (el más rápido, modelos Llama)
2. Si Groq falla (sin crédito, error de red), prueba con **Gemini** (Google)
3. Si Gemini falla, prueba **OpenRouter** (acceso a muchos modelos)
4. Si todo falla, intenta **HuggingFace Inference**

Solo necesitas configurar **UNA** clave. El sistema usará la primera que funcione. Puedes cambiar el orden en `PROVIDER_PRIORITY` (en el `.env` o en las variables de entorno de Render).

---

## 🎨 Personalización

### Cambiar el modelo de IA
En tu `.env` (local) o en Render (producción), cambia `DEFAULT_MODEL`:

```bash
# Para Groq (rápido y bueno):
DEFAULT_MODEL=groq/llama-3.3-70b-versatile

# Para Groq (más barato, más rápido):
DEFAULT_MODEL=groq/llama-3.1-8b-instant

# Para Gemini (buena calidad/precio):
DEFAULT_MODEL=gemini/gemini-2.5-flash
```

### Cambiar el orden de proveedores
```bash
# Probar Gemini primero, luego Groq:
PROVIDER_PRIORITY=gemini,groq,openrouter,huggingface
```

---

## ❓ Problemas comunes y soluciones

### "No LLM provider available"
**Causa**: No configuraste ninguna API key.
**Solución**: Revisa tu archivo `.env` (local) o las variables de entorno en Render. Asegúrate de que al menos una clave (GROQ_API_KEY, GEMINI_API_KEY, etc.) tenga un valor real.

### El frontend no se conecta al backend (error de red/CORS)
**Causa**: La URL del backend no está bien configurada.
**Solución**: 
- En local: el proxy de Vite ya está configurado en `vite.config.js`.
- En Vercel: verifica que `VITE_API_URL` tenga la URL correcta de Render (con `https://`).

### Render se duerme y la primera petición es muy lenta
**Causa**: Es normal en capa gratuita de Render.
**Solución**: Usa [UptimeRobot](https://uptimerobot.com) (gratis) para hacer ping a tu app cada 10 minutos. Así nunca se duerme.

### Error "chromadb" o dependencias conflictivas
**Causa**: Versiones incompatibles de crewai.
**Solución**: Usa `pip install -r requirements.txt` (ya está arreglado con rangos de versión compatibles).

---

## 📝 Notas finales

- **Seguridad**: NUNCA subas tu archivo `.env` a GitHub. El `.gitignore` ya lo excluye, revísalo.
- **Costo**: Con Groq o Gemini en capa gratuita, esta app cuesta $0/mes.
- **Límites**: Groq capa gratuita permite ~1,000 requests/día. Más que suficiente para una demo.
- **Portafolio**: La interfaz con el timeline de agentes está diseñada para impresionar en entrevistas.

---

*Implementado el 13 de junio de 2026*
*Última verificación de interfaces: Render, Vercel, Groq y Gemini — junio 2026*
