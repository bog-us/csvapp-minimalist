import React from 'react';
import type { AppProps } from 'next/app';
import { FeatureFlagsProvider, getInitialFlags } from '../utils/featureFlags';
import { AuthProvider } from '../context/AuthContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FeatureFlagsProvider initialFlags={getInitialFlags()}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </FeatureFlagsProvider>
  );
}

export default MyApp;
