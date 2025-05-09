// src/utils/errorMonitoring.ts
import * as Sentry from '@sentry/nextjs';

interface ErrorMonitoringOptions {
  environment?: string;
  release?: string;
  enableInDev?: boolean;
}

export function initErrorMonitoring(options: ErrorMonitoringOptions = {}) {
  const {
    environment = process.env.NODE_ENV,
    release = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    enableInDev = false
  } = options;

  // Nu inițializa în dev decât dacă este specificat
  if (process.env.NODE_ENV === 'development' && !enableInDev) {
    console.log('Monitorizarea erorilor este dezactivată în mediul de dezvoltare');
    return;
  }

  // Verifică dacă DSN-ul este disponibil
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) {
    console.warn('Sentry DSN lipsește, monitorizarea erorilor nu va funcționa');
    return;
  }

  Sentry.init({
    dsn,
    environment,
    release,
    integrations: [
      new Sentry.BrowserTracing({
        // Set sampling rate for performance monitoring
        tracesSampleRate: 0.2,
      }),
    ],
    // Ajustează sample rate-ul pentru performanță
    tracesSampleRate: 0.2,
    // Activează profiling în producție
    profilesSampleRate: environment === 'production' ? 0.1 : 0,
    // Nu trimite erori dacă utilizatorul este în blacklist
    beforeSend(event) {
      // Poți adăuga logică suplimentară aici pentru a filtra anumite erori
      return event;
    },
  });
}

// Wrapper pentru a captura erori și a oferi un fallback
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  FallbackComponent: React.ComponentType<{ error: Error }> = DefaultErrorFallback
): React.FC<P> {
  return Sentry.withErrorBoundary(Component, {
    fallback: (props) => <FallbackComponent error={props.error} />,
  });
}

// Componenta implicită de afișare pentru erori
const DefaultErrorFallback: React.FC<{ error: Error }> = ({ error }) => (
  <div className="p-4 bg-red-50 border border-red-300 rounded">
    <h3 className="text-lg font-medium text-red-800">A apărut o eroare</h3>
    <p className="mt-2 text-sm text-red-700">
      Ceva nu a funcționat corect. Am înregistrat eroarea și o vom investiga.
    </p>
    {process.env.NODE_ENV !== 'production' && (
      <div className="mt-2 p-2 bg-red-100 rounded overflow-auto">
        <pre className="text-xs text-red-800">{error.message}</pre>
        <pre className="text-xs text-red-800">{error.stack}</pre>
      </div>
    )}
    <button
      className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      onClick={() => window.location.reload()}
    >
      Reîncarcă pagina
    </button>
  </div>
);

// Funcție pentru logarea erorilor manuale
export function logError(error: Error, context?: Record<string, any>) {
  console.error(error);
  Sentry.captureException(error, { extra: context });
}

// Hook pentru a captura erori în componente funcționale
export function useErrorHandler() {
  return {
    captureError: (error: Error, context?: Record<string, any>) => {
      logError(error, context);
    },
    captureMessage: (message: string, level?: Sentry.SeverityLevel) => {
      Sentry.captureMessage(message, level);
    }
  };
}
