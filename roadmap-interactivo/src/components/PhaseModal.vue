<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="phase-modal-content" @click.stop>
      <div class="modal-header">
        <h2 class="phase-modal-title">
          {{ phaseInfo.emoji }} {{ phaseInfo.title }}
        </h2>
        <button class="close-button" @click="closeModal">×</button>
      </div>
      
      <div class="modal-body">
        <!-- Información general -->
        <div class="phase-overview">
          <div class="overview-item">
            <span class="overview-label">⏱️ Tiempo total estimado:</span>
            <span class="overview-value time-badge">{{ phaseInfo.totalTime }}</span>
          </div>
          <div class="overview-item description">
            <span class="overview-label">📝 Descripción:</span>
            <p class="overview-description">{{ phaseInfo.description }}</p>
          </div>
        </div>

        <!-- Tecnologías principales -->
        <div class="tech-section main-tech">
          <h3 class="tech-section-title">
            🎯 {{ phaseInfo.mainTechnologies.title }}
          </h3>
          <p class="tech-section-description">{{ phaseInfo.mainTechnologies.description }}</p>
          
          <div class="tech-list">
            <div 
              v-for="tech in phaseInfo.mainTechnologies.technologies" 
              :key="tech.name"
              class="tech-card main-tech-card"
            >
              <h4 class="tech-name">{{ tech.name }}</h4>
              <p class="tech-reason"><strong>¿Por qué aprenderlo?</strong> {{ tech.reason }}</p>
              <p class="tech-synergy"><strong>Sinergia:</strong> {{ tech.synergy }}</p>
            </div>
          </div>
        </div>

        <!-- Tecnologías opcionales -->
        <div v-if="phaseInfo.optionalTechnologies" class="tech-section optional-tech">
          <h3 class="tech-section-title">
            ⭐ {{ phaseInfo.optionalTechnologies.title }}
          </h3>
          <p class="tech-section-description">{{ phaseInfo.optionalTechnologies.description }}</p>
          
          <div class="tech-list">
            <div 
              v-for="tech in phaseInfo.optionalTechnologies.technologies" 
              :key="tech.name"
              class="tech-card optional-tech-card"
            >
              <h4 class="tech-name">{{ tech.name }}</h4>
              <p class="tech-reason"><strong>¿Por qué aprenderlo?</strong> {{ tech.reason }}</p>
              <p class="tech-synergy"><strong>Sinergia:</strong> {{ tech.synergy }}</p>
            </div>
          </div>
        </div>

        <!-- Conceptos clave -->
        <div class="concepts-section">
          <h3 class="concepts-title">🔑 Conceptos Clave a Aprender</h3>
          <div class="concepts-grid">
            <div 
              v-for="concept in phaseInfo.keyConcepts" 
              :key="concept"
              class="concept-item"
            >
              <span class="concept-bullet">▸</span>
              <span class="concept-text">{{ concept }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { roadmapData } from '../data/roadmapData.js'

export default {
  name: 'PhaseModal',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    phaseId: {
      type: Number,
      default: null
    }
  },
  emits: ['close'],
  computed: {
    phaseInfo() {
      return roadmapData.phaseDetails[this.phaseId] || {}
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  box-sizing: border-box;
}

.phase-modal-content {
  background: linear-gradient(135deg, #282a36 0%, #1a1a2e 100%);
  border: 2px solid #bd93f9;
  border-radius: 20px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 50px rgba(189, 147, 249, 0.3);
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  background: linear-gradient(135deg, #bd93f9 0%, #8be9fd 100%);
  border-radius: 18px 18px 0 0;
  margin-bottom: 0;
}

.phase-modal-title {
  color: #1a1a2e;
  font-size: 1.8em;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.close-button {
  background: none;
  border: none;
  color: #1a1a2e;
  font-size: 2em;
  cursor: pointer;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-button:hover {
  background-color: rgba(26, 26, 46, 0.1);
  transform: scale(1.1);
}

.modal-body {
  padding: 30px;
  color: #f8f8f2;
}

.phase-overview {
  background: rgba(68, 71, 90, 0.3);
  border: 1px solid rgba(139, 233, 253, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 25px;
}

.overview-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.overview-item.description {
  flex-direction: column;
  align-items: flex-start;
}

.overview-label {
  font-weight: 600;
  color: #8be9fd;
  margin-right: 10px;
  min-width: 180px;
}

.overview-value {
  color: #f8f8f2;
}

.time-badge {
  background: linear-gradient(135deg, #50fa7b, #8be9fd);
  color: #1a1a2e;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9em;
}

.overview-description {
  color: #f8f8f2;
  line-height: 1.6;
  margin: 8px 0 0 0;
  font-size: 1.05em;
}

.tech-section {
  margin-bottom: 30px;
}

.tech-section-title {
  color: #ff79c6;
  font-size: 1.4em;
  font-weight: 700;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tech-section-description {
  color: #6272a4;
  font-style: italic;
  margin-bottom: 20px;
  line-height: 1.5;
  font-size: 1.05em;
}

.tech-list {
  display: grid;
  gap: 15px;
}

.tech-card {
  background: rgba(68, 71, 90, 0.4);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.main-tech-card {
  border-left-color: #ff79c6;
  border: 1px solid rgba(255, 121, 198, 0.3);
}

.main-tech-card:hover {
  background: rgba(255, 121, 198, 0.1);
  transform: translateX(5px);
}

.optional-tech-card {
  border-left-color: #bd93f9;
  border: 1px solid rgba(189, 147, 249, 0.3);
}

.optional-tech-card:hover {
  background: rgba(189, 147, 249, 0.1);
  transform: translateX(5px);
}

.tech-name {
  color: #8be9fd;
  font-size: 1.2em;
  font-weight: 600;
  margin: 0 0 10px 0;
}

.tech-reason {
  color: #f8f8f2;
  margin: 8px 0;
  line-height: 1.5;
}

.tech-synergy {
  color: #50fa7b;
  margin: 8px 0 0 0;
  line-height: 1.5;
  font-style: italic;
}

.concepts-section {
  background: linear-gradient(135deg, rgba(80, 250, 123, 0.1), rgba(139, 233, 253, 0.1));
  border: 1px solid rgba(80, 250, 123, 0.3);
  border-radius: 12px;
  padding: 25px;
  margin-top: 25px;
}

.concepts-title {
  color: #50fa7b;
  font-size: 1.4em;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
}

.concepts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
}

.concept-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
}

.concept-bullet {
  color: #8be9fd;
  font-weight: bold;
  margin-top: 2px;
  flex-shrink: 0;
}

.concept-text {
  color: #f8f8f2;
  line-height: 1.4;
  font-size: 0.95em;
}

/* Responsive */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 10px;
  }
  
  .phase-modal-content {
    max-height: 95vh;
  }
  
  .modal-header {
    padding: 20px;
  }
  
  .phase-modal-title {
    font-size: 1.4em;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .overview-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .overview-label {
    min-width: auto;
    margin-bottom: 5px;
  }
  
  .concepts-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .tech-section-title {
    font-size: 1.2em;
  }
}

@media (max-width: 480px) {
  .phase-modal-title {
    font-size: 1.2em;
  }
  
  .modal-header {
    padding: 15px;
  }
  
  .modal-body {
    padding: 15px;
  }
  
  .tech-card {
    padding: 15px;
  }
  
  .concepts-section {
    padding: 20px;
  }
}
</style>
