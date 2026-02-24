import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const ChatWorkspace = lazy(() => import('./pages/ChatWorkspace'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ChannelManager = lazy(() => import('./pages/ChannelManager'));
const AuditCenter = lazy(() => import('./pages/AuditCenter'));
const KnowledgeBase = lazy(() => import('./pages/KnowledgeBase'));

const LoadingSpinner = () => (
  <div className="h-full w-full flex items-center justify-center">
    <Loader2 className="animate-spin text-blue-500" size={48} />
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ChatWorkspace />
          </Suspense>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'channels',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ChannelManager />
          </Suspense>
        ),
      },
      {
        path: 'audit',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AuditCenter />
          </Suspense>
        ),
      },
      {
        path: 'knowledge',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <KnowledgeBase />
          </Suspense>
        ),
      },
    ],
  },
]);
