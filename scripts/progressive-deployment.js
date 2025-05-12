// scripts/progressive-deployment.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Script pentru deployment progresiv al aplicației
 * Acest script activează treptat feature flags și monitorizează deployment-ul
 */

// Fișierul cu flags de funcționalitate
const featureFlagsPath = path.join(__dirname, '../src/utils/featureFlags.ts');

// Etapele de deployment
const stages = [
  {
    name: 'Minimal',
    description: 'Deployment minimal cu doar structura de bază și autentificare',
    flags: {
      enableFirebaseAuth: true,
      enableStatusChart: true,
      enableFilters: true,
    }
  },
  {
    name: 'Basic Visualizations',
    description: 'Adaugă vizualizări de bază fără hărți complexe',
    flags: {
      enableFirebaseAuth: true,
      enableStatusChart: true,
      enableFilters: true,
      enableTopExchanges: true,
      enableTimelineChart: true,
    }
  },
  {
    name: 'Complete Visualizations',
    description: 'Adaugă toate vizualizările inclusiv hărți',
    flags: {
      enableFirebaseAuth: true,
      enableStatusChart: true,
      enableFilters: true,
      enableTopExchanges: true,
      enableTimelineChart: true,
      enableCountyMap: true,
      enableBucharestMap: true,
      enableFinancialAnalysis: true,
    }
  },
  {
    name: 'Full App',
    description: 'Activează toate funcționalitățile aplicației',
    flags: {
      enableFirebaseAuth: true,
      enableStatusChart: true,
      enableFilters: true,
      enableTopExchanges: true,
      enableTimelineChart: true,
      enableCountyMap: true,
      enableBucharestMap: true,
      enableFinancialAnalysis: true,
      enableLLMAnalysis: true,
      enableGoogleSheets: true,
      enableExport: true,
      enableRealTimeSync: true,
    }
  },
];

// Funcția pentru actualizarea flagurilor în fișierul sursă
function updateFeatureFlags(stageFlags) {
  try {
    let content = fs.readFileSync(featureFlagsPath, 'utf8');
    
    // Caută secțiunea PROD_FLAGS în fișier
    const prodFlagsRegex = /export const PROD_FLAGS: FeatureFlags = \{([^}]+)\};/;
    const match = content.match(prodFlagsRegex);
    
    if (!match) {
      console.error('Nu s-a putut găsi secțiunea PROD_FLAGS în fișier');
      process.exit(1);
    }
    
    // Construiește noua secțiune de flags
    let newProdFlags = 'export const PROD_FLAGS: FeatureFlags = {\n  ...DEFAULT_FLAGS,\n';
    
    // Adaugă fiecare flag activat
    Object.entries(stageFlags).forEach(([flag, value]) => {
      if (value) {
        newProdFlags += `  ${flag}: true,\n`;
      }
    });
    
    newProdFlags += '};';
    
    // Înlocuiește secțiunea în fișier
    const updatedContent = content.replace(prodFlagsRegex, newProdFlags);
    
    // Scrie noul conținut
    fs.writeFileSync(featureFlagsPath, updatedContent, 'utf8');
    console.log('Flags actualizate cu succes!');
    
  } catch (error) {
    console.error('Eroare la actualizarea flags:', error);
    process.exit(1);
  }
}

// Funcția de backup pentru fișier
function backupFile(filePath) {
  const backupPath = `${filePath}.backup`;
  fs.copyFileSync(filePath, backupPath);
  console.log(`Backup creat: ${backupPath}`);
}

// Funcția principală
function main() {
  const args = process.argv.slice(2);
  
  // Afișare help
  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node progressive-deployment.js [options]');
    console.log('');
    console.log('Options:');
    console.log('  --stage <number>   Specifică etapa de deployment (1-4)');
    console.log('  --list             Afișează toate etapele disponibile');
    console.log('  --backup           Crează un backup al fișierelor înainte de modificare');
    console.log('  --deploy           Execută și un deployment după actualizarea flags');
    console.log('');
    process.exit(0);
  }
  
  // Afișare listă etape
  if (args.includes('--list')) {
    console.log('Etape de deployment disponibile:');
    stages.forEach((stage, index) => {
      console.log(`${index + 1}. ${stage.name}: ${stage.description}`);
      console.log('   Flags activate:');
      Object.entries(stage.flags).forEach(([flag, value]) => {
        if (value) console.log(`   - ${flag}`);
      });
      console.log('');
    });
    process.exit(0);
  }
  
  // Creare backup
  if (args.includes('--backup')) {
    backupFile(featureFlagsPath);
  }
  
  // Determinare etapă
  let stageIndex = 0;
  const stageArgIndex = args.indexOf('--stage');
  if (stageArgIndex !== -1 && args.length > stageArgIndex + 1) {
    stageIndex = parseInt(args[stageArgIndex + 1], 10) - 1;
    
    if (isNaN(stageIndex) || stageIndex < 0 || stageIndex >= stages.length) {
      console.error(`Etapă invalidă. Folosiți un număr între 1 și ${stages.length}`);
      process.exit(1);
    }
  } else {
    console.error('Nu s-a specificat etapa. Folosiți --stage <număr>');
    process.exit(1);
  }
  
  // Selectăm etapa și actualizăm flags
  const selectedStage = stages[stageIndex];
  console.log(`Pregătire pentru deployment etapă ${stageIndex + 1}: ${selectedStage.name}`);
  console.log(selectedStage.description);
  
  // Actualizăm flags
  updateFeatureFlags(selectedStage.flags);
  
  // Deployment dacă este solicitat
  if (args.includes('--deploy')) {
    console.log('Executare deployment...');
    try {
      // Adăugăm și versiunea în env
      process.env.NEXT_PUBLIC_APP_VERSION = `1.0.0-stage${stageIndex + 1}`;
      
      // Executăm build și deploy
      execSync('npm run build', { stdio: 'inherit' });
      execSync('npx vercel --prod', { stdio: 'inherit' });
      
      console.log('Deployment finalizat cu succes!');
    } catch (error) {
      console.error('Eroare la deployment:', error);
      process.exit(1);
    }
  }
  
  console.log('Operațiune completă!');
}

// Executare script
main();
