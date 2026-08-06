#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Script pour lancer le site web et l'API en parallèle
 * Alternative à concurrently si vous préférez un script personnalisé
 */

const { spawn } = require('child_process');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Chemins relatifs
const webPath = process.cwd();
const apiPath = path.join(webPath, '..', 'api-amifidele');

log('🚀 Démarrage du site web et de l\'API...\n', 'yellow');

// Lancer le site web (Next.js)
const webProcess = spawn('npm', ['run', 'dev'], {
  cwd: webPath,
  stdio: 'inherit',
  shell: true,
});

// Lancer l'API
const apiProcess = spawn('npm', ['run', 'dev'], {
  cwd: apiPath,
  stdio: 'inherit',
  shell: true,
});

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
  log('\n\n⏹️  Arrêt des services...', 'yellow');
  webProcess.kill();
  apiProcess.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  webProcess.kill();
  apiProcess.kill();
  process.exit(0);
});

// Gestion des erreurs
webProcess.on('error', (error) => {
  log(`❌ Erreur lors du démarrage du site web: ${error.message}`, 'red');
});

apiProcess.on('error', (error) => {
  log(`❌ Erreur lors du démarrage de l'API: ${error.message}`, 'red');
});

webProcess.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    log(`⚠️  Le site web s'est arrêté avec le code ${code}`, 'yellow');
  }
});

apiProcess.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    log(`⚠️  L'API s'est arrêtée avec le code ${code}`, 'yellow');
  }
});


