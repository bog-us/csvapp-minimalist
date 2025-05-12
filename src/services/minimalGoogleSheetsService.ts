// src/services/minimalGoogleSheetsService.ts
import { CasaSchimbType, PunctSchimbType, DateFinanciareType } from '../types';
import { logError } from '../utils/errorMonitoring';

// Date de exemplu pentru a evita apeluri API în prima versiune
const MOCK_DATA = {
  caseSchimb: [
    {
      "COD CASA  CU S": "CS123",
      "DENUMIRE CASA": "Exchange House 1",
      "COD FISCAL CASA": 12345678,
      "COD CASA FARA S": 123,
      "SEDIU SOCIAL": "Calea Victoriei 1, București",
      "DATA SEDINTA AUTORIZARE CASA DE SCHIMB": "2022-01-15",
      "DATA AUTORIZARE CASA": "2022-01-30",
      "VALABILITATE CASA": "2025-01-30",
      "JUDET / SECTOR CASA": "București Sectorul 1",
      "DATA INCHIDERE CASA": ""
    },
    {
      "COD CASA  CU S": "CS456",
      "DENUMIRE CASA": "Exchange House 2",
      "COD FISCAL CASA": 23456789,
      "COD CASA FARA S": 456,
      "SEDIU SOCIAL": "Strada Republicii 10, Cluj-Napoca",
      "DATA SEDINTA AUTORIZARE CASA DE SCHIMB": "2021-10-05",
      "DATA AUTORIZARE CASA": "2021-10-20",
      "VALABILITATE CASA": "2024-10-20",
      "JUDET / SECTOR CASA": "Cluj",
      "DATA INCHIDERE CASA": ""
    },
    {
      "COD CASA  CU S": "CS789",
      "DENUMIRE CASA": "Exchange House 3",
      "COD FISCAL CASA": 34567890,
      "COD CASA FARA S": 789,
      "SEDIU SOCIAL": "Bulevardul Independenței 25, Iași",
      "DATA SEDINTA AUTORIZARE CASA DE SCHIMB": "2020-05-12",
      "DATA AUTORIZARE CASA": "2020-05-25",
      "VALABILITATE CASA": "2023-05-25",
      "JUDET / SECTOR CASA": "Iași",
      "DATA INCHIDERE CASA": "2023-06-01"
    }
  ] as CasaSchimbType[],
  
  puncteSchimb: [
    {
      "COD CASA  CU S": "CS123",
      "COD PUNCT": "P001",
      "ADRESA PUNCT": "Calea Victoriei 1, București",
      "DATA SEDINTA AUTORIZARE PUNCT DE LUCRU": "2022-01-15",
      "DATA INCHIDERE PUNCT": "",
      "DENUMIRE CASA": "Exchange House 1",
      "DATA AUTORIZARE PUNCT": "2022-01-30",
      "VALABILITATE PUNCT": "2025-01-30",
      "JUDET / SECTOR PUNCT": "București Sectorul 1",
      "isActive": true
    },
    {
      "COD CASA  CU S": "CS123",
      "COD PUNCT": "P002",
      "ADRESA PUNCT": "Strada Lipscani 20, București",
      "DATA SEDINTA AUTORIZARE PUNCT DE LUCRU": "2022-02-10",
      "DATA INCHIDERE PUNCT": "",
      "DENUMIRE CASA": "Exchange House 1",
      "DATA AUTORIZARE PUNCT": "2022-02-25",
      "VALABILITATE PUNCT": "2025-02-25",
      "JUDET / SECTOR PUNCT": "București Sectorul 3",
      "isActive": true
    },
    {
      "COD CASA  CU S": "CS456",
      "COD PUNCT": "P003",
      "ADRESA PUNCT": "Strada Republicii 10, Cluj-Napoca",
      "DATA SEDINTA AUTORIZARE PUNCT DE LUCRU": "2021-10-05",
      "DATA INCHIDERE PUNCT": "",
      "DENUMIRE CASA": "Exchange House 2",
      "DATA AUTORIZARE PUNCT": "2021-10-20",
      "VALABILITATE PUNCT": "2024-10-20",
      "JUDET / SECTOR PUNCT": "Cluj",
      "isActive": true
    },
    {
      "COD CASA  CU S": "CS456",
      "COD PUNCT": "P004",
      "ADRESA PUNCT": "Strada Horea 5, Cluj-Napoca",
      "DATA SEDINTA AUTORIZARE PUNCT DE LUCRU": "2021-11-15",
      "DATA INCHIDERE PUNCT": "",
      "DENUMIRE CASA": "Exchange House 2",
      "DATA AUTORIZARE PUNCT": "2021-11-30",
      "VALABILITATE PUNCT": "2024-11-30",
      "JUDET / SECTOR PUNCT": "Cluj",
      "isActive": true
    },
    {
      "COD CASA  CU S": "CS789",
      "COD PUNCT": "P005",
      "ADRESA PUNCT": "Bulevardul Independenței 25, Iași",
      "DATA SEDINTA AUTORIZARE PUNCT DE LUCRU": "2020-05-12",
      "DATA INCHIDERE PUNCT": "2023-06-01",
      "DENUMIRE CASA": "Exchange House 3",
      "DATA AUTORIZARE PUNCT": "2020-05-25",
      "VALABILITATE PUNCT": "2023-05-25",
      "JUDET / SECTOR PUNCT": "Iași",
      "isActive": false
    }
  ] as PunctSchimbType[],
  
  dateFinanciare: [
    {
      "AN DE REFERINTA": 2022,
      "CUI": 12345678,
      "DENUMIRE": "Exchange House 1",
      "ARE_BILANT_DA/NU": "DA",
      "NR_MEDIU SALARIATI": 10,
      "FOND_SALARII": 500000,
      "PROFIT_PIERDERE": 350000,
      "INCASARI LA BUGETUL GENESAL CONSOLIDAT": 120000,
      "INCASARI LA BUGETUL DE STAT": 70000,
      "INCASARI BAS (PENSII)": 30000,
      "INCASARI BASS (SANATATE)": 15000,
      "SOMAJ": "5000"
    },
    {
      "AN DE REFERINTA": 2022,
      "CUI": 23456789,
      "DENUMIRE": "Exchange House 2",
      "ARE_BILANT_DA/NU": "DA",
      "NR_MEDIU SALARIATI": 15,
      "FOND_SALARII": 750000,
      "PROFIT_PIERDERE": 420000,
      "INCASARI LA BUGETUL GENESAL CONSOLIDAT": 150000,
      "INCASARI LA BUGETUL DE STAT": 85000,
      "INCASARI BAS (PENSII)": 40000,
      "INCASARI BASS (SANATATE)": 20000,
      "SOMAJ": "5000"
    },
    {
      "AN DE REFERINTA": 2022,
      "CUI": 34567890,
      "DENUMIRE": "Exchange House 3",
      "ARE_BILANT_DA/NU": "DA",
      "NR_MEDIU SALARIATI": 5,
      "FOND_SALARII": 250000,
      "PROFIT_PIERDERE": -50000,
      "INCASARI LA BUGETUL GENESAL CONSOLIDAT": 30000,
      "INCASARI LA BUGETUL DE STAT": 15000,
      "INCASARI BAS (PENSII)": 10000,
      "INCASARI BASS (SANATATE)": 4000,
      "SOMAJ": "1000"
    }
  ] as DateFinanciareType[]
};

// Verifică dacă API-ul ar trebui să fie folosit sau să folosim date statice
const shouldUseRealAPI = () => {
  return (
    process.env.NEXT_PUBLIC_USE_REAL_API === 'true' && 
    !!process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY
  );
};

// Implementare minimală care poate fi extinsă treptat
const MinimalGoogleSheetsService = {
  // Case de schimb
  getCaseSchimb: async (): Promise<CasaSchimbType[]> => {
    if (!shouldUseRealAPI()) {
      console.log('Folosim date statice pentru case de schimb');
      return MOCK_DATA.caseSchimb;
    }
    
    try {
      // Încearcă să folosească API-ul real
      const response = await fetch('/api/caseSchimb');
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      logError(error as Error, { service: 'googleSheets', method: 'getCaseSchimb' });
      console.error('Eroare la preluarea datelor despre case de schimb:', error);
      
      // Fallback la date de exemplu în caz de eroare
      return MOCK_DATA.caseSchimb;
    }
  },
  
  // Puncte de schimb
  getPuncteSchimb: async (): Promise<PunctSchimbType[]> => {
    if (!shouldUseRealAPI()) {
      console.log('Folosim date statice pentru puncte de schimb');
      return MOCK_DATA.puncteSchimb;
    }
    
    try {
      // Încearcă să folosească API-ul real
      const response = await fetch('/api/puncteSchimb');
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      logError(error as Error, { service: 'googleSheets', method: 'getPuncteSchimb' });
      console.error('Eroare la preluarea datelor despre puncte de schimb:', error);
      
      // Fallback la date de exemplu în caz de eroare
      return MOCK_DATA.puncteSchimb;
    }
  },
  
  // Date financiare
  getDateFinanciare: async (): Promise<DateFinanciareType[]> => {
    if (!shouldUseRealAPI()) {
      console.log('Folosim date statice pentru date financiare');
      return MOCK_DATA.dateFinanciare;
    }
    
    try {
      // Încearcă să folosească API-ul real
      const response = await fetch('/api/dateFinanciare');
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      logError(error as Error, { service: 'googleSheets', method: 'getDateFinanciare' });
      console.error('Eroare la preluarea datelor financiare:', error);
      
      // Fallback la date de exemplu în caz de eroare
      return MOCK_DATA.dateFinanciare;
    }
  },
  
  // Date angajați
  getDateAngajati: async (): Promise<any[]> => {
    // Pentru versiunea minimală, returnăm un array gol
    return [];
  },
  
  // Invalidare cache - implementare simplă
  invalidateCache: (): void => {
    console.log('Cache invalidat (implementare minimală)');
  },
  
  // Polling - implementare simplă care nu face nimic
  setupPolling: (intervalMinutes: number = 5, onDataUpdated?: () => void): () => void => {
    console.log(`Polling configurat la ${intervalMinutes} minute (implementare minimală)`);
    return () => {}; // Funcție de cleanup care nu face nimic
  }
};

export default MinimalGoogleSheetsService;
