import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by error boundary:', error, errorInfo);
    // Aici am putea trimite eroarea către un serviciu de monitorizare cum ar fi Sentry
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-300 rounded-md">
          <h3 className="text-lg font-medium text-red-800 mb-2">Ceva nu a funcționat corect</h3>
          <p className="text-sm text-red-700 mb-4">
            Ne pare rău, a apărut o eroare. Vă rugăm să încercați din nou sau să reîncărcați pagina.
          </p>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            Reîncărcați pagina
          </button>
          {process.env.NODE_ENV !== 'production' && this.state.error && (
            <div className="mt-4 p-3 bg-red-100 rounded overflow-auto text-xs">
              <p className="font-bold">Error: {this.state.error.message}</p>
              <p className="mt-2 whitespace-pre-wrap">{this.state.error.stack}</p>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC pentru a adăuga ErrorBoundary la orice componentă
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return (props: P) => (
    <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  );
}

// Funcție pentru a loga erori manual
export function logError(error: Error, context?: Record<string, any>): void {
  console.error('Error logged:', error, context);
  // Aici am putea trimite eroarea către un serviciu de monitorizare
}

// Hook pentru gestionarea erorilor în componente funcționale
export function useErrorHandler() {
  return {
    captureError: (error: Error, context?: Record<string, any>) => {
      logError(error, context);
    },
    captureMessage: (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
      console[level](message);
      // Aici am putea trimite mesajul către un serviciu de monitorizare
    }
  };
}