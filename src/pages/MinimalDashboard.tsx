// src/pages/MinimalDashboard.tsx
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useFeatureFlags } from '../utils/featureFlags';
import { withErrorBoundary } from '../utils/errorMonitoring';

// Importă conditionate pentru componentele care pot cauza probleme
const StatusChart = React.lazy(() => import('../components/vizualizari/StatusChart'));
const CountyDistributionMap = React.lazy(() => 
  import('../components/vizualizari/county-distribution-map')
);
const BucharestSectorsMap = React.lazy(() => 
  import('../components/vizualizari/bucharest-sectors-map')
);
const FinancialAnalysis = React.lazy(() => 
  import('../components/vizualizari/FinancialAnalysis')
);
const TimelineChart = React.lazy(() => 
  import('../components/vizualizari/TimelineChart')
);
const TopExchangeHouses = React.lazy(() => 
  import('../components/vizualizari/TopExchangeHouses')
);
const DataAnalysisLLM = React.lazy(() => 
  import('../components/analiza/DataAnalysisLLM')
);
const FilterPanel = React.lazy(() => 
  import('../components/filtre/FilterPanel')
);

const MinimalDashboard: React.FC = () => {
  const { flags } = useFeatureFlags();
  const [activeTab, setActiveTab] = useState<'general' | 'geo' | 'financiar' | 'analiza-ai'>('general');
  const [geoTab, setGeoTab] = useState<'judete' | 'bucuresti'>('judete');
  
  // Variabile placeholder pentru date
  const mockData = {
    totalCaseActive: 120,
    totalPuncteActive: 450,
    uniqueJudete: 32
  };
  
  // Funcție pentru a gestiona erori la încărcarea lazy
  const LazyComponent = ({ 
    component: Component, 
    isEnabled,
    fallback,
    ...props 
  }: { 
    component: any, 
    isEnabled: boolean,
    fallback: React.ReactNode,
    [key: string]: any 
  }) => {
    if (!isEnabled) return fallback;

    return (
      <React.Suspense fallback={<div className="animate-pulse bg-gray-200 h-48 rounded-lg"></div>}>
        <Component {...props} />
      </React.Suspense>
    );
  };
  
  return (
    <div className="dashboard-container bg-gray-50 min-h-screen pb-8">
      <Helmet>
        <title>Dashboard | Case de Schimb Valutar</title>
      </Helmet>
      
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard Case de Schimb Valutar
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Ultima actualizare: {new Date().toLocaleString()}
            </span>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Carduri cu sumar statistici */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">Case de Schimb</p>
                <p className="text-2xl font-bold">{mockData.totalCaseActive}</p>
              </div>
              <div className="rounded-full p-2 bg-blue-100 h-10 w-10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">Puncte de Schimb</p>
                <p className="text-2xl font-bold">{mockData.totalPuncteActive}</p>
              </div>
              <div className="rounded-full p-2 bg-green-100 h-10 w-10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">Acoperire Teritorială</p>
                <p className="text-2xl font-bold">{mockData.uniqueJudete}</p>
              </div>
              <div className="rounded-full p-2 bg-purple-100 h-10 w-10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Panoul de filtrare - condiționat */}
        {flags.enableFilters && (
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Filtre</h3>
              <LazyComponent 
                component={FilterPanel} 
                isEnabled={flags.enableFilters}
                fallback={<div className="h-16 bg-gray-100 rounded animate-pulse"></div>}
                filters={{}} 
                updateFilters={() => {}} 
              />
            </div>
          </div>
        )}
        
        {/* Tab-uri principale */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                className={`py-4 px-6 text-center font-medium ${
                  activeTab === 'general'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('general')}
              >
                Statistici Generale
              </button>
              
              <button
                className={`py-4 px-6 text-center font-medium ${
                  activeTab === 'geo'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('geo')}
              >
                Distribuție Geografică
              </button>
              
              <button
                className={`py-4 px-6 text-center font-medium ${
                  activeTab === 'financiar'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('financiar')}
              >
                Analiză Financiară
              </button>
              
              <button
                className={`py-4 px-6 text-center font-medium ${
                  activeTab === 'analiza-ai'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('analiza-ai')}
              >
                Analiză AI
              </button>
            </nav>
          </div>
          
          {/* Conținutul tab-ului activ */}
          <div className="p-4 md:p-6">
            {activeTab === 'general' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">Tipuri de puncte de schimb</h3>
                  {/* StatusChart condiționat */}
                  <LazyComponent 
                    component={StatusChart} 
                    isEnabled={flags.enableStatusChart}
                    fallback={<div className="h-64 bg-gray-100 rounded animate-pulse flex items-center justify-center">
                      <p className="text-gray-500">Chart dezactivat în această versiune</p>
                    </div>}
                  />
                </div>
                
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">Top case după număr de puncte</h3>
                  {/* TopExchangeHouses condiționat */}
                  <LazyComponent 
                    component={TopExchangeHouses} 
                    isEnabled={flags.enableTopExchanges}
                    fallback={<div className="h-64 bg-gray-100 rounded animate-pulse flex items-center justify-center">
                      <p className="text-gray-500">Chart dezactivat în această versiune</p>
                    </div>}
                  />
                </div>
                
                <div className="bg-white p-4 rounded-lg border md:col-span-2">
                  <h3 className="text-lg font-semibold mb-4">Evoluție temporală</h3>
                  {/* TimelineChart condiționat */}
                  <LazyComponent 
                    component={TimelineChart} 
                    isEnabled={flags.enableTimelineChart}
                    fallback={<div className="h-64 bg-gray-100 rounded animate-pulse flex items-center justify-center">
                      <p className="text-gray-500">Chart dezactivat în această versiune</p>
                    </div>}
                  />
                </div>
              </div>
            )}
            
            {activeTab === 'geo' && (
              <div>
                <div className="mb-4 flex space-x-2">
                  <button
                    className={`px-4 py-2 rounded ${
                      geoTab === 'judete' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
                    onClick={() => setGeoTab('judete')}
                  >
                    Județe
                  </button>
                  <button
                    className={`px-4 py-2 rounded ${
                      geoTab === 'bucuresti' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
                    onClick={() => setGeoTab('bucuresti')}
                  >
                    București
                  </button>
                </div>
                
                {geoTab === 'judete' && (
                  <LazyComponent 
                    component={CountyDistributionMap} 
                    isEnabled={flags.enableCountyMap}
                    fallback={<div className="h-96 bg-gray-100 rounded animate-pulse flex items-center justify-center">
                      <p className="text-gray-500">Hartă județe dezactivată în această versiune</p>
                    </div>}
                  />
                )}
                
                {geoTab === 'bucuresti' && (
                  <LazyComponent 
                    component={BucharestSectorsMap} 
                    isEnabled={flags.enableBucharestMap}
                    fallback={<div className="h-96 bg-gray-100 rounded animate-pulse flex items-center justify-center">
                      <p className="text-gray-500">Hartă București dezactivată în această versiune</p>
                    </div>}
                  />
                )}
              </div>
            )}
            
            {activeTab === 'financiar' && (
              <LazyComponent 
                component={FinancialAnalysis} 
                isEnabled={flags.enableFinancialAnalysis}
                fallback={<div className="h-96 bg-gray-100 rounded animate-pulse flex items-center justify-center">
                  <p className="text-gray-500">Analiză financiară dezactivată în această versiune</p>
                </div>}
              />
            )}
            
            {activeTab === 'analiza-ai' && (
              <LazyComponent 
                component={DataAnalysisLLM} 
                isEnabled={flags.enableLLMAnalysis}
                fallback={<div className="h-96 bg-gray-100 rounded animate-pulse flex items-center justify-center">
                  <p className="text-gray-500">Analiză AI dezactivată în această versiune</p>
                </div>}
              />
            )}
          </div>
        </div>
        
        {/* Panou Dev pentru gestionarea feature flags - vizibil doar în dev */}
        {process.env.NODE_ENV !== 'production' && (
          <div className="mt-8 bg-gray-800 text-white p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Developer Controls</h3>
            <p className="text-sm mb-4">Activează/dezactivează componente pentru testare</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(flags).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={key}
                    checked={value}
                    onChange={(e) => {
                      const { updateFlag } = useFeatureFlags();
                      updateFlag(key as any, e.target.checked);
                    }}
                    className="mr-2"
                  />
                  <label htmlFor={key} className="text-sm">{key}</label>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default withErrorBoundary(MinimalDashboard);
