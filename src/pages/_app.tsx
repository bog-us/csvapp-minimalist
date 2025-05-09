// src/pages/_app.tsx
import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from '../context/AuthContext';
import { FeatureFlagsProvider, getInitialFlags } from '../utils/featureFlags';
import { initErrorMonitoring } from '../utils/errorMonitoring';
import '../styles/globals.css';

// Inițializează monitorizarea erorilor cât mai devreme
if (typeof window !== 'undefined') {
  initErrorMonitoring();
}

// Creează un QueryClient pentru React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000
    }
  }
});

function DeploymentMonitor() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      console.log('Deployment version:', process.env.NEXT_PUBLIC_APP_VERSION);
      
      // Log feature flags pentru debugging
      const flags = getInitialFlags();
      console.log('Active feature flags:', 
        Object.entries(flags)
          .filter(([_, value]) => value)
          .map(([key]) => key)
      );
      
      // Verifică variabilele de mediu esențiale
      const envCheck = {
        firebase: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        sheets: !!process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY,
        anthropic: !!process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
        openai: !!process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      };
      
      console.log('Environment checks:', envCheck);
    }
  }, []);
  
  return null;
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FeatureFlagsProvider initialFlags={getInitialFlags()}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <DeploymentMonitor />
          <Component {...pageProps} />
        </AuthProvider>
      </QueryClientProvider>
    </FeatureFlagsProvider>
  );
}

export default MyApp;
