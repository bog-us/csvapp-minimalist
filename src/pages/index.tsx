import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useFeatureFlags } from '../utils/featureFlags';
import Link from 'next/link';

export default function Home() {
  const { currentUser } = useAuth();
  const { flags } = useFeatureFlags();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-6">Aplicație Case de Schimb Valutar</h1>
      
      <div className="mb-8 text-center max-w-md">
        <p className="text-gray-600 mb-4">
          Bine ai venit la aplicația de vizualizare a datelor despre case de schimb valutar!
        </p>
        
        {currentUser ? (
          <div className="bg-green-50 p-4 rounded-md border border-green-200">
            <p className="text-green-800">
              Autentificat ca: <span className="font-semibold">{currentUser.email}</span>
            </p>
          </div>
        ) : (
          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
            <p className="text-yellow-800">Nu ești autentificat</p>
          </div>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Pagini disponibile:</h2>
        
        <ul className="space-y-3">
          <li>
            <Link href="/MainDashboard" className="text-blue-600 hover:underline block bg-blue-50 p-3 rounded-md">
              Dashboard Principal
            </Link>
          </li>
          {currentUser ? (
            <li>
              <button 
                className="bg-red-100 text-red-700 p-3 rounded-md w-full text-left"
                onClick={() => {
                  const { logout } = useAuth();
                  logout();
                }}
              >
                Deconectare
              </button>
            </li>
          ) : (
            <li>
              <Link href="/login" className="text-blue-600 hover:underline block bg-blue-50 p-3 rounded-md">
                Autentificare
              </Link>
            </li>
          )}
        </ul>
      </div>
      
      {/* Afișează feature flags în mediul de dezvoltare */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-md max-w-md w-full">
          <h3 className="text-lg font-semibold mb-2">Feature Flags active:</h3>
          <ul className="space-y-1 text-sm">
            {Object.entries(flags)
              .filter(([_, value]) => value)
              .map(([key]) => (
                <li key={key} className="text-gray-700">{key}</li>
              ))
            }
          </ul>
        </div>
      )}
    </div>
  );
}
