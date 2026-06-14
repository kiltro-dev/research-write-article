# 🚀 Deploy con GitHub Actions — Implementación Completa

## ¿Qué se implementó?

Flujo de CI/CD automatizado con GitHub Actions: cada push a `main` dispara el deploy **solo de la parte que cambió**.

```
Push a main
  ├── Cambió backend/     → deploy-backend.yml  → Render
  ├── Cambió frontend/    → deploy-frontend.yml → Vercel
  └── Cambiaron ambos     → los dos en paralelo
```

---

## 📂 Archivos creados

| Archivo | Propósito |
|---------|----------|
| `.github/workflows/deploy-backend.yml` | Valida imports Python + dispara deploy hook de Render |
| `.github/workflows/deploy-frontend.yml` | `npm ci` + `npm run build` + dispara deploy hook de Vercel |
| `render.yaml` | Infraestructura como código para Render (opcional, Blueprint) |

## 📝 Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `README.md` | Sección CI/CD agregada + badges de GitHub Actions, Render y Vercel |

---

## 🏗️ Paso 0: Crear los servicios (solo la primera vez)

Antes de los deploy hooks, necesitas crear el web service en Render y el proyecto en Vercel.

### Crear el Backend en Render

1. Ve a [dashboard.render.com](https://dashboard.render.com) e inicia sesión con GitHub
2. Haz clic en **New +** (arriba a la derecha) → selecciona **Web Service**
3. Render te pedirá conectar GitHub → autoriza y selecciona el repo `research-write-article`
4. Llena el formulario:

| Campo | Qué poner |
|-------|----------|
| **Name** | `article-agent-api` (será `article-agent-api.onrender.com`) |
| **Region** | El más cercano a ti (ej: Ohio) |
| **Branch** | `main` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT` |

5. **Antes de crear**, baja a **Advanced** → **Add Environment Variable**:

| Key | Value |
|-----|-------|
| `GROQ_API_KEY` | `gsk_tu_clave` (o tu clave de Gemini/OpenRouter) |
| `PROVIDER_PRIORITY` | `groq,gemini,openrouter,huggingface` |

> La versión de Python se define en el archivo `.python-version` (ya está en el repo). Render lo detecta automáticamente.

6. Selecciona **Free** como plan
7. Haz clic en **Create Web Service** → Render construye y despliega
8. Verifica: abre `https://article-agent-api.onrender.com/docs` (deberías ver Swagger)

### Crear el Frontend en Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión con GitHub
2. Haz clic en **Add New...** → **Project**
3. Selecciona el repo `research-write-article`
4. Configura:

| Campo | Valor |
|-------|-------|
| **Framework Preset** | Vite (lo detecta solo) |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

5. Agrega **Environment Variable**: `VITE_API_URL` = `https://article-agent-api.onrender.com`
6. Haz clic en **Deploy**
7. Verifica: abre la URL que te da (algo como `https://research-write-article.vercel.app`)

---

## ⚙️ Paso 1: Configurar los deploy hooks

### Render Deploy Hook
1. En [dashboard.render.com](https://dashboard.render.com), haz clic en el servicio `article-agent-api`
2. Ve a la pestaña **Settings** (arriba)
3. Desplázate hasta la sección **"Deploy Hook"** — ahí está la URL
4. Cópiala (formato: `https://api.render.com/deploy/srv-...?key=...`)
5. Si no la ves, el servicio aún no terminó su primer deploy — espera a que termine

### Vercel Deploy Hook
1. En [vercel.com](https://vercel.com), selecciona tu proyecto
2. Ve a **Settings** → menú lateral izquierdo: **Git**
3. En la sección **"Deploy Hooks"**, haz clic en **Create Hook**
4. Nombre: `github-actions`, rama: `main` → **Create**
5. Copia la URL (formato: `https://api.vercel.com/v1/integrations/deploy/prj_.../...`)

---

## 🔐 Paso 2: Agregar los secretos en GitHub

1. En tu repo de GitHub: **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** → agrega estos 3:

| Nombre | Valor |
|--------|-------|
| `RENDER_DEPLOY_HOOK_URL` | URL copiada de Render |
| `VERCEL_DEPLOY_HOOK_URL` | URL copiada de Vercel |
| `VITE_API_URL` | `https://article-agent-api.onrender.com` |

---

## 🔍 Cómo funciona cada workflow

### `deploy-backend.yml`
```yaml
Triggers: push a main con cambios en backend/ o requirements.txt

1. Checkout del código
2. Setup Python 3.11
3. pip install -r requirements.txt
4. Validación: importa main, agents, providers, prompt_adapter
5. POST al Render Deploy Hook → Render redeploya
```

### `deploy-frontend.yml`
```yaml
Triggers: push a main con cambios en frontend/

1. Checkout del código
2. Setup Node 20
3. npm ci (instalación limpia)
4. npm run build (con VITE_API_URL del secret)
5. POST al Vercel Deploy Hook → Vercel redeploya
```

---

## ✅ Verificación

1. Push solo a `backend/` → solo corre `deploy-backend.yml`
2. Push solo a `frontend/` → solo corre `deploy-frontend.yml`
3. Push a ambos → ambos jobs corren en paralelo
4. Los secretos nunca aparecen en logs (GitHub los oculta con `***`)

---

## 📝 Notas

- Si prefieres que Vercel maneje su propio deploy (en vez del webhook), puedes quitar el paso de `curl` del workflow de frontend. Vercel ya tiene integración nativa con GitHub que redeploya automáticamente. En ese caso el workflow solo valida el build.
- `render.yaml` permite crear/actualizar el servicio desde cero con `Render Blueprint`, pero no es obligatorio.
- Para agregar tests en el futuro: añadir un paso `pytest` después de `pip install`.

---

*Implementado el 14 de junio de 2026*
