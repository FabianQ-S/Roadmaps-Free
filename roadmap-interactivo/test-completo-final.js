// =========================================================================
// 🧪 SCRIPT COMPLETO DE PRUEBAS - ROADMAP INTERACTIVO
// =========================================================================
// 
// INSTRUCCIONES:
// 1. Abrir http://localhost:5173 en el navegador
// 2. Abrir DevTools (F12) y ir a la pestaña Console
// 3. Copiar y pegar este código completo
// 4. Ejecutar: testAll()
//
// =========================================================================

console.log('🚀 INICIANDO SCRIPT COMPLETO DE PRUEBAS DEL ROADMAP INTERACTIVO');

// =========================================================================
// 📊 CONFIGURACIÓN DE PRUEBAS
// =========================================================================

const TEST_CONFIG = {
    // Nodos principales por fase
    mainNodes: [
        { id: 1, name: 'HTML/CSS', phase: 1 },
        { id: 2, name: 'JavaScript', phase: 1 },
        { id: 3, name: 'Git/GitHub', phase: 1 },
        { id: 4, name: 'NPM', phase: 2 },
        { id: 5, name: 'Vite', phase: 2 },
        { id: 6, name: 'Vue.js', phase: 2 },
        { id: 7, name: 'React', phase: 2 },
        { id: 8, name: 'TypeScript', phase: 3 },
        { id: 9, name: 'Firebase', phase: 3 },
        { id: 10, name: 'Testing', phase: 3 },
        { id: 11, name: 'Express.js', phase: 4 },
        { id: 12, name: 'Nuxt.js', phase: 4 }
    ],
    
    // Nodos opcionales (los que fueron problemáticos)
    optionalNodes: [
        { id: 13, name: 'Testing Library', phase: 2 },
        { id: 14, name: 'PWAs', phase: 2 },
        { id: 15, name: 'GraphQL', phase: 2 },
        { id: 16, name: 'Puppeteer', phase: 2 },
        { id: 17, name: 'Jest', phase: 3 },
        { id: 18, name: 'Vitest', phase: 3 },
        { id: 19, name: 'Astro', phase: 3 },
        { id: 20, name: 'Expo (RN)', phase: 3 },
        { id: 21, name: 'Electron', phase: 4 },
        { id: 22, name: 'Webpack', phase: 4 },
        { id: 23, name: 'Sass/SCSS', phase: 4 },
        // Nodos críticos que fueron corregidos
        { id: 200, name: 'AdonisJS', phase: 3 },
        { id: 201, name: 'Inertia.js', phase: 3 },
        { id: 202, name: 'Podman', phase: 3 }
    ],
    
    // Nodos de fase (no deben ser clickeables)
    phaseNodes: [
        { id: 100, name: 'Fundamentos', phase: 1 },
        { id: 101, name: 'Frameworks', phase: 2 },
        { id: 102, name: 'Avanzado', phase: 3 },
        { id: 103, name: 'Especialización', phase: 4 }
    ]
};

// =========================================================================
// 🔧 FUNCIONES DE UTILIDAD
// =========================================================================

function log(emoji, message, data = null) {
    console.log(`${emoji} ${message}`);
    if (data) console.log(data);
}

function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }
        
        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Elemento ${selector} no encontrado en ${timeout}ms`));
        }, timeout);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// =========================================================================
// 🧪 FUNCIONES DE PRUEBA
// =========================================================================

async function testNodeExists(nodeId, nodeName) {
    try {
        const selector = `[data-node-id="${nodeId}"], .node[data-id="${nodeId}"], .tech-node[data-id="${nodeId}"]`;
        const node = document.querySelector(selector);
        
        if (node) {
            log('✅', `Nodo encontrado: ${nodeName} (ID: ${nodeId})`);
            return { success: true, element: node };
        } else {
            log('❌', `Nodo NO encontrado: ${nodeName} (ID: ${nodeId})`);
            return { success: false, element: null };
        }
    } catch (error) {
        log('❌', `Error buscando nodo ${nodeName}: ${error.message}`);
        return { success: false, element: null };
    }
}

async function testNodeClick(nodeId, nodeName, shouldWork = true) {
    try {
        const result = await testNodeExists(nodeId, nodeName);
        if (!result.success) {
            return { success: false, reason: 'Nodo no encontrado' };
        }
        
        const node = result.element;
        
        // Simular click
        node.click();
        await sleep(500);
        
        // Verificar si se abrió el modal
        const modal = document.querySelector('.modal-overlay, .node-modal, .modal-content');
        
        if (shouldWork) {
            if (modal) {
                log('✅', `Click funcionó: ${nodeName} - Modal abierto`);
                
                // Cerrar modal
                const closeBtn = modal.querySelector('.close-button, .close-btn, [data-close]');
                if (closeBtn) {
                    closeBtn.click();
                    await sleep(300);
                }
                
                return { success: true, reason: 'Modal abierto correctamente' };
            } else {
                log('❌', `Click falló: ${nodeName} - Modal NO se abrió`);
                return { success: false, reason: 'Modal no se abrió' };
            }
        } else {
            if (modal) {
                log('❌', `Click NO debería funcionar: ${nodeName} - Modal se abrió incorrectamente`);
                return { success: false, reason: 'Modal se abrió cuando no debería' };
            } else {
                log('✅', `Click correctamente bloqueado: ${nodeName} - Modal NO se abrió`);
                return { success: true, reason: 'Click correctamente bloqueado' };
            }
        }
    } catch (error) {
        log('❌', `Error probando click en ${nodeName}: ${error.message}`);
        return { success: false, reason: error.message };
    }
}

async function testModalContent(nodeId, nodeName) {
    try {
        const result = await testNodeExists(nodeId, nodeName);
        if (!result.success) return { success: false, reason: 'Nodo no encontrado' };
        
        const node = result.element;
        node.click();
        await sleep(500);
        
        const modal = document.querySelector('.modal-overlay, .node-modal');
        if (!modal) {
            return { success: false, reason: 'Modal no se abrió' };
        }
        
        // Verificar contenido del modal
        const title = modal.querySelector('.modal-title, h2, h3');
        const description = modal.querySelector('.description-content, .modal-description, p');
        const resources = modal.querySelector('.resources-section, .resources-grid');
        
        let contentScore = 0;
        if (title && title.textContent.trim()) contentScore++;
        if (description && description.textContent.trim()) contentScore++;
        if (resources) contentScore++;
        
        // Cerrar modal
        const closeBtn = modal.querySelector('.close-button, .close-btn, [data-close]');
        if (closeBtn) {
            closeBtn.click();
            await sleep(300);
        }
        
        if (contentScore >= 2) {
            log('✅', `Contenido del modal OK: ${nodeName} (${contentScore}/3 elementos)`);
            return { success: true, reason: `Contenido completo (${contentScore}/3)` };
        } else {
            log('❌', `Contenido del modal incompleto: ${nodeName} (${contentScore}/3 elementos)`);
            return { success: false, reason: `Contenido incompleto (${contentScore}/3)` };
        }
    } catch (error) {
        log('❌', `Error verificando contenido de ${nodeName}: ${error.message}`);
        return { success: false, reason: error.message };
    }
}

async function testResponsiveDesign() {
    try {
        log('📱', 'Probando diseño responsivo...');
        
        // Obtener dimensiones actuales
        const originalWidth = window.innerWidth;
        const originalHeight = window.innerHeight;
        
        // Probar móvil
        window.resizeTo(375, 667);
        await sleep(1000);
        
        const mobileNodes = document.querySelectorAll('.tech-node, .node');
        const mobileVisible = Array.from(mobileNodes).filter(node => {
            const rect = node.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
        });
        
        // Probar tablet
        window.resizeTo(768, 1024);
        await sleep(1000);
        
        const tabletNodes = document.querySelectorAll('.tech-node, .node');
        const tabletVisible = Array.from(tabletNodes).filter(node => {
            const rect = node.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
        });
        
        // Restaurar tamaño original
        window.resizeTo(originalWidth, originalHeight);
        await sleep(500);
        
        log('✅', `Responsivo OK - Móvil: ${mobileVisible.length} nodos, Tablet: ${tabletVisible.length} nodos`);
        return { success: true, mobile: mobileVisible.length, tablet: tabletVisible.length };
    } catch (error) {
        log('❌', `Error en prueba responsiva: ${error.message}`);
        return { success: false, reason: error.message };
    }
}

async function testVueReactivity() {
    try {
        log('⚡', 'Probando reactividad de Vue...');
        
        // Buscar elementos reactivos
        const statusSelects = document.querySelectorAll('.status-select, select');
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        
        let reactivityTests = 0;
        
        // Probar status selects
        if (statusSelects.length > 0) {
            const select = statusSelects[0];
            const originalValue = select.value;
            select.value = 'completed';
            select.dispatchEvent(new Event('change'));
            await sleep(300);
            reactivityTests++;
            select.value = originalValue;
            select.dispatchEvent(new Event('change'));
        }
        
        // Probar checkboxes
        if (checkboxes.length > 0) {
            const checkbox = checkboxes[0];
            const originalChecked = checkbox.checked;
            checkbox.checked = !originalChecked;
            checkbox.dispatchEvent(new Event('change'));
            await sleep(300);
            reactivityTests++;
            checkbox.checked = originalChecked;
            checkbox.dispatchEvent(new Event('change'));
        }
        
        log('✅', `Reactividad OK - ${reactivityTests} elementos probados`);
        return { success: true, testsRun: reactivityTests };
    } catch (error) {
        log('❌', `Error en prueba de reactividad: ${error.message}`);
        return { success: false, reason: error.message };
    }
}

// =========================================================================
// 🎯 FUNCIÓN PRINCIPAL DE PRUEBAS
// =========================================================================

async function testAll() {
    console.clear();
    log('🚀', '========================================');
    log('🧪', 'INICIANDO PRUEBAS COMPLETAS DEL ROADMAP');
    log('🚀', '========================================');
    
    const results = {
        mainNodes: { passed: 0, failed: 0, details: [] },
        optionalNodes: { passed: 0, failed: 0, details: [] },
        phaseNodes: { passed: 0, failed: 0, details: [] },
        modalContent: { passed: 0, failed: 0, details: [] },
        responsive: { success: false },
        reactivity: { success: false }
    };
    
    // 1. PROBAR NODOS PRINCIPALES
    log('🎯', '\n1. PROBANDO NODOS PRINCIPALES...');
    for (const node of TEST_CONFIG.mainNodes) {
        const result = await testNodeClick(node.id, node.name, true);
        if (result.success) {
            results.mainNodes.passed++;
        } else {
            results.mainNodes.failed++;
        }
        results.mainNodes.details.push({ ...node, result });
        await sleep(200);
    }
    
    // 2. PROBAR NODOS OPCIONALES
    log('🔧', '\n2. PROBANDO NODOS OPCIONALES...');
    for (const node of TEST_CONFIG.optionalNodes) {
        const result = await testNodeClick(node.id, node.name, true);
        if (result.success) {
            results.optionalNodes.passed++;
        } else {
            results.optionalNodes.failed++;
        }
        results.optionalNodes.details.push({ ...node, result });
        await sleep(200);
    }
    
    // 3. PROBAR NODOS DE FASE (NO DEBEN SER CLICKEABLES)
    log('🚫', '\n3. PROBANDO NODOS DE FASE (deben estar bloqueados)...');
    for (const node of TEST_CONFIG.phaseNodes) {
        const result = await testNodeClick(node.id, node.name, false);
        if (result.success) {
            results.phaseNodes.passed++;
        } else {
            results.phaseNodes.failed++;
        }
        results.phaseNodes.details.push({ ...node, result });
        await sleep(200);
    }
    
    // 4. PROBAR CONTENIDO DE MODALES
    log('📋', '\n4. PROBANDO CONTENIDO DE MODALES...');
    const criticalNodes = [
        ...TEST_CONFIG.mainNodes.slice(0, 3),
        { id: 200, name: 'AdonisJS', phase: 3 },
        { id: 201, name: 'Inertia.js', phase: 3 },
        { id: 202, name: 'Podman', phase: 3 }
    ];
    
    for (const node of criticalNodes) {
        const result = await testModalContent(node.id, node.name);
        if (result.success) {
            results.modalContent.passed++;
        } else {
            results.modalContent.failed++;
        }
        results.modalContent.details.push({ ...node, result });
        await sleep(300);
    }
    
    // 5. PROBAR DISEÑO RESPONSIVO
    log('📱', '\n5. PROBANDO DISEÑO RESPONSIVO...');
    results.responsive = await testResponsiveDesign();
    
    // 6. PROBAR REACTIVIDAD DE VUE
    log('⚡', '\n6. PROBANDO REACTIVIDAD DE VUE...');
    results.reactivity = await testVueReactivity();
    
    // =========================================================================
    // 📊 REPORTE FINAL
    // =========================================================================
    
    log('📊', '\n========================================');
    log('📊', '          REPORTE FINAL DE PRUEBAS');
    log('📊', '========================================');
    
    console.table({
        'Nodos Principales': `${results.mainNodes.passed}/${results.mainNodes.passed + results.mainNodes.failed}`,
        'Nodos Opcionales': `${results.optionalNodes.passed}/${results.optionalNodes.passed + results.optionalNodes.failed}`,
        'Nodos de Fase': `${results.phaseNodes.passed}/${results.phaseNodes.passed + results.phaseNodes.failed}`,
        'Contenido Modal': `${results.modalContent.passed}/${results.modalContent.passed + results.modalContent.failed}`,
        'Diseño Responsivo': results.responsive.success ? '✅ OK' : '❌ FALLO',
        'Reactividad Vue': results.reactivity.success ? '✅ OK' : '❌ FALLO'
    });
    
    // Detalles de fallos
    const allFailures = [
        ...results.mainNodes.details.filter(d => !d.result.success),
        ...results.optionalNodes.details.filter(d => !d.result.success),
        ...results.phaseNodes.details.filter(d => !d.result.success),
        ...results.modalContent.details.filter(d => !d.result.success)
    ];
    
    if (allFailures.length > 0) {
        log('❌', '\nFALLOS DETECTADOS:');
        allFailures.forEach(failure => {
            log('🔍', `${failure.name} (ID: ${failure.id}): ${failure.result.reason}`);
        });
    }
    
    // Verificación especial de nodos críticos
    const criticalNodesStatus = results.optionalNodes.details
        .filter(d => [200, 201, 202].includes(d.id))
        .map(d => ({ name: d.name, success: d.result.success }));
    
    log('🎯', '\nESTADO DE NODOS CRÍTICOS (AdonisJS, Inertia.js, Podman):');
    criticalNodesStatus.forEach(node => {
        log(node.success ? '✅' : '❌', `${node.name}: ${node.success ? 'FUNCIONANDO' : 'FALLO'}`);
    });
    
    const totalPassed = results.mainNodes.passed + results.optionalNodes.passed + 
                       results.phaseNodes.passed + results.modalContent.passed;
    const totalTests = results.mainNodes.passed + results.mainNodes.failed +
                      results.optionalNodes.passed + results.optionalNodes.failed +
                      results.phaseNodes.passed + results.phaseNodes.failed +
                      results.modalContent.passed + results.modalContent.failed;
    
    const successRate = ((totalPassed / totalTests) * 100).toFixed(1);
    
    log('🏆', `\nRESULTADO GENERAL: ${totalPassed}/${totalTests} pruebas pasadas (${successRate}%)`);
    
    if (successRate >= 95) {
        log('🎉', 'EXCELENTE: El roadmap funciona perfectamente!');
    } else if (successRate >= 80) {
        log('✅', 'BUENO: El roadmap funciona bien con algunos problemas menores');
    } else {
        log('⚠️', 'ATENCIÓN: Se detectaron varios problemas que requieren corrección');
    }
    
    log('🚀', '========================================');
    
    return results;
}

// =========================================================================
// 🔗 FUNCIONES AUXILIARES PARA PRUEBAS ESPECÍFICAS
// =========================================================================

// Función para probar solo nodos críticos
async function testCriticalNodes() {
    log('🎯', 'PROBANDO SOLO NODOS CRÍTICOS (AdonisJS, Inertia.js, Podman)...');
    
    const criticalNodes = [
        { id: 200, name: 'AdonisJS' },
        { id: 201, name: 'Inertia.js' },
        { id: 202, name: 'Podman' }
    ];
    
    for (const node of criticalNodes) {
        await testNodeClick(node.id, node.name, true);
        await testModalContent(node.id, node.name);
        await sleep(500);
    }
}

// Función para probar solo la funcionalidad de modales
async function testModalsOnly() {
    log('📋', 'PROBANDO SOLO FUNCIONALIDAD DE MODALES...');
    
    const testNodes = [
        { id: 1, name: 'HTML/CSS' },
        { id: 6, name: 'Vue.js' },
        { id: 200, name: 'AdonisJS' }
    ];
    
    for (const node of testNodes) {
        await testModalContent(node.id, node.name);
        await sleep(500);
    }
}

// =========================================================================
// 📚 INSTRUCCIONES DE USO
// =========================================================================

log('📚', 'FUNCIONES DISPONIBLES:');
log('🔧', 'testAll() - Ejecuta todas las pruebas completas');
log('🎯', 'testCriticalNodes() - Prueba solo AdonisJS, Inertia.js, Podman');
log('📋', 'testModalsOnly() - Prueba solo la funcionalidad de modales');
log('🚀', 'Para empezar, ejecuta: testAll()');
