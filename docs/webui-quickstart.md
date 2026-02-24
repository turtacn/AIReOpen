# AIReOpen Web UI Quickstart

This document describes how to build, run, and deploy the AIReOpen Frontend.

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

## Mock Mode

The application uses **Mock Service Worker (MSW)** to simulate backend APIs.
- Mock data is located in `src/mocks/data/`.
- Handlers are in `src/mocks/handlers/`.
- To disable mocks (connect to real backend), set `import.meta.env.DEV` to false (production build automatically does this, unless configured otherwise).

## Production Build

1. Run the build command:
   ```bash
   npm run build
   ```
   This generates static files in `dist/`.

2. Preview the build:
   ```bash
   npm run preview
   ```

## Docker Deployment (All-in-One)

We provide a Dockerfile for multi-stage build and Nginx serving.

1. Build the image:
   ```bash
   docker build -t aireopen-web:latest ./web
   ```

2. Run the container:
   ```bash
   docker run -p 8080:80 aireopen-web:latest
   ```

3. Access the application at `http://localhost:8080`.

## Architecture Highlights

- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS
- **State**: React Hooks + Context
- **API**: Axios with Interceptors
- **Mocking**: MSW (OpenAPI 3.0 compliant)
- **Charts**: Recharts
- **Streaming**: Native fetch with TextDecoder for SSE simulation

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
├── Dockerfile              # Container definition
└── nginx.conf              # Nginx configuration
```
