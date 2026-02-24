# AIReOpen Web UI Quickstart

This document describes how to build, run, and deploy the AIReOpen Frontend in different modes.

## Prerequisites

- Node.js 18+
- Docker (optional for containerized deployment)

## Local Development

1. Navigate to the `web` directory:
   ```bash
   cd web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server (with MSW Mock Mode enabled by default):
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

## Docker Deployment

The Docker image supports two main scenarios: **Demo Mode** (standalone with mock data) and **Production Mode** (connected to real backend).

### 1. Scenario A: Demo Mode (Mock Data / Simulation)

This builds a container that runs **independently of any backend**. It uses the internal Mock Service Worker (MSW) to simulate API responses with realistic test data. This is perfect for demos or testing when the backend is not ready.

**Build:**
```bash
# VITE_API_MODE defaults to 'mock' in the Dockerfile
docker build -t aireopen-web:demo ./web
```

**Run:**
```bash
docker run -d -p 8080:80 --name aireopen-demo aireopen-web:demo
```

Access the application at `http://localhost:8080`. You will see full data populated from the mock layer.

### 2. Scenario B: Production Mode (Real Backend)

This builds a container configured to talk to a real backend API.

**Build:**
```bash
# Pass 'real' mode and the API URL
# Example backend URL: https://api.aireopen.example.com/v1
docker build \
  --build-arg VITE_API_MODE=real \
  --build-arg VITE_API_BASE_URL=https://api.aireopen.example.com/v1 \
  -t aireopen-webui:prod ./web
```

**Run:**
```bash
docker run -d -p 80:80 --name aireopen-prod aireopen-webui:prod
```

### 3. Modifying Test Data (Simulation)

To customize the simulation data without changing code structure:
1. Edit the JSON files in `web/src/mocks/data/` (e.g., `channels.json`, `dashboard.json`).
2. Rebuild the Demo Mode image.

## Project Structure

```
web/
├── src/
│   ├── components/layout/  # AppShell, Sidebar, ErrorBoundary
│   ├── hooks/              # Custom hooks (useChatStream)
│   ├── locales/            # i18n JSON files (en/zh)
│   ├── mocks/              # MSW handlers and data
│   ├── pages/              # Module pages (Dashboard, Chat, etc.)
│   ├── services/           # API Adapter and typed calls
│   └── router.tsx          # Route definitions with Lazy Loading
├── Dockerfile              # Multi-stage build definition
└── nginx.conf              # Nginx configuration
```
