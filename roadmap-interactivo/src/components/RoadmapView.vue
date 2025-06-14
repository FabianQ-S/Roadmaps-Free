<template>
  <div class="roadmap-view-container">
    <ProgressCounter :roadmap-data="roadmapData" />
    
    <div class="roadmap-header">
      <div class="header-content">
        <div class="title-with-logo">
          <img 
            src="../assets/vue-logo.svg" 
            alt="Vue.js Logo" 
            class="vue-logo rotating"
          />
          <h1>🗺️ Roadmap Interactivo de JavaScript & Vue.js</h1>
          <img 
            src="../assets/vue-logo.svg" 
            alt="Vue.js Logo" 
            class="vue-logo rotating reverse"
          />
        </div>
        <p class="roadmap-subtitle">Tu guía paso a paso hacia el dominio del desarrollo frontend</p>
      </div>
    </div>

    <div class="roadmap-grid">
      <!-- Fases del roadmap -->
      <div 
        v-for="phase in roadmapData.phases" 
        :key="phase.id"
        class="phase-section"
        :data-phase-id="phase.id"
      >
        <!-- Layout unificado para TODAS las fases -->
        <div class="phase-title-container">
          <div class="phase-title-with-optionals" :class="`phase-${phase.id}-layout`">
            <!-- Opcionales izquierdos -->
            <div 
              v-if="phase.optionalNodes && phase.optionalNodes.some(node => node.position === 'left')"
              class="phase-left-optionals"
            >
              <RoadmapNode 
                v-for="node in phase.optionalNodes.filter(node => node.position === 'left')"
                :key="node.id"
                :node="node"
                @click="onNodeClick"
              />
            </div>
            
            <!-- Título de la fase -->
            <RoadmapNode 
              :title="phase.title"
              :background-color="phase.backgroundColor"
              :border-color="phase.borderColor"
              :is-phase-title="true"
              :node="{ id: 100 + phase.id, name: phase.title }"
              @click="onPhaseClick"
            />
            
            <!-- Opcionales derechos -->
            <div 
              v-if="phase.optionalNodes && phase.optionalNodes.some(node => node.position === 'right')"
              class="phase-right-optionals"
            >
              <RoadmapNode 
                v-for="node in phase.optionalNodes.filter(node => node.position === 'right')"
                :key="node.id"
                :node="node"
                @click="onNodeClick"
              />
            </div>
          </div>
        </div>

        <!-- Contenido principal de la fase (solo nodos principales) -->
        <div class="phase-content">
          <div class="main-nodes">
            <RoadmapNode 
              v-for="node in phase.nodes"
              :key="node.id"
              :node="node"
              @click="onNodeClick"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para detalles del nodo -->
    <NodeModal 
      :is-visible="showModal"
      :node="selectedNode"
      @close="closeModal"
      @update-status="updateNodeStatus"
    />

    <!-- Modal para detalles de la fase -->
    <PhaseModal 
      :is-visible="showPhaseModal"
      :phase-id="selectedPhaseId"
      @close="closePhaseModal"
    />
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import RoadmapNode from './RoadmapNode.vue'
import ProgressCounter from './ProgressCounter.vue'
import NodeModal from './NodeModal.vue'
import PhaseModal from './PhaseModal.vue'
import { roadmapData as initialRoadmapData } from '../data/roadmapData.js'

export default {
  name: 'RoadmapView',
  components: {
    RoadmapNode,
    ProgressCounter,
    NodeModal,
    PhaseModal
  },
  setup() {
    // Hacer reactivos los datos del roadmap - FORZAR RECARGA
    console.log('🔄 INICIANDO CARGA DE DATOS - TIMESTAMP: 13_06_2025_16_45');
    const roadmapData = reactive(JSON.parse(JSON.stringify(initialRoadmapData)))
    const showModal = ref(false)
    const selectedNode = ref({})
    const showPhaseModal = ref(false)
    const selectedPhaseId = ref(null)

    const findAndUpdateNode = (nodeId, updateFn) => {
      roadmapData.phases.forEach(phase => {
        // Buscar en nodos principales
        const mainNode = phase.nodes.find(n => n.id === nodeId)
        if (mainNode) {
          updateFn(mainNode)
          return
        }
        
        // Buscar en nodos opcionales
        if (phase.optionalNodes) {
          const optionalNode = phase.optionalNodes.find(n => n.id === nodeId)
          if (optionalNode) {
            updateFn(optionalNode)
          }
        }
      })
    }

    const onNodeClick = (node) => {
      console.log('🔍 onNodeClick received node:', {
        id: node.id,
        name: node.name,
        isMain: node.isMain,
        isOptional: node.isOptional
      });
      
      // Prevenir que nodos de fase abran modal de nodo
      // Los nodos de fase tienen IDs específicos: 100, 101, 102, 103
      const isPhaseNode = node.id >= 100 && node.id <= 103;
      if (isPhaseNode) {
        console.log('⚠️ Blocked: Phase node detected', node.id);
        return;
      }
      
      // Solo abrir modal para nodos con tecnologías (no títulos de fase)
      // Verificar que tiene nombre y que es un nodo tecnológico (main o optional)
      const hasName = !!node.name;
      const isMainNode = node.isMain === true;
      const isOptionalNode = node.isOptional === true;
      const isTechnological = isMainNode || isOptionalNode;
      
      console.log('🧪 Validation results:', {
        hasName,
        isMainNode,
        isOptionalNode,
        isTechnological,
        shouldOpenModal: hasName && isTechnological
      });
      
      if (hasName && isTechnological) {
        console.log('✅ Opening modal for:', node.name);
        selectedNode.value = { ...node }
        showModal.value = true
      } else {
        console.log('❌ Modal blocked for:', node.name, 'Validation failed');
      }
    }

    const closeModal = () => {
      showModal.value = false
      selectedNode.value = {}
    }

    const closePhaseModal = () => {
      showPhaseModal.value = false
      selectedPhaseId.value = null
    }

    const updateNodeStatus = (data) => {
      const { node, status } = data
      findAndUpdateNode(node.id, (foundNode) => {
        // Actualizar el estado del nodo basado en el status del dropdown
        foundNode.status = status
        foundNode.completed = status === 'completed'
        console.log(`Updated status for ${foundNode.name}: ${status}`)
      })
      
      // Actualizar el nodo seleccionado en el modal
      selectedNode.value = { 
        ...selectedNode.value, 
        status: status,
        completed: status === 'completed'
      }
    }

    const onPhaseClick = (phaseNode) => {
      console.log('🔍 onPhaseClick triggered:', {
        name: phaseNode.name,
        id: phaseNode.id,
        isPhaseTitle: true
      });
      
      // Solo procesar nodos que definitivamente son de fase (ID >= 100)
      if (phaseNode.id < 100) {
        console.log('❌ Invalid phase node ID:', phaseNode.id, 'Ignoring click');
        return;
      }
      
      // Extraer el ID de la fase del nodo
      const phaseId = phaseNode.id - 100 // Los IDs de fase son 100, 101, 102, 103
      console.log('✅ Opening phase modal for phase:', phaseId);
      
      selectedPhaseId.value = phaseId
      showPhaseModal.value = true
    }

    // Debug simple
    console.log('🔍 Roadmap loaded, total phases:', roadmapData.phases.length)
    console.log('🎯 VERIFICANDO NODOS RECREADOS:')
    roadmapData.phases.forEach(phase => {
      if (phase.optionalNodes) {
        const nodosRecreateds = phase.optionalNodes.filter(n => 
          ['AdonisJS', 'Inertia.js', 'Podman'].includes(n.name)
        );
        if (nodosRecreateds.length > 0) {
          console.log(`📍 Fase ${phase.id} - Nodos recreados encontrados:`)
          nodosRecreateds.forEach(node => {
            console.log(`   - ${node.name}: ID=${node.id} (${node.id >= 200 ? '✅ CORRECTO' : '❌ INCORRECTO'})`)
          });
        }
        console.log(`Phase ${phase.id} has ${phase.optionalNodes.length} optional nodes:`, phase.optionalNodes.map(n => `${n.name}(${n.position})`))
      }
    })

    return {
      roadmapData,
      showModal,
      selectedNode,
      showPhaseModal,
      selectedPhaseId,
      onNodeClick,
      onPhaseClick,
      closeModal,
      closePhaseModal,
      updateNodeStatus
    }
  }
}
</script>

<style scoped>
.roadmap-view-container {
  width: 100%;
  max-width: 100vw;
  padding: 0;
  margin: 0;
  font-family: "Arial", sans-serif;
  position: relative;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
  color: #f8f8f2;
  min-height: 100vh;
  overflow-x: hidden;
  box-sizing: border-box;
}

.roadmap-view-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 50%, rgba(189, 147, 249, 0.08) 0%, transparent 40%),
    radial-gradient(circle at 80% 20%, rgba(255, 121, 198, 0.08) 0%, transparent 40%),
    radial-gradient(circle at 40% 80%, rgba(139, 233, 253, 0.06) 0%, transparent 40%);
  pointer-events: none;
  z-index: 0;
}

.roadmap-header {
  text-align: center;
  margin-bottom: 30px;
  padding: clamp(20px, 4vh, 40px) clamp(10px, 3vw, 20px) clamp(10px, 2vh, 20px) clamp(10px, 3vw, 20px);
  background: rgba(26, 26, 46, 0.8);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.title-with-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(15px, 3vw, 25px);
  flex-wrap: wrap;
}

.vue-logo {
  width: clamp(40px, 6vw, 60px);
  height: clamp(40px, 6vw, 60px);
  filter: drop-shadow(0 0 10px rgba(65, 184, 131, 0.3));
  transition: all 0.3s ease;
}

.vue-logo.rotating {
  animation: spin 5s linear infinite;
}

.vue-logo.rotating.reverse {
  animation: spin-reverse 5s linear infinite;
}

.vue-logo:hover {
  filter: drop-shadow(0 0 15px rgba(65, 184, 131, 0.6));
  transform: scale(1.1);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes spin-reverse {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

.roadmap-header h1 {
  color: #f8f8f2;
  font-size: clamp(1.8em, 4vw, 2.5em);
  font-weight: bold;
  margin: 0;
  text-align: center;
  flex-shrink: 0;
}

.roadmap-subtitle {
  color: #6272a4;
  font-size: clamp(1em, 2.5vw, 1.2em);
  font-style: italic;
  margin-bottom: 20px;
}

.roadmap-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(80px, 10vh, 150px);
  padding: 40px clamp(20px, 5vw, 60px);
  position: relative;
  z-index: 1;
  max-width: min(1800px, 95vw);
  margin: 0 auto;
  width: 100%;
  min-height: calc(100vh - 200px);
  box-sizing: border-box;
}

.phase-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  padding: clamp(20px, 4vw, 40px) clamp(15px, 3vw, 30px);
  border-radius: 16px;
  width: 100%;
  max-width: min(1600px, 90vw);
  position: relative;
  background: rgba(68, 71, 90, 0.1);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(248, 248, 242, 0.1);
  box-sizing: border-box;
  animation: phaseAppear 1s ease-out;
  animation-fill-mode: both;
}

@keyframes phaseAppear {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.phase-section:nth-child(1) { animation-delay: 0.1s; }
.phase-section:nth-child(2) { animation-delay: 0.2s; }
.phase-section:nth-child(3) { animation-delay: 0.3s; }
.phase-section:nth-child(4) { animation-delay: 0.4s; }

.phase-title-container {
  display: flex;
  justify-content: center;
  margin-bottom: clamp(20px, 3vw, 35px);
  position: relative;
  z-index: 10;
}

.phase-section[data-phase-id="3"] .phase-title-container {
  margin-bottom: clamp(40px, 6vw, 70px);
}

.phase-content {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  max-width: 1400px;
  gap: clamp(20px, 4vw, 45px);
  position: relative;
  padding: 0 clamp(15px, 3vw, 30px);
  box-sizing: border-box;
  margin: 0 auto;
  min-height: 140px; /* Asegurar altura mínima para visibilidad */
}

.main-nodes {
  display: grid;
  gap: clamp(20px, 4vw, 30px);
  justify-items: center;
  align-items: center;
  flex: 0 0 auto;
  z-index: 5;
  order: 1; /* Asegurar que esté en el centro */
}

/* Layouts específicos por fase */
.phase-section[data-phase-id="0"] .main-nodes {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  max-width: 800px;
  width: 100%;
}

.phase-section[data-phase-id="0"] .main-nodes .roadmap-node:first-child {
  grid-column: 1 / -1;
  min-width: 260px;
  max-width: 300px;
  margin-bottom: 10px;
}

.phase-section[data-phase-id="1"] .main-nodes {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  max-width: 800px;
  width: 100%;
}

.phase-section[data-phase-id="1"] .main-nodes .roadmap-node:first-child {
  grid-column: 1 / -1;
  min-width: 260px;
  max-width: 300px;
  margin-bottom: 10px;
}

.phase-section[data-phase-id="2"] .main-nodes {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  max-width: 800px;
  width: 100%;
}

.phase-section[data-phase-id="2"] .main-nodes .roadmap-node:last-child {
  grid-column: 1 / -1;
  min-width: 260px;
  max-width: 300px;
  margin-top: 10px;
}

.phase-section[data-phase-id="3"] .main-nodes {
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto;
  max-width: 1000px;
  width: 100%;
}

.optional-nodes {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  opacity: 0.95;
  min-width: 220px;
  max-width: 280px;
  flex: 0 0 auto;
  padding: 15px;
  box-sizing: border-box;
  /* Asegurar visibilidad en desktop */
  visibility: visible;
  z-index: 2;
}

.left-optional {
  margin-right: clamp(20px, 4vw, 40px);
  align-items: flex-end;
  order: 0; /* Asegurar orden correcto */
}

.right-optional {
  margin-left: clamp(20px, 4vw, 40px);
  align-items: flex-start;
  order: 2; /* Asegurar orden correcto */
}

/* Layout unificado para títulos con nodos opcionales (basado en el exitoso de Fase 3) */
.phase-title-with-optionals {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(25px, 5vw, 60px);
  width: 100%;
  max-width: 1200px;
  position: relative;
  margin: 0 auto;
}

.phase-left-optionals,
.phase-right-optionals {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  opacity: 0.95;
  min-width: 260px;
  max-width: 320px;
  flex: 0 0 auto;
  padding: 10px;
  box-sizing: border-box;
  visibility: visible;
  z-index: 2;
}

.phase-left-optionals {
  align-items: flex-end;
}

.phase-right-optionals {
  align-items: flex-start;
}

/* Media queries responsivas */
@media (max-width: 1400px) {
  .phase-content {
    gap: clamp(18px, 4vw, 45px);
  }
  
  .phase-section[data-phase-id="3"] .main-nodes {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    max-width: 700px;
  }
  
  .phase-section[data-phase-id="3"] .main-nodes .roadmap-node:nth-child(3) {
    grid-column: 1 / -1;
    justify-self: center;
  }
}

@media (max-width: 1100px) {
  .roadmap-grid {
    gap: clamp(20px, 4vh, 40px);
    padding: 12px clamp(8px, 1.5vw, 20px);
  }
  
  .phase-content {
    gap: clamp(15px, 3vw, 28px);
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .phase-title-with-optionals {
    gap: clamp(20px, 4vw, 40px);
  }
  
  .phase-left-optionals,
  .phase-right-optionals {
    min-width: 240px;
    max-width: 280px;
  }
}

@media (max-width: 900px) {
  .roadmap-header {
    padding: clamp(12px, 2.5vh, 20px) clamp(8px, 1.5vw, 15px);
  }
  
  .roadmap-header h1 {
    font-size: clamp(1.5em, 5vw, 2.2em);
  }
  
  .title-with-logo {
    gap: clamp(12px, 2.5vw, 20px);
  }
  
  .vue-logo {
    width: clamp(35px, 5vw, 45px);
    height: clamp(35px, 5vw, 45px);
  }
  
  .phase-content {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  
  /* Responsive para layout unificado */
  .phase-title-with-optionals {
    flex-direction: column;
    gap: 20px;
  }
  
  .phase-left-optionals,
  .phase-right-optionals {
    width: 100%;
    max-width: 500px;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    align-items: center;
  }
  
  .main-nodes {
    grid-template-columns: 1fr 1fr !important;
    grid-template-rows: auto !important;
    gap: 18px;
    max-width: 500px;
    width: 100%;
  }
  
  .phase-section[data-phase-id="0"] .main-nodes .roadmap-node:first-child,
  .phase-section[data-phase-id="1"] .main-nodes .roadmap-node:first-child,
  .phase-section[data-phase-id="2"] .main-nodes .roadmap-node:last-child {
    grid-column: 1 / -1;
    min-width: 260px;
    max-width: 300px;
    margin: 0;
  }
}

@media (max-width: 768px) {
  .roadmap-grid {
    padding: 8px 12px;
    gap: clamp(20px, 4vh, 40px);
  }
  
  .roadmap-header {
    padding: 12px;
    margin-bottom: 15px;
  }
  
  .roadmap-header h1 {
    font-size: clamp(1.3em, 6vw, 1.8em);
  }
  
  .title-with-logo {
    gap: clamp(10px, 2vw, 15px);
  }
  
  .vue-logo {
    width: clamp(30px, 4vw, 40px);
    height: clamp(30px, 4vw, 40px);
  }
  
  .roadmap-subtitle {
    font-size: clamp(0.9em, 3vw, 1.1em);
  }
  
  .phase-section {
    padding: 15px 12px;
    gap: 15px;
  }
  
  .main-nodes {
    grid-template-columns: 1fr !important;
    grid-template-rows: auto !important;
    gap: 12px;
    max-width: 350px;
  }
  
  .main-nodes .roadmap-node {
    grid-column: 1 !important;
    grid-row: auto !important;
    min-width: 260px !important;
    max-width: 300px !important;
    margin: 0 !important;
  }
  
  .optional-nodes {
    max-width: 350px;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .roadmap-header {
    padding: 10px;
  }
  
  .roadmap-header h1 {
    font-size: clamp(1.1em, 7vw, 1.5em);
    line-height: 1.2;
  }
  
  .title-with-logo {
    gap: clamp(8px, 1.5vw, 12px);
    flex-direction: column;
  }
  
  .vue-logo {
    width: clamp(25px, 3.5vw, 35px);
    height: clamp(25px, 3.5vw, 35px);
  }
  
  .roadmap-subtitle {
    font-size: clamp(0.8em, 4vw, 1em);
  }
  
  .roadmap-grid {
    padding: 6px 10px;
  }
  
  .phase-section {
    padding: 12px 10px;
    gap: 12px;
  }
  
  .main-nodes {
    max-width: 300px;
    gap: 10px;
  }
  
  .main-nodes .roadmap-node {
    min-width: 240px !important;
    max-width: 280px !important;
  }
  
  .optional-nodes {
    max-width: 300px;
    gap: 8px;
  }
  
  .phase-content {
    gap: 12px;
    padding: 0 3px;
  }
}
</style>