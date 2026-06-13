# Dockerfile for HuggingFace Spaces deployment
# Builds frontend and serves everything from FastAPI
FROM python:3.11-slim

WORKDIR /app

# Install Node.js for frontend build
RUN apt-get update && apt-get install -y curl gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Backend dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Frontend dependencies (install first for layer caching)
COPY frontend/package.json frontend/package-lock.json* frontend/
RUN cd frontend && npm install

# Copy everything
COPY . .

# Build React app (same-origin, no separate API URL needed)
RUN cd frontend && VITE_API_URL="" npm run build

# Copy built frontend to backend/static/ so FastAPI serves it
RUN mkdir -p backend/static && cp -r frontend/dist/* backend/static/

# Expose HuggingFace Spaces default port
EXPOSE 7860

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]
