<template>
  <div class="floating-progress-counter">
    <!-- Progreso de tecnologías principales -->
    <div class="progress-section">
      <div class="progress-header">
        <span class="progress-title">🎯 Tecnologías Principales</span>
        <span class="progress-count">{{ mainCompleted }}/{{ mainTotal }}</span>
      </div>
      <div class="progress-bar-container">
        <div 
          class="progress-bar main-bar"
          :style="{ width: mainProgressPercentage + '%' }"
        ></div>
      </div>
    </div>

    <!-- Progreso de tecnologías opcionales -->
    <div class="progress-section">
      <div class="progress-header">
        <span class="progress-title">⭐ Tecnologías Opcionales</span>
        <span class="progress-count">{{ optionalCompleted }}/{{ optionalTotal }}</span>
      </div>
      <div class="progress-bar-container">
        <div 
          class="progress-bar optional-bar"
          :style="{ width: optionalProgressPercentage + '%' }"
        ></div>
      </div>
    </div>

    <!-- Progreso total -->
    <div class="total-progress">
      <span class="total-text">Progreso Total: {{ totalProgressPercentage }}%</span>
      <div class="mini-progress-bar">
        <div 
          class="mini-progress-fill"
          :style="{ width: totalProgressPercentage + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressCounter',
  props: {
    roadmapData: {
      type: Object,
      required: true
    }
  },
  computed: {
    mainNodes() {
      return this.roadmapData.phases.flatMap(phase => 
        phase.nodes.filter(node => node.isMain)
      )
    },
    optionalNodes() {
      return this.roadmapData.phases.flatMap(phase => 
        phase.optionalNodes || []
      )
    },
    mainCompleted() {
      return this.mainNodes.filter(node => node.completed).length
    },
    mainTotal() {
      return this.mainNodes.length
    },
    optionalCompleted() {
      return this.optionalNodes.filter(node => node.completed).length
    },
    optionalTotal() {
      return this.optionalNodes.length
    },
    mainProgressPercentage() {
      return this.mainTotal === 0 ? 0 : Math.round((this.mainCompleted / this.mainTotal) * 100)
    },
    optionalProgressPercentage() {
      return this.optionalTotal === 0 ? 0 : Math.round((this.optionalCompleted / this.optionalTotal) * 100)
    },
    totalProgressPercentage() {
      const totalNodes = this.mainTotal + this.optionalTotal
      const totalCompleted = this.mainCompleted + this.optionalCompleted
      return totalNodes === 0 ? 0 : Math.round((totalCompleted / totalNodes) * 100)
    }
  }
}
</script>

<style scoped>
.floating-progress-counter {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  background: rgba(40, 42, 54, 0.97);
  backdrop-filter: blur(15px);
  border: 2px solid #6272a4;
  border-radius: 16px;
  padding: 20px;
  min-width: 320px;
  max-width: 360px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(139, 233, 253, 0.1);
  color: #f8f8f2;
  font-family: "Arial", sans-serif;
  transition: all 0.3s ease;
  user-select: none;
  box-sizing: border-box;
}

.floating-progress-counter:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 
    0 15px 45px rgba(0, 0, 0, 0.5),
    0 0 0 2px rgba(139, 233, 253, 0.2);
}

.progress-section {
  margin-bottom: 16px;
}

.progress-section:last-of-type {
  margin-bottom: 20px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-title {
  font-size: 0.9em;
  font-weight: 600;
  color: #f8f8f2;
}

.progress-count {
  font-size: 0.85em;
  color: #bd93f9;
  font-weight: 500;
}

.progress-bar-container {
  width: 100%;
  background-color: #44475a;
  border-radius: 12px;
  height: 16px;
  overflow: visible;
  position: relative;
  border: 1px solid #6272a4;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.progress-bar {
  height: 100%;
  border-radius: 12px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: visible;
}

.main-bar {
  background: linear-gradient(90deg, #ff79c6 0%, #ff5555 80%, #ffb86c 100%);
  box-shadow: 
    0 0 12px rgba(255, 121, 198, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  animation: progressGlow 3s ease-in-out infinite alternate;
}

@keyframes progressGlow {
  0% {
    box-shadow: 
      0 0 12px rgba(255, 121, 198, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  100% {
    box-shadow: 
      0 0 20px rgba(255, 121, 198, 0.8),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
}

.optional-bar {
  background: linear-gradient(90deg, #bd93f9 0%, #8be9fd 80%, #50fa7b 100%);
  box-shadow: 
    0 0 12px rgba(189, 147, 249, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  animation: progressGlowOptional 3s ease-in-out infinite alternate;
}

@keyframes progressGlowOptional {
  0% {
    box-shadow: 
      0 0 12px rgba(189, 147, 249, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  100% {
    box-shadow: 
      0 0 20px rgba(189, 147, 249, 0.8),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
}

.total-progress {
  border-top: 1px solid #6272a4;
  padding-top: 16px;
  text-align: center;
}

.total-text {
  font-size: 0.95em;
  font-weight: 700;
  color: #50fa7b;
  display: block;
  margin-bottom: 8px;
}

.mini-progress-bar {
  width: 100%;
  height: 10px;
  background-color: #44475a;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #6272a4;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
}

.mini-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #50fa7b 0%, #8be9fd 30%, #bd93f9 60%, #ff79c6 100%);
  border-radius: 10px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 0 8px rgba(80, 250, 123, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/* Media queries responsivas */
@media (max-width: 768px) {
  .floating-progress-counter {
    top: 10px;
    left: 10px;
    right: 10px;
    min-width: unset;
    max-width: unset;
    padding: 16px;
    width: calc(100% - 20px);
  }
}

@media (max-width: 480px) {
  .floating-progress-counter {
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    margin: 20px;
    width: calc(100% - 40px);
  }
  
  .progress-title {
    font-size: 0.8em;
  }
  
  .progress-count {
    font-size: 0.75em;
  }
}
</style>