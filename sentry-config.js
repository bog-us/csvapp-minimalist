// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN || 'https://examplePublicKey@o0.ingest.sentry.io/0',
  // Configurare pentru mediul actual
  environment: process.env.NODE_ENV,
  // O performanță mai bună prin sampling
  tracesSampleRate: 0.2,
  // Informații suplimentare doar pentru erori
  integrations: [
    new Sentry.BrowserTracing({
      // Măsoară performanța în client
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(),
    }),
    new Sentry.Replay({
      // Capturează sesiunea pentru debugging
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  // Configurare condiționată pentru replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Activăm doar în producție
  enabled: process.env.NODE_ENV === 'production',
  
  // Reguli de ignorare pentru erori redundante
  ignoreErrors: [
    // Ignoră erori comune de browser
    'top.GLOBALS',
    'originalCreateNotification',
    'canvas.contentDocument',
    'MyApp_RemoveAllHighlights',
    'http://tt.epicplay.com',
    'Can\'t find variable: ZiteReader',
    'jigsaw is not defined',
    'ComboSearch is not defined',
    'http://loading.retry.widdit.com/',
    'atomicFindClose',
    // Erori de rețea
    /ChunkLoadError/,
    /Network Error/,
    // Erori specifice Firebase
    /Firebase: Error \(auth\//,
    // Facebook browser
    /Request aborted/,
    // Erori Google Charts
    /Cannot read property 'getComputedTextLength' of null/,
    // Alte pattern-uri
    /Loading chunk [\d]+ failed/,
    /Loading CSS chunk [\d]+ failed/,
  ],
  
  // Configurație pentru browser
  beforeSend(event) {
    // Verificăm dacă feature flag-urile sunt activate
    const isMonitoringEnabled = 
      typeof window !== 'undefined' && 
      window.localStorage && 
      window.localStorage.getItem('featureFlags') &&
      JSON.parse(window.localStorage.getItem('featureFlags') || '{}').enableErrorMonitoring;
      
    if (!isMonitoringEnabled && process.env.NODE_ENV === 'production') {
      // Nu trimitem evenimentul dacă monitorizarea nu este activată
      return null;
    }
    
    return event;
  },
});
