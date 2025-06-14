<template>
  <div 
    class="roadmap-node"
    :class="{
      'phase-title-item': isPhaseTitle,
      'main-item': node.isMain && !isPhaseTitle,
      'optional-item': node.isOptional && !isPhaseTitle,
      'completed': node.completed || node.status === 'completed',
      'in-progress': node.status === 'in-progress',
      'skipped': node.status === 'skipped'
    }"
    :style="nodeStyle"
    :data-node-id="node.id"
    :data-node-name="node.name || title"
    @click="handleClick"
  >
    <div class="node-content">
      <div class="node-name">{{ node.name || title }}</div>
      
      <!-- Metadatos del nodo (solo para nodos de tecnología) -->
      <div v-if="!isPhaseTitle && node.name" class="node-metadata">
        <span 
          class="difficulty-indicator"
          :class="`difficulty-${getDifficultyLevel(node.difficulty)}`"
        >
          {{ getDifficultyStars(node.difficulty) }}
        </span>
        <span class="time-estimate">{{ node.timeEstimate }}</span>
      </div>
      
      <!-- Para títulos de fase -->
      <div v-if="isPhaseTitle" class="phase-completion-star">
        <span class="completion-placeholder">☆</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getDifficultyColor, getDifficultyStars } from '../data/roadmapData.js'

export default {
  name: 'RoadmapNode',
  props: {
    node: {
      type: Object,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    backgroundColor: {
      type: String,
      default: '#44475a'
    },
    borderColor: {
      type: String,
      default: '#6272a4'
    },
    isPhaseTitle: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  computed: {
    nodeStyle() {
      const borderStyle = this.node.isOptional ? 'dashed' : 'solid'
      const borderWidth = this.isPhaseTitle ? '4px' : '3px'
      
      return {
        backgroundColor: this.node.backgroundColor || this.backgroundColor,
        border: `${borderWidth} ${borderStyle} ${this.node.borderColor || this.borderColor}`,
        color: '#f8f8f2',
        boxShadow: `${this.getBoxShadowColor()} 0px 0px 10px`
      }
    }
  },
  methods: {
    getDifficultyColor,
    getDifficultyStars,
    getDifficultyLevel(difficulty) {
      switch (difficulty) {
        case 'Fácil': return 1
        case 'Intermedio': return 2
        case 'Difícil': return 3
        case 'Avanzado': return 4
        case 'Experto': return 5
        default: return 1
      }
    },
    getBoxShadowColor() {
      const color = this.node.borderColor || this.borderColor
      // Convertir hex a rgba con opacidad 0.2
      const hex = color.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      return `rgba(${r}, ${g}, ${b}, 0.2)`
    },
    handleClick(event) {
      // Prevenir propagación si es necesario
      event.stopPropagation();
      
      this.$emit('click', this.node)
    }
  }
}
</script>

<style scoped>
.roadmap-node {
  padding: 18px 24px;
  cursor: pointer;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 85px;
  margin: 5px 0;
  backdrop-filter: blur(5px);
  border-radius: 12px;
  min-width: 260px;
  max-width: 300px;
  position: relative;
  z-index: 5;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;
  animation: nodeAppear 0.8s ease-out;
  animation-fill-mode: both;
}

@keyframes nodeAppear {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.roadmap-node:hover {
  transform: translateY(-3px) scale(1.02);
  filter: brightness(1.1);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4) !important;
}

.phase-title-item {
  transform: scale(1.15);
  font-size: 1.2em;
  font-weight: 700;
  background: linear-gradient(135deg, #6272a4, #8be9fd) !important;
  border: 4px solid #bd93f9 !important;
  border-radius: 16px !important;
  text-align: center;
  cursor: pointer !important;
  pointer-events: auto;
}

.phase-title-item:hover {
  transform: scale(1.2);
  box-shadow: 0 16px 40px rgba(98, 114, 164, 0.8) !important;
  border-color: #ff79c6 !important;
  background: linear-gradient(135deg, #bd93f9, #ff79c6) !important;
}

.optional-item {
  min-width: 260px;
  max-width: 300px;
  opacity: 0.95;
  border-width: 2px;
}

.node-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.node-name {
  font-weight: bold;
  font-size: 0.9em;
  line-height: 1.2;
}

.node-metadata {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 0.75em;
  opacity: 0.9;
}

.difficulty-indicator {
  font-size: 0.8em;
  padding: 2px 6px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
}

.difficulty-1 {
  color: #8be9fd;
}

.difficulty-2 {
  color: #50fa7b;
}

.difficulty-3 {
  color: #f1fa8c;
}

.difficulty-4 {
  color: #ffb86c;
}

.difficulty-5 {
  color: #ff5555;
}

/* Estados de nodos */
.roadmap-node.completed {
  border-color: #50fa7b !important;
  box-shadow: 0 0 20px rgba(80, 250, 123, 0.4) !important;
  background: linear-gradient(135deg, rgba(80, 250, 123, 0.1), rgba(139, 233, 253, 0.05)) !important;
}

.roadmap-node.completed::after {
  content: '✓';
  position: absolute;
  top: -5px;
  right: -5px;
  background: #50fa7b;
  color: #282a36;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.8em;
  box-shadow: 0 2px 8px rgba(80, 250, 123, 0.5);
}

.roadmap-node.in-progress {
  border-color: #ffb86c !important;
  box-shadow: 0 0 20px rgba(255, 184, 108, 0.4) !important;
  background: linear-gradient(135deg, rgba(255, 184, 108, 0.1), rgba(241, 250, 140, 0.05)) !important;
}

.roadmap-node.in-progress::after {
  content: '⏳';
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ffb86c;
  color: #282a36;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.7em;
  box-shadow: 0 2px 8px rgba(255, 184, 108, 0.5);
}

.roadmap-node.skipped {
  border-color: #ff5555 !important;
  background: linear-gradient(135deg, rgba(255, 85, 85, 0.1), rgba(68, 71, 90, 0.3)) !important;
  opacity: 0.6;
  filter: grayscale(50%);
}

.roadmap-node.skipped::after {
  content: '⏸️';
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff5555;
  color: #282a36;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.7em;
  box-shadow: 0 2px 8px rgba(255, 85, 85, 0.5);
}

.roadmap-node.skipped:hover {
  opacity: 0.4;
  transform: scale(0.98);
}

.time-estimate {
  color: #bd93f9;
  font-style: italic;
}

.phase-completion-star {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
}

.completion-placeholder {
  font-size: 1.5em;
  color: #6272a4;
  opacity: 0.3;
}

.completed {
  border-color: #50fa7b !important;
  background: rgba(80, 250, 123, 0.1) !important;
  animation: completionPulse 2s ease-in-out infinite alternate;
}

@keyframes completionPulse {
  0% {
    box-shadow: 0 0 10px rgba(80, 250, 123, 0.3);
  }
  100% {
    box-shadow: 0 0 20px rgba(80, 250, 123, 0.6);
  }
}

.completed .completion-placeholder {
  color: #50fa7b;
  opacity: 1;
  animation: starSpin 1s ease-in-out;
}

@keyframes starSpin {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.2); }
  100% { transform: rotate(360deg) scale(1); }
}

/* Media queries responsivas */
@media (max-width: 900px) {
  .roadmap-node {
    min-width: 200px;
    max-width: 280px;
    min-height: 75px;
    padding: 13px 18px;
  }
  
  .optional-item {
    min-width: 180px;
    max-width: 250px;
  }
}

@media (max-width: 768px) {
  .roadmap-node {
    min-width: 180px;
    max-width: 260px;
    min-height: 70px;
    padding: 12px 16px;
  }
  
  .node-name {
    font-size: 0.85em;
  }
  
  .node-metadata {
    font-size: 0.7em;
  }
  
  .optional-item {
    min-width: 160px;
    max-width: 220px;
  }
}

@media (max-width: 480px) {
  .roadmap-node {
    min-width: 140px;
    max-width: 220px;
    min-height: 60px;
    padding: 10px 14px;
  }
  
  .node-name {
    font-size: 0.75em;
  }
  
  .difficulty-indicator {
    font-size: 0.7em;
    padding: 1px 5px;
  }
  
  .optional-item {
    min-width: 130px;
    max-width: 200px;
  }
}
</style>