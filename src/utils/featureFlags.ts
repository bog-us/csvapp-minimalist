// src/utils/featureFlags.ts
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

// Definirea tuturor feature flags disponibile
export interface FeatureFlags {
  // Componente de vizualizare
  enableCountyMap: boolean;
  enableBucharestMap: boolean;
  enableFinancialAnalysis: boolean;
  enableTimelineChart: boolean;
  enableStatusChart: boolean;
  enableTopExchanges: boolean;
  
  // Integrări servicii externe
  enableFirebaseAuth: boolean;
  enableLLMAnalysis: boolean;
  enableGoogleSheets: boolean;
  
  // Funcționalități avansate
  enableExport: boolean;
  enableFilters: boolean;
  enableRealTimeSync: boolean;
}

// Valori implicite - toate dezactivate inițial pentru deployment minimal
const DEFAULT_FLAGS: FeatureFlags = {
  enableCountyMap: false,
  enableBucharestMap: false,
  enableFinancialAnalysis: false,
  enableTimelineChart: false,
  enableStatusChart: false,
  enableTopExchanges: false,
  
  enableFirebaseAuth: false,
  enableLLMAnalysis: false,
  enableGoogleSheets: false,
  
  enableExport: false,
  enableFilters: false,
  enableRealTimeSync: false,
};

// Flags active în mediul de dezvoltare
const DEV_FLAGS: FeatureFlags = {
  ...DEFAULT_FLAGS,
  // Activează tot în dezvoltare
  enableCountyMap: true,
  enableBucharestMap: true,
  enableFinancialAnalysis: true,
  enableTimelineChart: true,
  enableStatusChart: true,
  enableTopExchanges: true,
  
  enableFirebaseAuth: true,
  enableLLMAnalysis: true,
  enableGoogleSheets: true,
  
  enableExport: true,
  enableFilters: true,
  enableRealTimeSync: true,
};

// Flags active în producție - se vor activa treptat
export const PROD_FLAGS: FeatureFlags = {
  ...DEFAULT_FLAGS,
  // Începem doar cu aceste funcționalități de bază
  enableFirebaseAuth: true,
  enableStatusChart: true,
  enableFilters: true,
};

// Obține flags în funcție de environment
export function getInitialFlags(): FeatureFlags {
  // Verifică dacă rulate în browser
  if (typeof window === 'undefined') {
    return process.env.NODE_ENV === 'production' ? PROD_FLAGS : DEV_FLAGS;
  }
  
  // Verifică dacă există flags salvate în localStorage
  const savedFlags = localStorage.getItem('featureFlags');
  if (savedFlags) {
    try {
      return JSON.parse(savedFlags);
    } catch (error) {
      console.error('Eroare la parsarea feature flags din localStorage:', error);
    }
  }
  
  // Folosește flags implicite pentru environment
  return process.env.NODE_ENV === 'production' ? PROD_FLAGS : DEV_FLAGS;
}

// Context pentru Feature Flags
const FeatureFlagsContext = createContext<{
  flags: FeatureFlags;
  updateFlag: (key: keyof FeatureFlags, value: boolean) => void;
  enableAllFlags: () => void;
  disableAllFlags: () => void;
}>({
  flags: DEFAULT_FLAGS,
  updateFlag: () => {},
  enableAllFlags: () => {},
  disableAllFlags: () => {},
});

export const useFeatureFlags = () => useContext(FeatureFlagsContext);

interface FeatureFlagsProviderProps {
  children: ReactNode;
  initialFlags?: FeatureFlags;
}

export function FeatureFlagsProvider({ 
  children, 
  initialFlags 
}: FeatureFlagsProviderProps) {
  const [flags, setFlags] = useState<FeatureFlags>(initialFlags || DEFAULT_FLAGS);
  
  // Sincronizează flags cu localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('featureFlags', JSON.stringify(flags));
    }
  }, [flags]);
  
  const updateFlag = (key: keyof FeatureFlags, value: boolean) => {
    setFlags(prevFlags => ({
      ...prevFlags,
      [key]: value
    }));
  };
  
  const enableAllFlags = () => {
    const allEnabled = Object.keys(flags).reduce((obj, key) => {
      return {
        ...obj,
        [key]: true
      };
    }, {} as FeatureFlags);
    
    setFlags(allEnabled);
  };
  
  const disableAllFlags = () => {
    const allDisabled = Object.keys(flags).reduce((obj, key) => {
      return {
        ...obj,
        [key]: false
      };
    }, {} as FeatureFlags);
    
    setFlags(allDisabled);
  };
  
  return (
    <FeatureFlagsContext.Provider 
      value={{ 
        flags, 
        updateFlag, 
        enableAllFlags, 
        disableAllFlags 
      }}
    >
      {children}
    </FeatureFlagsContext.Provider>
  );
}

// HOC pentru a condiționa renderizarea componentelor
export function withFeatureFlag<P extends object>(
  Component: React.ComponentType<P>,
  flagName: keyof FeatureFlags
): React.FC<P> {
  return (props: P) => {
    const { flags } = useFeatureFlags();
    
    if (!flags[flagName]) {
      return null;
    }
    
    return <Component {...props} />;
  };
}

// Hook pentru a verifica existența unui flag
export function useFeatureFlag(flagName: keyof FeatureFlags): boolean {
  const { flags } = useFeatureFlags();
  return flags[flagName];
}
