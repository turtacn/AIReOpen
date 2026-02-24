import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center">
          <AlertTriangle className="text-red-500 mb-4" size={48} />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Something went wrong</h1>
          <p className="text-slate-500 mb-4">An unexpected error occurred in the application.</p>
          <pre className="p-4 bg-slate-100 rounded text-left text-xs overflow-auto max-w-2xl text-red-600">
            {this.state.error?.message}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
