#!/usr/bin/env node

/**
 * Script de análisis de importaciones
 * Verifica que todas las importaciones se resuelven correctamente
 */

const fs = require('fs');
const path = require('path');

// Colores para terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// ============================================================================
// ANÁLISIS DE IMPORTACIONES
// ============================================================================

function analyzeImports() {
  log('\n╔════════════════════════════════════════════════════════════╗', colors.cyan);
  log('║         ANÁLISIS DE IMPORTACIONES Y DEPENDENCIAS           ║', colors.cyan);
  log('╚════════════════════════════════════════════════════════════╝\n', colors.cyan);
  
  const srcPath = path.join(__dirname);
  const results = {
    filesAnalyzed: 0,
    importsFound: 0,
    validImports: 0,
    invalidImports: 0,
    externalModules: [],
    internalModules: [],
    issues: [],
  };
  
  // Archivos clave a analizar
  const filesToAnalyze = [
    'lib/dev-users.ts',
    'lib/environment.ts',
    'components/auth/AuthProvider.tsx',
    'lib/api-client.ts',
    'components/dashboard/admin-dashboard.tsx',
    'app/api/auth/login/route.ts',
    'app/layout.tsx',
    '__tests__/integration.test.ts',
  ];
  
  log('📋 Archivos analizados:\n', colors.blue);
  
  const importRegex = /import\s+(?:{[^}]*}|[^'"\s]+)\s+from\s+['"]([^'"]+)['"]/g;
  
  filesToAnalyze.forEach(file => {
    const filePath = path.join(srcPath, file);
    
    if (!fs.existsSync(filePath)) {
      log(`  ✗ ${file} - NO ENCONTRADO`, colors.red);
      results.issues.push(`Archivo no encontrado: ${file}`);
      return;
    }
    
    results.filesAnalyzed++;
    log(`  ✓ ${file}`, colors.green);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      let match;
      
      while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        results.importsFound++;
        
        // Clasificar importación
        if (importPath.startsWith('@/')) {
          // Importación interna con alias
          const resolvedPath = importPath.replace('@/', '');
          const resolvedFile = path.join(srcPath, resolvedPath);
          
          // Buscar el archivo (puede ser .ts, .tsx, etc.)
          const variations = [
            resolvedFile,
            resolvedFile + '.ts',
            resolvedFile + '.tsx',
            resolvedFile + '.js',
            path.join(resolvedFile, 'index.ts'),
            path.join(resolvedFile, 'index.tsx'),
          ];
          
          const exists = variations.some(p => fs.existsSync(p));
          
          if (exists) {
            results.validImports++;
            if (!results.internalModules.includes(importPath)) {
              results.internalModules.push(importPath);
            }
          } else {
            results.invalidImports++;
            results.issues.push(`Importación no resuelta en ${file}: ${importPath}`);
            log(`    ⚠ Importación no resuelta: ${importPath}`, colors.yellow);
          }
        } else if (importPath.startsWith('./') || importPath.startsWith('../')) {
          // Importación relativa
          const dir = path.dirname(filePath);
          const resolvedPath = path.resolve(dir, importPath);
          
          const variations = [
            resolvedPath,
            resolvedPath + '.ts',
            resolvedPath + '.tsx',
            resolvedPath + '.js',
            path.join(resolvedPath, 'index.ts'),
            path.join(resolvedPath, 'index.tsx'),
          ];
          
          const exists = variations.some(p => fs.existsSync(p));
          
          if (exists) {
            results.validImports++;
          } else {
            results.invalidImports++;
            results.issues.push(`Importación relativa no resuelta en ${file}: ${importPath}`);
            log(`    ⚠ Importación relativa no resuelta: ${importPath}`, colors.yellow);
          }
        } else {
          // Módulo externo (npm)
          results.validImports++;
          if (!results.externalModules.includes(importPath)) {
            results.externalModules.push(importPath);
          }
        }
      }
    } catch (error) {
      results.issues.push(`Error al analizar ${file}: ${error.message}`);
      log(`    ✗ Error: ${error.message}`, colors.red);
    }
  });
  
  // ========================================================================
  // MÓDULOS EXTERNOS
  // ========================================================================
  log('\n📦 Módulos externos encontrados:\n', colors.blue);
  
  const externalGroups = {
    'React/Next.js': [],
    'UI Components': [],
    'Utilities': [],
    'Other': [],
  };
  
  results.externalModules.forEach(mod => {
    if (mod.includes('react') || mod.includes('next')) {
      externalGroups['React/Next.js'].push(mod);
    } else if (mod.includes('@radix-ui') || mod.includes('shadcn') || mod.includes('lucide')) {
      externalGroups['UI Components'].push(mod);
    } else if (mod.includes('zod') || mod.includes('clsx') || mod.includes('date-fns')) {
      externalGroups['Utilities'].push(mod);
    } else {
      externalGroups['Other'].push(mod);
    }
  });
  
  Object.entries(externalGroups).forEach(([group, mods]) => {
    if (mods.length > 0) {
      log(`  ${group}:`, colors.cyan);
      mods.forEach(mod => log(`    • ${mod}`, colors.green));
    }
  });
  
  // ========================================================================
  // MÓDULOS INTERNOS
  // ========================================================================
  log('\n📁 Módulos internos encontrados:\n', colors.blue);
  
  const internalGroups = {
    'Librerías': [],
    'Componentes': [],
    'Hooks': [],
    'Types': [],
    'Other': [],
  };
  
  results.internalModules.forEach(mod => {
    if (mod.includes('/lib/')) {
      internalGroups['Librerías'].push(mod);
    } else if (mod.includes('/components/')) {
      internalGroups['Componentes'].push(mod);
    } else if (mod.includes('/hooks/')) {
      internalGroups['Hooks'].push(mod);
    } else if (mod.includes('/types/')) {
      internalGroups['Types'].push(mod);
    } else {
      internalGroups['Other'].push(mod);
    }
  });
  
  Object.entries(internalGroups).forEach(([group, mods]) => {
    if (mods.length > 0) {
      log(`  ${group}:`, colors.cyan);
      mods.forEach(mod => log(`    • ${mod}`, colors.green));
    }
  });
  
  // ========================================================================
  // RESUMEN
  // ========================================================================
  log('\n╔════════════════════════════════════════════════════════════╗', colors.cyan);
  log('║                       RESUMEN                              ║', colors.cyan);
  log('╚════════════════════════════════════════════════════════════╝\n', colors.cyan);
  
  log(`Archivos Analizados: ${results.filesAnalyzed}`, colors.green);
  log(`Importaciones Encontradas: ${results.importsFound}`, colors.green);
  log(`Importaciones Válidas: ${results.validImports}`, colors.green);
  log(`Importaciones Inválidas: ${results.invalidImports}`, results.invalidImports > 0 ? colors.red : colors.green);
  log(`Módulos Externos: ${results.externalModules.length}`, colors.green);
  log(`Módulos Internos: ${results.internalModules.length}`, colors.green);
  
  // ========================================================================
  // PROBLEMAS
  // ========================================================================
  if (results.issues.length > 0) {
    log('\n⚠️  Problemas Encontrados:\n', colors.yellow);
    results.issues.forEach(issue => {
      log(`  • ${issue}`, colors.yellow);
    });
  } else {
    log('\n✓ No se encontraron problemas', colors.green);
  }
  
  // ========================================================================
  // CONCLUSIÓN
  // ========================================================================
  const allValid = results.invalidImports === 0;
  
  log('\n' + '═'.repeat(60), colors.cyan);
  if (allValid) {
    log(`✓ ANÁLISIS EXITOSO - Todas las importaciones son válidas`, colors.green);
  } else {
    log(`✗ ANÁLISIS CON PROBLEMAS - ${results.invalidImports} importación(es) inválida(s)`, colors.red);
  }
  log('═'.repeat(60) + '\n', colors.cyan);
  
  return {
    success: allValid,
    results,
  };
}

// ============================================================================
// ANÁLISIS DE DEPENDENCIAS CIRCULARES
// ============================================================================

function checkCircularDependencies() {
  log('🔄 Verificando dependencias circulares...\n', colors.blue);
  
  const srcPath = __dirname;
  const dependencyGraph = {};
  const visited = new Set();
  const recursionStack = new Set();
  
  function buildGraph(filePath, basePath = srcPath) {
    if (!fs.existsSync(filePath)) return;
    
    const content = fs.readFileSync(filePath, 'utf8');
    const importRegex = /import\s+(?:{[^}]*}|[^'"\s]+)\s+from\s+['"]([^'"]+)['"]/g;
    
    const dependencies = [];
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      
      if (importPath.startsWith('@/')) {
        const resolved = path.join(basePath, importPath.replace('@/', ''));
        dependencies.push(resolved);
      }
    }
    
    dependencyGraph[filePath] = dependencies;
  }
  
  function hasCircular(file, visited, recursionStack) {
    visited.add(file);
    recursionStack.add(file);
    
    const dependencies = dependencyGraph[file] || [];
    
    for (const dep of dependencies) {
      if (!visited.has(dep)) {
        if (hasCircular(dep, visited, recursionStack)) {
          return true;
        }
      } else if (recursionStack.has(dep)) {
        return true;
      }
    }
    
    recursionStack.delete(file);
    return false;
  }
  
  // Construir grafo
  const filesToCheck = [
    path.join(srcPath, 'lib/dev-users.ts'),
    path.join(srcPath, 'lib/environment.ts'),
    path.join(srcPath, 'lib/api-client.ts'),
    path.join(srcPath, 'components/auth/AuthProvider.tsx'),
  ];
  
  filesToCheck.forEach(file => buildGraph(file, srcPath));
  
  let hasCircularDeps = false;
  filesToCheck.forEach(file => {
    if (hasCircular(file, new Set(), new Set())) {
      hasCircularDeps = true;
      log(`  ⚠ Dependencia circular detectada en: ${path.relative(srcPath, file)}`, colors.yellow);
    }
  });
  
  if (!hasCircularDeps) {
    log(`  ✓ No se detectaron dependencias circulares\n`, colors.green);
  }
  
  return !hasCircularDeps;
}

// ============================================================================
// MAIN
// ============================================================================

function main() {
  const importResults = analyzeImports();
  const circularCheck = checkCircularDependencies();
  
  const allPassed = importResults.success && circularCheck;
  
  log('\n' + '═'.repeat(60), colors.cyan);
  if (allPassed) {
    log(`✅ ANÁLISIS COMPLETO - PROYECTO EN BUEN ESTADO`, colors.green);
  } else {
    log(`⚠️  ANÁLISIS COMPLETO - REVISAR PROBLEMAS`, colors.yellow);
  }
  log('═'.repeat(60) + '\n', colors.cyan);
  
  process.exit(allPassed ? 0 : 1);
}

main();
