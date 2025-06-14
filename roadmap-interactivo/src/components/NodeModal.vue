<template>
  <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <!-- Header with close button -->
      <div class="modal-header">
        <div class="header-left">
          <div class="title-and-status">
            <h2 class="modal-title">{{ node.name }}</h2>
            <div class="status-dropdown">
              <div class="status-wrapper">
                <span class="status-icon">🏷️</span>
                <select 
                  v-model="currentStatus" 
                  @change="updateStatus"
                  class="status-select"
                  :value="currentStatus"
                >
                  <option value="pending">Pendiente</option>
                  <option value="in-progress">En Progreso</option>
                  <option value="completed">Completado</option>
                  <option value="skipped">Omitida</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <button class="close-button" @click="closeModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      
      <!-- Scrollable content area with glow effect -->
      <div class="modal-body" @scroll="onScroll" ref="scrollContainer">
        <div class="content-wrapper">
          <!-- Basic Information - Compact -->
          <div class="info-section-compact">
            <div class="info-row">
              <span class="info-item-compact">
                <span class="difficulty-stars" :style="{ color: getDifficultyColor(node.difficulty) }">
                  {{ getDifficultyStars(node.difficulty) }} {{ node.difficulty }}
                </span>
              </span>
              <span class="info-item-compact">
                <span class="info-icon-small">⏱️</span>
                <span class="info-text">{{ node.timeEstimate }}</span>
              </span>
              <span class="info-item-compact">
                <span class="info-icon-small">{{ node.isMain ? '🎯' : '💡' }}</span>
                <span class="info-text">{{ node.isMain ? 'Principal' : 'Opcional' }}</span>
              </span>
            </div>
          </div>

          <!-- Description Section -->
          <div class="description-section">
            <h3 class="section-title">📚 Descripción</h3>
            <div class="description-content">
              <p>{{ getBriefDescription(node.name) }}</p>
            </div>
          </div>

          <!-- Detailed Description Section -->
          <div class="detailed-description-section">
            <h3 class="section-title">📖 Descripción Detallada</h3>
            <div class="detailed-description-content">
              <p>{{ getDetailedDescription(node.name) }}</p>
            </div>
          </div>

          <!-- Key Concepts Section -->
          <div v-if="getKeyConcepts(node.name).length > 0" class="concepts-section">
            <h3 class="section-title">💡 Conceptos Clave</h3>
            <div class="concepts-grid">
              <div 
                v-for="concept in getKeyConcepts(node.name)" 
                :key="concept.name"
                class="concept-item"
                :title="concept.description"
              >
                <span class="concept-icon">📌</span>
                <span class="concept-name">{{ concept.name }}</span>
                <div class="concept-tooltip">{{ concept.description }}</div>
              </div>
            </div>
          </div>

          <!-- Learning Path Section -->
          <div v-if="getLearningPath(node.name).length > 0" class="learning-path-section">
            <h3 class="section-title">🎯 Ruta de Aprendizaje</h3>
            <div class="learning-steps">
              <div 
                v-for="(step, index) in getLearningPath(node.name)" 
                :key="index"
                class="learning-step"
                :class="{ 'completed': isStepCompleted(node.id, index) }"
              >
                <div class="step-header">
                  <input 
                    type="checkbox" 
                    :id="`step-${node.id}-${index}`"
                    :checked="isStepCompleted(node.id, index)"
                    @change="toggleStep(node.id, index)"
                    class="step-checkbox"
                  />
                  <label :for="`step-${node.id}-${index}`" class="step-number">{{ index + 1 }}</label>
                </div>
                <div class="step-content">{{ step }}</div>
              </div>
            </div>
            <div class="learning-progress">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: getLearningProgress(node.id) + '%' }"
                ></div>
              </div>
              <span class="progress-text">
                {{ getCompletedSteps(node.id) }}/{{ getLearningPath(node.name).length }} completados
              </span>
            </div>
          </div>

          <!-- Resources Section -->
          <div v-if="getLearningResources(node.name).length > 0" class="resources-section">
            <h3 class="section-title">📖 Recursos de Aprendizaje</h3>
            <div class="resources-grid">
              <a 
                v-for="resource in getLearningResources(node.name)" 
                :key="resource.title"
                :href="resource.url" 
                target="_blank" 
                rel="noopener noreferrer"
                class="resource-card"
              >
                <div class="resource-icon">{{ resource.icon }}</div>
                <div class="resource-content">
                  <span class="resource-title">{{ resource.title }}</span>
                  <span class="resource-type">{{ getResourceType(resource.icon) }}</span>
                </div>
                <div class="resource-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </a>
            </div>
          </div>

          <!-- Spacer reduced -->
          <div class="content-spacer-small"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDifficultyColor, getDifficultyStars } from '../data/roadmapData.js'

export default {
  name: 'NodeModal',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    node: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['close', 'update-status'],
  data() {
    return {
      currentStatus: 'pending',
      learningProgress: {}
    }
  },
  watch: {
    isVisible(newVal) {
      if (newVal) {
        // Inicializar el estado actual basado en el nodo
        this.currentStatus = this.getNodeStatus()
        this.loadLearningProgress()
        this.$nextTick(() => {
          this.updateSelectStyle()
        })
      }
    },
    currentStatus() {
      this.$nextTick(() => {
        this.updateSelectStyle()
      })
    }
  },
  methods: {
    getDifficultyColor,
    getDifficultyStars,
    closeModal() {
      this.$emit('close')
    },
    handleOverlayClick() {
      // En móvil (pantallas menores a 768px) no cerrar el modal al hacer clic en el overlay
      if (window.innerWidth >= 768) {
        this.closeModal()
      }
    },
    getNodeStatus() {
      // Convertir el estado del nodo a formato del dropdown
      if (this.node.completed) return 'completed'
      if (this.node.status) return this.node.status
      return 'pending'
    },
    updateStatus() {
      const previousStatus = this.getNodeStatus()
      
      // Si cambia a "completado" manualmente, marcar todos los pasos
      if (this.currentStatus === 'completed' && previousStatus !== 'completed') {
        this.markAllStepsCompleted(this.node.id)
      }
      
      // Si cambia de "completado" a cualquier otro estado, limpiar progreso
      if (previousStatus === 'completed' && this.currentStatus !== 'completed') {
        this.clearLearningProgress(this.node.id)
      }
      
      // Si cambia a "omitida", limpiar el progreso de aprendizaje
      if (this.currentStatus === 'skipped') {
        this.clearLearningProgress(this.node.id)
      }
      
      this.$emit('update-status', {
        node: this.node,
        status: this.currentStatus
      })
      
      this.saveLearningProgress()
    },
    
    // Métodos de persistencia
    loadLearningProgress() {
      const saved = localStorage.getItem('roadmap-learning-progress')
      if (saved) {
        this.learningProgress = JSON.parse(saved)
      }
    },
    
    saveLearningProgress() {
      localStorage.setItem('roadmap-learning-progress', JSON.stringify(this.learningProgress))
    },
    
    // Métodos de pasos de aprendizaje
    toggleStep(nodeId, stepIndex) {
      if (!this.learningProgress[nodeId]) {
        this.learningProgress[nodeId] = {}
      }
      
      const isCompleted = this.learningProgress[nodeId][stepIndex]
      this.learningProgress[nodeId][stepIndex] = !isCompleted
      
      // Solo cambiar estado automáticamente si no está en "completado" manualmente
      if (this.currentStatus !== 'completed') {
        // Si marcamos un paso, cambiar estado a "en progreso"
        if (!isCompleted && this.currentStatus === 'pending') {
          this.currentStatus = 'in-progress'
          this.updateStatus()
        }
        
        // Verificar si todos los pasos están completados
        const totalSteps = this.getLearningPath(this.node.name).length
        const completedSteps = this.getCompletedSteps(nodeId)
        
        if (completedSteps === totalSteps && totalSteps > 0) {
          this.currentStatus = 'completed'
          this.updateStatus()
        }
      }
      
      this.saveLearningProgress()
    },
    
    isStepCompleted(nodeId, stepIndex) {
      return this.learningProgress[nodeId] && this.learningProgress[nodeId][stepIndex]
    },
    
    getCompletedSteps(nodeId) {
      if (!this.learningProgress[nodeId]) return 0
      return Object.values(this.learningProgress[nodeId]).filter(Boolean).length
    },
    
    getLearningProgress(nodeId) {
      const totalSteps = this.getLearningPath(this.node.name).length
      const completedSteps = this.getCompletedSteps(nodeId)
      return totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0
    },
    
    clearLearningProgress(nodeId) {
      if (this.learningProgress[nodeId]) {
        delete this.learningProgress[nodeId]
        this.saveLearningProgress()
      }
    },
    
    markAllStepsCompleted(nodeId) {
      const totalSteps = this.getLearningPath(this.node.name).length
      if (totalSteps > 0) {
        this.learningProgress[nodeId] = {}
        for (let i = 0; i < totalSteps; i++) {
          this.learningProgress[nodeId][i] = true
        }
        this.saveLearningProgress()
      }
    },
    updateSelectStyle() {
      const select = this.$el?.querySelector('.status-select')
      if (select) {
        select.setAttribute('value', this.currentStatus)
      }
    },
    getResourceType(icon) {
      const types = {
        '📖': 'Documentación',
        '🎥': 'Video Tutorial',
        '🔧': 'Herramienta',
        '📚': 'Guía',
        '🎮': 'Interactivo',
        '📱': 'App/Herramienta',
        '🎭': 'Biblioteca'
      }
      return types[icon] || 'Recurso'
    },
    getBriefDescription(techName) {
      const briefDescriptions = {
        'HTML/CSS': 'Fundamentos de estructura web con HTML semántico y diseño responsivo con CSS.',
        'JavaScript': 'Lenguaje de programación esencial para interactividad y lógica en aplicaciones web.',
        'Git/GitHub': 'Sistema de control de versiones distribuido esencial para desarrollo colaborativo y gestión de software.',
        'NPM': 'Gestor de paquetes de Node.js para instalar y gestionar dependencias de proyectos JavaScript.',
        'Vite': 'Herramienta de build moderna ultra-rápida con Hot Module Replacement instantáneo.',
        'Vue.js': 'Framework progresivo para interfaces de usuario con curva de aprendizaje suave.',
        'React': 'Librería declarativa para UIs con vasto ecosistema y gran adopción industrial.',
        'TypeScript': 'Superset de JavaScript que añade tipado estático opcional para mayor robustez.',
        'Firebase': 'Plataforma Backend-as-a-Service de Google para desarrollo rápido de aplicaciones.',
        'Testing': 'Conjunto de prácticas para verificar la calidad y funcionamiento del software.',
        'Testing Library': 'Utilidades de testing centradas en el comportamiento del usuario.',
        'PWAs': 'Apps web con capacidades nativas como offline, notificaciones e instalación.',
        'GraphQL': 'Lenguaje de consulta para APIs que permite solicitar datos específicos.',
        'Puppeteer': 'Librería para automatización de navegador y testing end-to-end.',
        'Express.js': 'Framework web minimalista y flexible para Node.js backend.',
        'Nuxt.js': 'Meta-framework de Vue.js para aplicaciones universales con SSR/SSG.',
        'Jest': 'Framework de testing con herramientas integradas para JavaScript.',
        'Vitest': 'Runner de tests moderno y ultrarrápido compatible con Jest.',
        'Astro': 'Framework para sitios web ultra-rápidos con arquitectura de islas.',
        'Expo (RN)': 'Plataforma para desarrollo móvil con React Native simplificado.',
        'Electron': 'Framework para aplicaciones de escritorio usando tecnologías web.',
        'Webpack': 'Bundler de módulos estático para aplicaciones JavaScript complejas.',
        'Sass/SCSS': 'Preprocesador CSS con variables, anidamiento y funciones avanzadas.',
        'MongoDB': 'Base de datos NoSQL orientada a documentos para escalabilidad horizontal.',
        'Docker': 'Plataforma de contenerización para empaquetado y despliegue consistente.',
        'Tailwind CSS': 'Framework CSS utility-first para desarrollo rápido con clases predefinidas.'
      }
      return briefDescriptions[techName] || 'Tecnología fundamental para el desarrollo web moderno.'
    },
    getDetailedDescription(techName) {
      const detailedDescriptions = {
        'Git/GitHub': 'Git es el sistema de control de versiones más utilizado en el mundo del desarrollo. Permite rastrear cambios en el código, colaborar con otros desarrolladores, mantener un historial completo de modificaciones y gestionar diferentes versiones del proyecto. GitHub es la plataforma más popular para alojar repositorios Git, ofreciendo herramientas adicionales como issues, pull requests, actions para CI/CD y colaboración en equipo.',
        'HTML/CSS': 'HTML proporciona la estructura semántica de los documentos web con elementos como header, nav, main, section, article y footer. CSS controla la presentación visual incluyendo layouts modernos con Flexbox y Grid, diseño responsivo con media queries, y animaciones CSS. Juntos forman la base visual de toda aplicación web.',
        'JavaScript': 'JavaScript es el lenguaje de programación que da vida a las páginas web. Permite manipular el DOM, manejar eventos del usuario, realizar peticiones HTTP asíncronas, y crear aplicaciones interactivas complejas. Incluye ES6+ con arrow functions, destructuring, modules, async/await y más.',
        'Vue.js': 'Vue.js es un framework progresivo que se destaca por su facilidad de aprendizaje y flexibilidad. Su sistema de reactividad automático mantiene la UI sincronizada con los datos, mientras que la Composition API permite organizar la lógica de manera modular y reutilizable. Es ideal tanto para prototipos rápidos como para aplicaciones empresariales.',
        'React': 'React revolucionó el desarrollo frontend con su modelo de componentes y Virtual DOM. Su ecosistema incluye herramientas como React Router para navegación, Redux para gestión de estado global, y Next.js para aplicaciones full-stack. Los Hooks permiten reutilizar lógica entre componentes de manera elegante.',
        'Vite': 'Vite utiliza ES modules nativos durante el desarrollo, eliminando la necesidad de bundling y proporcionando un Hot Module Replacement casi instantáneo. En producción utiliza Rollup para crear builds optimizados. Su arquitectura basada en plugins permite extensibilidad y soporte para múltiples frameworks.',
        'TypeScript': 'TypeScript añade un sistema de tipos estático a JavaScript, detectando errores en tiempo de compilación y mejorando la experiencia de desarrollo con autocompletado inteligente. Es especialmente valioso en equipos grandes y proyectos complejos donde la mantenibilidad es crucial.',
        'Express.js': 'Express.js es el framework web más popular para Node.js, conocido por su minimalismo y flexibilidad. Su arquitectura basada en middleware permite construir aplicaciones modulares, desde APIs REST simples hasta aplicaciones web complejas con autenticación, validación y manejo de errores.',
        'Firebase': 'Firebase simplifica el desarrollo backend proporcionando servicios como Firestore (base de datos en tiempo real), Authentication (autenticación), Storage (almacenamiento de archivos), y Hosting (alojamiento web). Permite crear aplicaciones completas sin gestionar servidores propios.',
        'Tailwind CSS': 'Tailwind CSS es un framework utility-first que proporciona clases de utilidad de bajo nivel para construir diseños personalizados. Incluye un sistema de diseño consistente, responsive design integrado, y purging automático de CSS no utilizado en producción, resultando en archivos finales muy pequeños.'
      }
      return detailedDescriptions[techName] || this.getEnhancedDescription(techName)
    },
    getEnhancedDescription(techName) {
      const descriptions = {
        'HTML/CSS': 'Los fundamentos de la estructura y presentación web. HTML proporciona la semántica y accesibilidad mediante elementos estructurales, mientras CSS define el diseño visual con layouts modernos como Flexbox y Grid, responsive design y animaciones.',
        'JavaScript': 'El lenguaje de programación que transforma páginas estáticas en aplicaciones dinámicas e interactivas. Permite manipular el DOM, manejar eventos, realizar peticiones HTTP y crear experiencias de usuario ricas y modernas.',
        'Git/GitHub': 'Tu red de seguridad y herramienta de colaboración principal. Git es un sistema de control de versiones distribuido que te permite rastrear cambios, crear ramas, y colaborar efectivamente. GitHub añade una interfaz web y herramientas de colaboración adicionales.',
        'NPM': 'El gestor de paquetes por defecto de Node.js que te permite instalar, gestionar y compartir paquetes de código reutilizable. Es fundamental para acelerar el desarrollo mediante la reutilización de librerías y herramientas de la comunidad.',
        'Vite': 'Herramienta de compilación y servidor de desarrollo de próxima generación, increíblemente rápida. Aprovecha los módulos ES nativos durante el desarrollo para un Hot Module Replacement casi instantáneo y utiliza Rollup para builds de producción optimizados.',
        'Vue.js': 'Framework progresivo y amigable para construir interfaces de usuario. Conocido por su curva de aprendizaje suave, excelente documentación y sistema de reactividad intuitivo. Permite escalar desde pequeños widgets hasta aplicaciones SPA completas.',
        'React': 'Librería declarativa para construir interfaces de usuario. Extremadamente popular en la industria con un vasto ecosistema. Utiliza JSX y un modelo de componentes funcionales con Hooks para manejar estado y efectos.',
        'TypeScript': 'Superset de JavaScript que añade tipado estático opcional, interfaces, enums y genéricos. Mejora significativamente la robustez y mantenibilidad del código, especialmente en proyectos grandes.',
        'Firebase': 'Plataforma de desarrollo de aplicaciones Backend-as-a-Service (BaaS) de Google. Proporciona autenticación, base de datos en tiempo real, almacenamiento, hosting y más, permitiendo crear backends rápidamente sin servidor propio.',
        'Testing': 'Conjunto de prácticas y herramientas para verificar que tu código funciona correctamente. Incluye pruebas unitarias, de integración y end-to-end para asegurar la calidad y robustez del software.',
        'Testing Library': 'Familia de utilidades simples y completas para testing que fomenta buenas prácticas de testing. Se centra en probar el comportamiento como lo haría un usuario real.',
        'PWAs': 'Progressive Web Apps son aplicaciones web que utilizan tecnologías modernas para ofrecer experiencias similares a apps nativas. Incluyen capacidades offline, notificaciones push e instalación.',
        'GraphQL': 'Lenguaje de consulta para APIs que permite a los clientes solicitar exactamente los datos que necesitan. Proporciona una alternativa eficiente a las APIs REST tradicionales.',
        'Puppeteer': 'Librería Node.js que proporciona una API de alto nivel para controlar Chrome/Chromium. Excelente para automatización de navegador, testing E2E, web scraping y generación de PDFs.',
        'Express.js': 'Framework web minimalista y flexible para Node.js. Es no opinionado, lo que te da control total sobre la estructura de tu aplicación. Ideal para construir APIs REST y aplicaciones web backend.',
        'Nuxt.js': 'Meta-framework construido sobre Vue.js que simplifica el desarrollo de aplicaciones universales (SSR), sitios estáticos (SSG) y SPAs complejas. Proporciona estructura opinionada y características listas para usar.',
        'Jest': 'Framework de testing completo con "baterías incluidas". Proporciona assertions, mocks, runner y reportes de cobertura. Su snapshot testing es especialmente útil para UIs.',
        'Vitest': 'Runner de tests moderno y ultrarrápido, compatible con la API de Jest pero diseñado para proyectos Vite. Ofrece HMR para tests y transpilación veloz.',
        'Astro': 'Framework moderno para construir sitios web centrados en contenido que cargan extremadamente rápido. Su innovación es la "arquitectura de islas" con cero JS por defecto e hidratación selectiva.',
        'Expo (RN)': 'Plataforma que simplifica el desarrollo de aplicaciones móviles nativas con React Native. Proporciona SDK, herramientas de desarrollo y servicios de build en la nube.',
        'Electron': 'Framework que permite construir aplicaciones de escritorio multiplataforma usando HTML, CSS y JavaScript. Combina Chromium y Node.js en un solo runtime.',
        'Webpack': 'Bundler de módulos estático para aplicaciones JavaScript modernas. Aunque más complejo que Vite, sigue siendo ampliamente usado en proyectos enterprise y ofrece configuración muy granular.',
        'Sass/SCSS': 'Preprocesador CSS que extiende CSS con características como variables, anidamiento, mixins, y funciones. SCSS mantiene compatibilidad con CSS normal mientras añade funcionalidades.',
        'MongoDB': 'Base de datos NoSQL orientada a documentos que almacena datos en formato similar a JSON. Excelente para datos semi-estructurados y aplicaciones que requieren escalabilidad horizontal.',
        'Docker': 'Plataforma de contenerización que permite empaquetar aplicaciones con todas sus dependencias en contenedores ligeros y portables. Fundamental para DevOps y despliegue consistente.',
        'Tailwind CSS': 'Framework CSS utility-first que proporciona clases de utilidad de bajo nivel para construir diseños personalizados. Permite desarrollo rápido sin escribir CSS personalizado.'
      }
      return descriptions[techName] || this.node.description || 'Tecnología fundamental para el desarrollo web moderno.'
    },
    getKeyConcepts(techName) {
      const concepts = {
        'HTML/CSS': [
          { name: 'Semántica HTML5', description: 'Uso de etiquetas HTML para definir el significado y función del contenido web' },
          { name: 'Elementos estructurales', description: 'Tags como header, nav, main, section, article para organizar el contenido' },
          { name: 'CSS Flexbox', description: 'Sistema de layout unidimensional para alinear elementos en filas o columnas' },
          { name: 'CSS Grid', description: 'Sistema de layout bidimensional para crear diseños complejos con filas y columnas' },
          { name: 'Responsive Design', description: 'Técnicas para que el sitio web se adapte a diferentes tamaños de pantalla' },
          { name: 'Media Queries', description: 'Reglas CSS que aplican estilos según características del dispositivo' },
          { name: 'CSS Variables', description: 'Propiedades personalizadas reutilizables que almacenan valores en CSS' }
        ],
        'JavaScript': [
          { name: 'ES6+ Features', description: 'Nuevas características de JavaScript moderno como let, const, arrow functions' },
          { name: 'DOM manipulation', description: 'Técnicas para modificar elementos HTML desde JavaScript dinámicamente' },
          { name: 'Event Handling', description: 'Manejo de eventos del usuario como clicks, teclas, movimientos del mouse' },
          { name: 'Promises y Async/Await', description: 'Patrones para manejar operaciones asíncronas de forma más legible' },
          { name: 'Fetch API', description: 'Interfaz moderna para realizar peticiones HTTP desde el navegador' },
          { name: 'Arrow Functions', description: 'Sintaxis más concisa para escribir funciones en JavaScript' },
          { name: 'Destructuring', description: 'Técnica para extraer valores de arrays y objetos de forma concisa' }
        ],
        'Git/GitHub': [
          { name: 'Commits atómicos', description: 'Commits pequeños y enfocados que representan un cambio lógico específico' },
          { name: 'Branching strategies', description: 'Estrategias para organizar ramas de desarrollo como Git Flow o GitHub Flow' },
          { name: 'Merge vs Rebase', description: 'Diferentes formas de integrar cambios entre ramas con sus pros y contras' },
          { name: 'Pull Requests', description: 'Mecanismo para proponer, revisar e integrar cambios en un repositorio' },
          { name: 'Code Reviews', description: 'Proceso de revisar código de otros desarrolladores para mejorar calidad' },
          { name: 'Gitflow', description: 'Modelo de branching que define tipos específicos de ramas para desarrollo' },
          { name: 'Resolución de conflictos', description: 'Proceso para resolver cuando dos cambios afectan las mismas líneas' }
        ],
        'NPM': [
          { name: 'package.json', description: 'Archivo que define metadatos, dependencias y scripts de un proyecto Node.js' },
          { name: 'Dependencias vs DevDependencies', description: 'Diferencia entre paquetes necesarios en producción vs desarrollo' },
          { name: 'Scripts de NPM', description: 'Comandos personalizados definidos en package.json para automatizar tareas' },
          { name: 'Versionado semántico', description: 'Sistema de versiones con formato MAJOR.MINOR.PATCH para compatibilidad' },
          { name: 'NPM Registry', description: 'Repositorio público donde se almacenan y distribuyen paquetes de Node.js' },
          { name: 'Node_modules', description: 'Carpeta donde se instalan localmente las dependencias del proyecto' },
          { name: 'Lock files', description: 'Archivos que garantizan instalaciones consistentes de dependencias' }
        ],
        'Vite': [
          { name: 'Hot Module Replacement', description: 'Actualización en tiempo real de módulos sin perder el estado de la aplicación' },
          { name: 'ES Modules', description: 'Sistema nativo de módulos de JavaScript que Vite aprovecha para rapidez' },
          { name: 'Build optimizations', description: 'Técnicas automáticas para optimizar el código para producción' },
          { name: 'Plugins ecosystem', description: 'Sistema extensible de plugins para añadir funcionalidades a Vite' },
          { name: 'Environment variables', description: 'Variables de configuración que pueden cambiar entre entornos' },
          { name: 'Asset handling', description: 'Procesamiento automático de archivos estáticos como imágenes y CSS' },
          { name: 'Development server', description: 'Servidor de desarrollo ultrarrápido con recarga automática' }
        ],
        'Vue.js': [
          { name: 'Directivas (v-if, v-for, v-model)', description: 'Atributos especiales que aplican lógica reactiva a elementos HTML' },
          { name: 'Composition API', description: 'Nueva forma de organizar lógica de componentes de manera más flexible' },
          { name: 'Computed properties', description: 'Propiedades derivadas que se recalculan automáticamente cuando cambian dependencias' },
          { name: 'Watchers', description: 'Funciones que se ejecutan cuando una propiedad reactiva cambia' },
          { name: 'Component lifecycle', description: 'Hooks que se ejecutan en diferentes momentos de vida de un componente' },
          { name: 'Props y Events', description: 'Mecanismo para pasar datos hacia abajo y comunicar eventos hacia arriba' },
          { name: 'Vue Router', description: 'Librería oficial para manejar navegación entre páginas en aplicaciones SPA' },
          { name: 'Pinia State Management', description: 'Store oficial de Vue para gestionar estado global de la aplicación' }
        ],
        'React': [
          { name: 'JSX syntax', description: 'Extensión de sintaxis que permite escribir elementos HTML dentro de JavaScript' },
          { name: 'Functional Components', description: 'Componentes definidos como funciones JavaScript, el estándar moderno' },
          { name: 'Hooks (useState, useEffect)', description: 'Funciones especiales para añadir estado y efectos a componentes funcionales' },
          { name: 'Props y State', description: 'Props para pasar datos y State para manejar datos internos del componente' },
          { name: 'Context API', description: 'Sistema para compartir datos entre componentes sin pasar props manualmente' },
          { name: 'React Router', description: 'Librería para manejar navegación declarativa en aplicaciones React' },
          { name: 'Virtual DOM', description: 'Representación virtual del DOM para optimizar actualizaciones de la UI' },
          { name: 'Component lifecycle', description: 'Métodos que se ejecutan en diferentes fases de vida de un componente' }
        ],
        'TypeScript': [
          { name: 'Static typing', description: 'Sistema de tipos que detecta errores en tiempo de compilación' },
          { name: 'Interfaces', description: 'Contratos que definen la estructura que debe tener un objeto' },
          { name: 'Type inference', description: 'Capacidad de TypeScript para deducir tipos automáticamente' },
          { name: 'Generics', description: 'Tipos parametrizados que permiten reutilizar código con diferentes tipos' },
          { name: 'Union types', description: 'Tipos que pueden ser uno de varios tipos específicos' },
          { name: 'Type guards', description: 'Técnicas para verificar y asegurar tipos en tiempo de ejecución' },
          { name: 'Decorators', description: 'Metadatos que modifican el comportamiento de clases y métodos' },
          { name: 'Module system', description: 'Sistema para organizar código en módulos reutilizables y tipados' }
        ],
        'Firebase': [
          { name: 'Firestore Database', description: 'Base de datos NoSQL en tiempo real escalable en la nube' },
          { name: 'Authentication', description: 'Sistema de autenticación con múltiples proveedores (email, Google, etc.)' },
          { name: 'Cloud Storage', description: 'Almacenamiento de archivos escalable para aplicaciones web y móviles' },
          { name: 'Hosting', description: 'Hosting rápido y seguro para aplicaciones web con CDN global' },
          { name: 'Cloud Functions', description: 'Funciones serverless que se ejecutan en respuesta a eventos' },
          { name: 'Real-time updates', description: 'Actualizaciones automáticas cuando los datos cambian en la base' },
          { name: 'Security rules', description: 'Reglas de seguridad para controlar acceso a datos y archivos' },
          { name: 'SDK integration', description: 'Librerías oficiales para integrar Firebase en aplicaciones web' }
        ],
        'Express.js': [
          { name: 'Middleware pattern', description: 'Funciones que procesan peticiones de forma secuencial y modular' },
          { name: 'Routing', description: 'Sistema para definir cómo responde la aplicación a diferentes endpoints' },
          { name: 'Request/Response objects', description: 'Objetos que contienen información de petición y permiten enviar respuestas' },
          { name: 'Error handling', description: 'Estrategias para capturar y manejar errores de forma centralizada' },
          { name: 'Database integration', description: 'Conexión y operaciones con bases de datos SQL y NoSQL' },
          { name: 'Authentication', description: 'Implementación de sistemas de login y autorización' },
          { name: 'RESTful APIs', description: 'Diseño de APIs siguiendo principios REST para operaciones CRUD' },
          { name: 'CORS', description: 'Configuración para permitir peticiones desde diferentes dominios' }
        ],
        'Testing': [
          { name: 'Unit testing', description: 'Pruebas de unidades individuales de código de forma aislada' },
          { name: 'Integration testing', description: 'Pruebas de cómo interactúan diferentes módulos entre sí' },
          { name: 'E2E testing', description: 'Pruebas que simulan el comportamiento completo del usuario' },
          { name: 'Test-driven development', description: 'Metodología donde se escriben las pruebas antes del código' },
          { name: 'Mocking', description: 'Técnica para simular dependencias externas en las pruebas' },
          { name: 'Assertions', description: 'Verificaciones que comprueban si el resultado es el esperado' },
          { name: 'Code coverage', description: 'Métrica que mide qué porcentaje del código está siendo probado' },
          { name: 'CI/CD integration', description: 'Automatización de pruebas en pipelines de integración continua' }
        ],
        'Nuxt.js': [
          { name: 'SSR/SSG', description: 'Renderizado del lado del servidor y generación de sitios estáticos' },
          { name: 'File-based routing', description: 'Sistema de rutas automático basado en la estructura de archivos' },
          { name: 'Layouts', description: 'Plantillas reutilizables que envuelven el contenido de las páginas' },
          { name: 'Auto-imports', description: 'Importación automática de componentes y funciones sin declaración explícita' },
          { name: 'Server routes', description: 'Endpoints de API definidos en el mismo proyecto que el frontend' },
          { name: 'Data fetching', description: 'Métodos optimizados para obtener datos en el servidor y cliente' },
          { name: 'SEO optimization', description: 'Herramientas integradas para mejorar el posicionamiento en buscadores' },
          { name: 'Performance', description: 'Optimizaciones automáticas de rendimiento como code splitting' }
        ],
        'Astro': [
          { name: 'Islands architecture', description: 'Patrón donde solo las partes interactivas cargan JavaScript' },
          { name: 'Zero JS by default', description: 'Genera sitios web sin JavaScript a menos que sea explícitamente necesario' },
          { name: 'Component frameworks integration', description: 'Soporte para usar React, Vue, Svelte en el mismo proyecto' },
          { name: 'Static site generation', description: 'Generación de sitios estáticos ultrarrápidos en tiempo de build' },
          { name: 'Content collections', description: 'Sistema para manejar contenido estructurado como blogs o documentación' },
          { name: 'Partial hydration', description: 'Hidratación selectiva solo de componentes que necesitan interactividad' }
        ],
        'Testing Library': [
          { name: 'User-centric testing', description: 'Enfoque de testing que prioriza cómo interactúa el usuario real' },
          { name: 'Query methods', description: 'Métodos para encontrar elementos como getByText, getByRole' },
          { name: 'Async utilities', description: 'Herramientas para esperar cambios asincrónicos en el DOM' },
          { name: 'Fire events', description: 'Simulación de eventos del usuario como clicks y cambios de input' },
          { name: 'Accessibility testing', description: 'Verificación automática de buenas prácticas de accesibilidad' },
          { name: 'Component testing', description: 'Pruebas enfocadas en componentes individuales de UI' }
        ],
        'PWAs': [
          { name: 'Service Workers', description: 'Scripts que actúan como proxy entre la app y la red para funcionalidad offline' },
          { name: 'Web App Manifest', description: 'Archivo JSON que define cómo se comporta la app cuando se instala' },
          { name: 'Offline functionality', description: 'Capacidad de la app para funcionar sin conexión a internet' },
          { name: 'Push notifications', description: 'Sistema para enviar notificaciones al usuario desde el servidor' },
          { name: 'Install prompts', description: 'Mecánica para permitir al usuario instalar la web app' },
          { name: 'App Shell pattern', description: 'Arquitectura que carga la interfaz mínima primero' },
          { name: 'Background sync', description: 'Sincronización de datos cuando se recupera la conectividad' }
        ],
        'GraphQL': [
          { name: 'Schema definition', description: 'Definición de tipos y operaciones disponibles en la API' },
          { name: 'Queries', description: 'Operaciones para leer datos específicos del servidor' },
          { name: 'Mutations', description: 'Operaciones para modificar datos en el servidor' },
          { name: 'Resolvers', description: 'Funciones que obtienen los datos para cada campo del schema' },
          { name: 'Type system', description: 'Sistema de tipos fuerte que define la estructura de datos' },
          { name: 'Subscriptions', description: 'Operaciones para recibir actualizaciones en tiempo real' },
          { name: 'Introspection', description: 'Capacidad de la API para describir su propio schema' }
        ],
        'Tailwind CSS': [
          { name: 'Utility-first approach', description: 'Metodología que usa clases pequeñas y específicas para cada estilo' },
          { name: 'Responsive design', description: 'Clases con prefijos para diferentes breakpoints de pantalla' },
          { name: 'Component extraction', description: 'Técnica para reutilizar combinaciones de utilidades' },
          { name: 'Customization', description: 'Configuración del tema, colores y espaciados personalizados' },
          { name: 'JIT compilation', description: 'Generación bajo demanda solo de las clases que se utilizan' },
          { name: 'Design tokens', description: 'Sistema consistente de valores para colores, espacios y tipografía' }
        ],
        'Electron': [
          { name: 'Main process', description: 'Proceso principal que controla el ciclo de vida de la aplicación' },
          { name: 'Renderer process', description: 'Procesos que muestran la interfaz usando tecnologías web' },
          { name: 'IPC communication', description: 'Comunicación entre procesos principal y de renderizado' },
          { name: 'Native APIs', description: 'Acceso a funcionalidades del sistema operativo' },
          { name: 'Auto-updater', description: 'Sistema automático para actualizar la aplicación' },
          { name: 'Menu and shortcuts', description: 'Creación de menús nativos y atajos de teclado' },
          { name: 'Packaging', description: 'Proceso de empaquetar la app para diferentes sistemas operativos' }
        ],
        'Expo (RN)': [
          { name: 'Expo CLI', description: 'Herramientas de línea de comandos para desarrollo y build' },
          { name: 'Expo Go', description: 'App para probar desarrollos en dispositivos reales sin compilar' },
          { name: 'EAS Build', description: 'Servicio en la nube para compilar apps nativas' },
          { name: 'Native modules', description: 'Acceso a funcionalidades nativas del dispositivo' },
          { name: 'Push notifications', description: 'Sistema integrado para notificaciones push' },
          { name: 'Over-the-air updates', description: 'Actualizaciones de la app sin pasar por las stores' }
        ],
        'AdonisJS': [
          { name: 'MVC architecture', description: 'Patrón Modelo-Vista-Controlador para organizar la aplicación' },
          { name: 'Lucid ORM', description: 'Object-Relational Mapping para interactuar con bases de datos' },
          { name: 'Ace CLI', description: 'Interfaz de línea de comandos para generar código y gestionar el proyecto' },
          { name: 'Authentication', description: 'Sistema integrado de autenticación con guards y providers' },
          { name: 'Validation', description: 'Validación de datos de entrada con reglas personalizables' },
          { name: 'Middleware', description: 'Funciones que se ejecutan antes o después de las rutas' },
          { name: 'IoC Container', description: 'Contenedor de inversión de control para gestión de dependencias' }
        ],
        'Inertia.js': [
          { name: 'SPA experience', description: 'Experiencia de Single Page App sin la complejidad de APIs' },
          { name: 'Server-side routing', description: 'Uso del routing tradicional del backend' },
          { name: 'Shared data', description: 'Mecanismo para compartir datos entre backend y frontend' },
          { name: 'Partial reloads', description: 'Actualización solo de las partes necesarias de la página' },
          { name: 'Form handling', description: 'Manejo optimizado de formularios con validación' },
          { name: 'Asset versioning', description: 'Versionado automático de assets para cache busting' }
        ],
        'Podman': [
          { name: 'Daemonless architecture', description: 'Arquitectura sin daemon central, más segura y ligera' },
          { name: 'Rootless containers', description: 'Ejecución de contenedores sin privilegios de root' },
          { name: 'Pod management', description: 'Agrupación de contenedores relacionados en pods' },
          { name: 'Docker compatibility', description: 'Compatibilidad con comandos y formatos de Docker' },
          { name: 'Systemd integration', description: 'Integración nativa con systemd para gestión de servicios' },
          { name: 'Security focus', description: 'Énfasis en seguridad y aislamiento de procesos' }
        ]
      }
      return concepts[techName] || []
    },
    getLearningPath(techName) {
      const paths = {
        'HTML/CSS': [
          'Aprende HTML semántico y elementos estructurales',
          'Domina CSS: selectors, box model, especificidad',
          'Practica Flexbox para layouts unidimensionales',
          'Implementa CSS Grid para layouts bidimensionales',
          'Desarrolla diseño responsivo con media queries',
          'Añade animaciones y transiciones CSS'
        ],
        'JavaScript': [
          'Aprende sintaxis básica: variables, tipos de datos, operadores',
          'Domina funciones, arrow functions y scope',
          'Practica manipulación del DOM y eventos',
          'Implementa ES6+: destructuring, modules, template literals',
          'Desarrolla programación asíncrona con async/await',
          'Construye proyectos interactivos completos'
        ],
        'Git/GitHub': [
          'Instala Git y configura tu identidad',
          'Aprende comandos básicos: init, add, commit, status',
          'Practica branching y merging',
          'Crea cuenta en GitHub y conecta repositorios',
          'Colabora en proyectos usando Pull Requests'
        ],
        'NPM': [
          'Instala Node.js y familiarízate con NPM',
          'Aprende a crear y configurar package.json',
          'Gestiona dependencias: install, update, uninstall',
          'Crea scripts personalizados para automatización',
          'Explora el registro NPM y publica paquetes',
          'Domina versionado semántico y lock files'
        ],
        'Tailwind CSS': [
          'Instala y configura Tailwind en tu proyecto',
          'Aprende clases utility básicas para layout',
          'Domina sistema de colores y espaciado',
          'Implementa diseño responsivo con prefijos',
          'Personaliza configuración y tema',
          'Optimiza para producción con purging'
        ],
        'Vite': [
          'Crea tu primer proyecto con Vite',
          'Comprende Hot Module Replacement en acción',
          'Configura plugins para tu framework favorito',
          'Optimiza assets y archivos estáticos',
          'Configura variables de entorno',
          'Prepara builds optimizados para producción'
        ],
        'Vue.js': [
          'Configura un proyecto con Vite + Vue',
          'Aprende la sintaxis de templates y directivas',
          'Crea componentes reutilizables',
          'Implementa Composition API',
          'Añade Vue Router para navegación',
          'Gestiona estado global con Pinia'
        ],
        'React': [
          'Configura proyecto con Vite + React',
          'Domina JSX y componentes funcionales',
          'Aprende Hooks fundamentales (useState, useEffect)',
          'Implementa React Router para navegación',
          'Gestiona estado complejo con Context API',
          'Optimiza rendimiento con useCallback y useMemo'
        ],
        'TypeScript': [
          'Instala TypeScript y configura tsconfig.json',
          'Aprende tipos básicos y anotaciones',
          'Domina interfaces y tipos personalizados',
          'Implementa generics para código reutilizable',
          'Integra TypeScript con tu framework preferido',
          'Configura linting y herramientas de desarrollo'
        ],
        'Firebase': [
          'Crea proyecto en Firebase Console',
          'Configura Authentication con múltiples proveedores',
          'Implementa Firestore para base de datos',
          'Añade Cloud Storage para archivos',
          'Despliega tu app con Firebase Hosting',
          'Implementa Security Rules y Cloud Functions'
        ],
        'Testing': [
          'Configura framework de testing (Jest/Vitest)',
          'Escribe tus primeros unit tests',
          'Aprende mocking de dependencias externas',
          'Implementa integration tests',
          'Añade tests end-to-end con Playwright/Cypress',
          'Configura coverage reports y CI/CD'
        ],
        'Testing Library': [
          'Instala Testing Library para tu framework',
          'Aprende queries user-centric (getByRole, getByText)',
          'Practica simulación de eventos de usuario',
          'Implementa testing de componentes async',
          'Añade accessibility testing automático',
          'Integra con Jest para assertions avanzadas'
        ],
        'PWAs': [
          'Crea Web App Manifest básico',
          'Implementa Service Worker para cache',
          'Añade funcionalidad offline básica',
          'Configura push notifications',
          'Optimiza para instalación en dispositivos',
          'Implementa update strategies avanzadas'
        ],
        'GraphQL': [
          'Aprende sintaxis de queries y mutations',
          'Configura servidor GraphQL con Apollo Server',
          'Define schema con tipos y resolvers',
          'Implementa cliente con Apollo Client',
          'Añade subscripciones en tiempo real',
          'Optimiza queries con DataLoader y caching'
        ],
        'Express.js': [
          'Configura servidor básico con Express',
          'Aprende routing y middleware',
          'Conecta a base de datos (MongoDB/PostgreSQL)',
          'Implementa autenticación con JWT',
          'Diseña APIs RESTful completas',
          'Añade testing, logging y documentación'
        ],
        'Nuxt.js': [
          'Crea proyecto Nuxt con configuración SSR',
          'Domina file-based routing y layouts',
          'Implementa data fetching (useFetch, useAsyncData)',
          'Configura SEO y meta tags dinámicos',
          'Añade módulos para funcionalidad extendida',
          'Optimiza y despliega para producción'
        ],
        'Electron': [
          'Configura proyecto Electron básico',
          'Comprende arquitectura main/renderer process',
          'Implementa IPC para comunicación entre procesos',
          'Añade menús nativos y shortcuts',
          'Integra APIs nativas del sistema operativo',
          'Empaqueta y distribuye para múltiples plataformas'
        ],
        'Astro': [
          'Crea proyecto Astro con template inicial',
          'Aprende sintaxis de componentes Astro',
          'Implementa Islands Architecture con hidratación selectiva',
          'Configura Content Collections para contenido',
          'Integra múltiples frameworks (React, Vue, Svelte)',
          'Optimiza y despliega sitio estático'
        ],
        'Expo (RN)': [
          'Instala Expo CLI y crea proyecto inicial',
          'Aprende componentes básicos de React Native',
          'Implementa navegación entre pantallas',
          'Integra APIs nativas (cámara, ubicación)',
          'Testa en dispositivos reales con Expo Go',
          'Construye y publica con EAS Build'
        ],
        'AdonisJS': [
          'Instala AdonisJS y crea proyecto MVC',
          'Configura base de datos con Lucid ORM',
          'Implementa autenticación y autorización',
          'Crea APIs RESTful con validación',
          'Añade middleware y manejo de errores',
          'Despliega aplicación con Docker/PM2'
        ],
        'Inertia.js': [
          'Configura Inertia en backend (Laravel/AdonisJS)',
          'Instala adaptador frontend (Vue/React)',
          'Implementa navegación SPA sin APIs',
          'Maneja formularios con validación',
          'Añade shared data entre frontend/backend',
          'Optimiza con lazy loading y caching'
        ],
        'Podman': [
          'Instala Podman y configura entorno rootless',
          'Aprende comandos básicos compatibles con Docker',
          'Crea y gestiona contenedores sin daemon',
          'Implementa pods para aplicaciones multi-contenedor',
          'Integra con systemd para gestión de servicios',
          'Despliega aplicaciones con Kubernetes/OpenShift'
        ]
      }
      return paths[techName] || []
    },
    getAdditionalInfo(techName) {
      const info = {
        'TypeScript': 'TypeScript se ha convertido en el estándar de facto para proyectos JavaScript grandes. Grandes empresas como Microsoft, Google y Slack lo utilizan extensivamente.',
        'Vue.js': 'Vue 3 introdujo la Composition API que permite mejor reutilización de lógica y mejor soporte para TypeScript.',
        'React': 'React 18 introdujo características como Concurrent Rendering y Suspense para mejorar la experiencia del usuario.',
        'Vite': 'Vite es hasta 10-100 veces más rápido que Webpack en desarrollo gracias a su uso de ES modules nativos.',
        'Astro': 'Astro puede generar sitios hasta 90% más rápidos que otros frameworks al enviar menos JavaScript al cliente.',
        'Tailwind CSS': 'Framework CSS utility-first que permite desarrollo rápido con clases predefinidas. Incluye sistema de diseño consistente, responsive design integrado, y purging automático de CSS no utilizado en producción.'
      }
      return info[techName] || null
    },
    getLearningResources(techName) {
      const resources = {
        'HTML/CSS': [
          { icon: '📖', title: 'MDN HTML Reference', url: 'https://developer.mozilla.org/es/docs/Web/HTML' },
          { icon: '📖', title: 'MDN CSS Reference', url: 'https://developer.mozilla.org/es/docs/Web/CSS' },
          { icon: '🎥', title: 'FreeCodeCamp HTML/CSS', url: 'https://www.freecodecamp.org/learn/responsive-web-design/' },
          { icon: '🎮', title: 'Flexbox Froggy', url: 'https://flexboxfroggy.com/' },
          { icon: '🎮', title: 'CSS Grid Garden', url: 'https://cssgridgarden.com/' }
        ],
        'JavaScript': [
          { icon: '📖', title: 'MDN JavaScript Reference', url: 'https://developer.mozilla.org/es/docs/Web/JavaScript' },
          { icon: '🎥', title: 'FreeCodeCamp JS Course', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/' },
          { icon: '📚', title: 'JavaScript.info', url: 'https://javascript.info/' },
          { icon: '🎮', title: 'JS Interactive Tutorial', url: 'https://www.codecademy.com/learn/introduction-to-javascript' }
        ],
        'Git/GitHub': [
          { icon: '📖', title: 'Git Documentation', url: 'https://git-scm.com/doc' },
          { icon: '🎮', title: 'Learn Git Branching', url: 'https://learngitbranching.js.org/' },
          { icon: '🎥', title: 'GitHub Skills', url: 'https://skills.github.com/' }
        ],
        'NPM': [
          { icon: '📖', title: 'NPM Documentation', url: 'https://docs.npmjs.com/' },
          { icon: '🎥', title: 'NPM Crash Course', url: 'https://www.youtube.com/watch?v=jHDhaSSKmB0' }
        ],
        'Vite': [
          { icon: '📖', title: 'Vite Documentation', url: 'https://vitejs.dev/' },
          { icon: '🔧', title: 'Vite Guide', url: 'https://vitejs.dev/guide/' }
        ],
        'Vue.js': [
          { icon: '📖', title: 'Vue.js Official Docs', url: 'https://vuejs.org/' },
          { icon: '🎥', title: 'Vue Mastery', url: 'https://www.vuemastery.com/' },
          { icon: '🔧', title: 'Vue School', url: 'https://vueschool.io/' }
        ],
        'React': [
          { icon: '📖', title: 'React Documentation', url: 'https://react.dev/' },
          { icon: '🎥', title: 'React Tutorial', url: 'https://react.dev/learn' }
        ],
        'TypeScript': [
          { icon: '📖', title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/' },
          { icon: '🎥', title: 'TypeScript Deep Dive', url: 'https://basarat.gitbook.io/typescript/' },
          { icon: '🔧', title: 'TypeScript Playground', url: 'https://www.typescriptlang.org/play' }
        ],
        'Firebase': [
          { icon: '📖', title: 'Firebase Documentation', url: 'https://firebase.google.com/docs' },
          { icon: '🎥', title: 'Firebase for Web Tutorial', url: 'https://www.youtube.com/watch?v=9kRgVxULbag' },
          { icon: '🔧', title: 'Firebase Console', url: 'https://console.firebase.google.com/' }
        ],
        'Testing': [
          { icon: '📖', title: 'Jest Documentation', url: 'https://jestjs.io/' },
          { icon: '🔧', title: 'Vitest Guide', url: 'https://vitest.dev/' }
        ],
        'Testing Library': [
          { icon: '📖', title: 'Testing Library Docs', url: 'https://testing-library.com/' },
          { icon: '🎥', title: 'Testing Library Best Practices', url: 'https://kentcdodds.com/blog/common-mistakes-with-react-testing-library' },
          { icon: '🔧', title: 'Vue Testing Library', url: 'https://testing-library.com/docs/vue-testing-library/intro/' }
        ],
        'PWAs': [
          { icon: '📖', title: 'PWA Documentation', url: 'https://web.dev/progressive-web-apps/' },
          { icon: '🎥', title: 'PWA Tutorial by Google', url: 'https://developers.google.com/web/progressive-web-apps' },
          { icon: '🔧', title: 'Workbox (PWA Library)', url: 'https://developers.google.com/web/tools/workbox' }
        ],
        'GraphQL': [
          { icon: '📖', title: 'GraphQL Documentation', url: 'https://graphql.org/' },
          { icon: '🎥', title: 'How to GraphQL', url: 'https://www.howtographql.com/' },
          { icon: '🔧', title: 'Apollo GraphQL', url: 'https://www.apollographql.com/docs/' }
        ],
        'Puppeteer': [
          { icon: '📖', title: 'Puppeteer Documentation', url: 'https://pptr.dev/' },
          { icon: '🎥', title: 'Puppeteer Tutorial', url: 'https://github.com/puppeteer/puppeteer/tree/main/examples' },
          { icon: '🔧', title: 'Puppeteer Recorder', url: 'https://developer.chrome.com/docs/devtools/recorder/' }
        ],
        'Express.js': [
          { icon: '📖', title: 'Express Documentation', url: 'https://expressjs.com/' },
          { icon: '🎥', title: 'Express.js Course', url: 'https://www.youtube.com/watch?v=L72fhGm1tfE' }
        ],
        'Nuxt.js': [
          { icon: '📖', title: 'Nuxt Documentation', url: 'https://nuxt.com/' },
          { icon: '🎥', title: 'Nuxt 3 Course', url: 'https://masteringnuxt.com/' }
        ],
        'Electron': [
          { icon: '📖', title: 'Electron Documentation', url: 'https://www.electronjs.org/docs' },
          { icon: '🎥', title: 'Electron Tutorial', url: 'https://www.youtube.com/watch?v=3yqDxhR2XxE' }
        ],
        'Astro': [
          { icon: '📖', title: 'Astro Documentation', url: 'https://docs.astro.build/' },
          { icon: '🎥', title: 'Astro Crash Course', url: 'https://www.youtube.com/watch?v=e-hTm5VmofI' }
        ],
        'Expo (RN)': [
          { icon: '📖', title: 'Expo Documentation', url: 'https://docs.expo.dev/' },
          { icon: '📱', title: 'React Native Docs', url: 'https://reactnative.dev/' }
        ],
        'AdonisJS': [
          { icon: '📖', title: 'AdonisJS Documentation', url: 'https://adonisjs.com/' },
          { icon: '🎥', title: 'AdonisJS Tutorial', url: 'https://github.com/adonisjs/core' },
          { icon: '🔧', title: 'AdonisJS CLI', url: 'https://docs.adonisjs.com/guides/ace-commandline' }
        ],
        'Inertia.js': [
          { icon: '📖', title: 'Inertia.js Documentation', url: 'https://inertiajs.com/' },
          { icon: '🎥', title: 'Inertia.js with Laravel & Vue', url: 'https://laracasts.com/series/build-modern-laravel-apps-using-inertia-js' },
          { icon: '🔧', title: 'Inertia.js GitHub', url: 'https://github.com/inertiajs' }
        ],
        'Podman': [
          { icon: '📖', title: 'Podman Documentation', url: 'https://podman.io/' },
          { icon: '🎥', title: 'Podman Tutorial', url: 'https://github.com/containers/podman/tree/main/docs/tutorials' },
          { icon: '🔧', title: 'Podman Desktop', url: 'https://podman-desktop.io/' }
        ],
        'Docker': [
          { icon: '📖', title: 'Docker Documentation', url: 'https://docs.docker.com/' },
          { icon: '🎥', title: 'Docker Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=pTFZFxd4hOI' },
          { icon: '🔧', title: 'Docker Hub', url: 'https://hub.docker.com/' },
          { icon: '🔧', title: 'Docker Desktop', url: 'https://www.docker.com/products/docker-desktop/' }
        ],
        'MongoDB': [
          { icon: '📖', title: 'MongoDB Documentation', url: 'https://docs.mongodb.com/' },
          { icon: '🎥', title: 'MongoDB University', url: 'https://university.mongodb.com/' },
          { icon: '🔧', title: 'MongoDB Atlas', url: 'https://www.mongodb.com/cloud/atlas' },
          { icon: '🔧', title: 'MongoDB Compass', url: 'https://www.mongodb.com/products/compass' }
        ],
        'Webpack': [
          { icon: '📖', title: 'Webpack Documentation', url: 'https://webpack.js.org/' },
          { icon: '🎥', title: 'Webpack 5 Tutorial', url: 'https://www.youtube.com/watch?v=MpGLUVbqoYQ' },
          { icon: '🔧', title: 'Webpack Bundle Analyzer', url: 'https://github.com/webpack-contrib/webpack-bundle-analyzer' },
          { icon: '📚', title: 'Webpack Guides', url: 'https://webpack.js.org/guides/' }
        ],
        'Sass/SCSS': [
          { icon: '📖', title: 'Sass Documentation', url: 'https://sass-lang.com/documentation/' },
          { icon: '🎥', title: 'Sass Tutorial', url: 'https://www.youtube.com/watch?v=_a5j7KoflTs' },
          { icon: '🔧', title: 'Sass Playground', url: 'https://www.sassmeister.com/' },
          { icon: '📚', title: 'Sass Guidelines', url: 'https://sass-guidelin.es/' }
        ],
        'Jest': [
          { icon: '📖', title: 'Jest Documentation', url: 'https://jestjs.io/docs/getting-started' },
          { icon: '🎥', title: 'Jest Testing Tutorial', url: 'https://www.youtube.com/watch?v=7r4xVDI2vho' },
          { icon: '🔧', title: 'Jest Examples', url: 'https://github.com/facebook/jest/tree/main/examples' },
          { icon: '📚', title: 'Testing JavaScript', url: 'https://testingjavascript.com/' }
        ],
        'Tailwind CSS': [
          { icon: '📖', title: 'Tailwind CSS Documentation', url: 'https://tailwindcss.com/docs' },
          { icon: '🎥', title: 'Tailwind CSS Crash Course', url: 'https://www.youtube.com/watch?v=UBOj6rqRUME' },
          { icon: '🔧', title: 'Tailwind Play', url: 'https://play.tailwindcss.com/' },
          { icon: '📚', title: 'Tailwind UI Components', url: 'https://tailwindui.com/' },
          { icon: '🎭', title: 'Headless UI', url: 'https://headlessui.dev/' }
        ]
      }
      
      return resources[techName] || []
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
  background: rgba(0, 0, 0, 0.6);
  z-index: 2000;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.modal-content {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3a 100%);
  display: flex;
  flex-direction: column;
  box-shadow: 
    -10px 0 30px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(139, 233, 253, 0.2);
  color: #f8f8f2;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  transform: translateX(100%);
  animation: slideIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  border-radius: 16px 0 0 16px;
}

@keyframes slideIn {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(139, 233, 253, 0.2);
  background: rgba(139, 233, 253, 0.05);
  border-radius: 16px 0 0 0;
  backdrop-filter: blur(10px);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.title-and-status {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.modal-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #8be9fd;
  margin: 0;
  letter-spacing: -0.025em;
  line-height: 1.2;
  flex-shrink: 0;
}

.status-dropdown {
  margin: 0;
}

.status-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-icon {
  font-size: 0.9rem;
  opacity: 0.7;
}

.status-select {
  background: rgba(68, 71, 90, 0.8);
  border: 1px solid rgba(139, 233, 253, 0.3);
  border-radius: 8px;
  padding: 6px 12px;
  color: #f8f8f2;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
  min-width: 110px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.status-select:hover {
  border-color: rgba(139, 233, 253, 0.5);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.status-select:focus {
  border-color: rgba(139, 233, 253, 0.6);
  box-shadow: 0 0 0 2px rgba(139, 233, 253, 0.2);
}

/* Estilo dinámico basado en el valor seleccionado */
.status-select[value="pending"] {
  background: rgba(248, 248, 242, 0.08);
  border-color: rgba(248, 248, 242, 0.3);
  color: rgba(248, 248, 242, 0.9);
}

.status-select[value="in-progress"] {
  background: rgba(255, 184, 108, 0.12);
  border-color: rgba(255, 184, 108, 0.4);
  color: rgba(255, 184, 108, 0.95);
}

.status-select[value="completed"] {
  background: rgba(80, 250, 123, 0.12);
  border-color: rgba(80, 250, 123, 0.4);
  color: rgba(80, 250, 123, 0.95);
}

.status-select[value="skipped"] {
  background: rgba(255, 85, 85, 0.12);
  border-color: rgba(255, 85, 85, 0.4);
  color: rgba(255, 85, 85, 0.95);
}

.status-select option {
  background: #282a36;
  color: #f8f8f2;
  padding: 4px;
}

.status-select option[value="pending"] {
  color: rgba(248, 248, 242, 0.85);
}

.status-select option[value="in-progress"] {
  color: rgba(255, 184, 108, 0.85);
}

.status-select option[value="completed"] {
  color: rgba(80, 250, 123, 0.85);
}

.status-select option[value="skipped"] {
  color: rgba(255, 85, 85, 0.85);
}

.close-button {
  background: rgba(255, 85, 85, 0.1);
  border: 1px solid rgba(255, 85, 85, 0.3);
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #ff5555;
  flex-shrink: 0;
}

.close-button:hover {
  background: rgba(255, 85, 85, 0.2);
  border-color: rgba(255, 85, 85, 0.5);
  transform: scale(1.05);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  position: relative;
  scroll-behavior: smooth;
}

.modal-body::-webkit-scrollbar {
  width: 4px;
}

.modal-body::-webkit-scrollbar-track {
  background: rgba(68, 71, 90, 0.3);
}

.modal-body::-webkit-scrollbar-thumb {
  background: rgba(139, 233, 253, 0.3);
  border-radius: 2px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 233, 253, 0.5);
}

.content-wrapper {
  padding: 24px;
  min-height: 100%;
}

.info-section-compact {
  margin-bottom: 20px;
  background: rgba(68, 71, 90, 0.3);
  border: 1px solid rgba(139, 233, 253, 0.1);
  border-radius: 12px;
  padding: 12px 16px;
}

.info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
}

.info-item-compact {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
}

.info-icon-small {
  font-size: 1rem;
}

.info-text {
  color: #f8f8f2;
  font-weight: 500;
}

.difficulty-stars {
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.info-section {
  margin-bottom: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.info-card {
  background: rgba(68, 71, 90, 0.4);
  border: 1px solid rgba(139, 233, 253, 0.1);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
}

.info-card:hover {
  background: rgba(68, 71, 90, 0.6);
  border-color: rgba(139, 233, 253, 0.3);
  transform: translateX(-2px);
}

.info-icon {
  font-size: 1.25rem;
  min-width: 20px;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.info-label {
  font-size: 0.75rem;
  color: #bd93f9;
  font-weight: 600;
}

.info-value {
  font-size: 0.9rem;
  color: #f8f8f2;
  font-weight: 500;
}

.info-value.difficulty {
  font-weight: 700;
}

.info-value.completed {
  color: #50fa7b;
  font-weight: 600;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #8be9fd;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.description-section {
  margin-bottom: 24px;
}

.description-content {
  background: rgba(189, 147, 249, 0.1);
  border: 1px solid rgba(189, 147, 249, 0.2);
  border-radius: 12px;
  padding: 16px;
  line-height: 1.6;
  font-size: 0.85rem;
}

.detailed-description-section {
  margin-bottom: 20px;
}

.detailed-description-content {
  background: rgba(139, 233, 253, 0.1);
  border: 1px solid rgba(139, 233, 253, 0.2);
  border-radius: 12px;
  padding: 16px;
  line-height: 1.6;
  font-size: 0.85rem;
  color: #f8f8f2;
}

.concepts-section {
  margin-bottom: 20px;
}

.concepts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 6px;
}

.concept-item {
  background: rgba(80, 250, 123, 0.1);
  border: 1px solid rgba(80, 250, 123, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
}

.concept-item:hover {
  background: rgba(80, 250, 123, 0.15);
  border-color: rgba(80, 250, 123, 0.4);
  transform: translateY(-2px);
}

.concept-icon {
  font-size: 0.75rem;
  opacity: 0.8;
}

.concept-name {
  flex: 1;
  font-weight: 600;
}

.concept-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(40, 42, 54, 0.95);
  color: #f8f8f2;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.7rem;
  white-space: nowrap;
  max-width: 250px;
  white-space: normal;
  line-height: 1.3;
  border: 1px solid rgba(80, 250, 123, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 1000;
  pointer-events: none;
}

.concept-item:hover .concept-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(-4px);
}

.concept-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: rgba(40, 42, 54, 0.95);
}

.learning-path-section {
  margin-bottom: 20px;
}

.learning-steps {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.learning-step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: rgba(255, 184, 108, 0.1);
  border: 1px solid rgba(255, 184, 108, 0.2);
  border-radius: 10px;
  padding: 16px;
  transition: all 0.3s ease;
}

.learning-step:hover {
  background: rgba(255, 184, 108, 0.15);
  border-color: rgba(255, 184, 108, 0.4);
  transform: translateX(-2px);
}

.learning-step.completed {
  background: rgba(80, 250, 123, 0.1);
  border-color: rgba(80, 250, 123, 0.3);
}

.learning-step.completed .step-content {
  text-decoration: line-through;
  opacity: 0.7;
}

.step-header {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.step-checkbox {
  width: 16px;
  height: 16px;
  accent-color: #50fa7b;
  cursor: pointer;
}

.step-number {
  background: linear-gradient(135deg, #ffb86c, #ff7979);
  color: #282a36;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.8rem;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.learning-step.completed .step-number {
  background: linear-gradient(135deg, #50fa7b, #8be9fd);
}

.step-content {
  flex: 1;
  line-height: 1.5;
  font-weight: 500;
  font-size: 0.85rem;
}

.learning-progress {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(68, 71, 90, 0.5);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #50fa7b, #8be9fd);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 0.75rem;
  color: #bd93f9;
  font-weight: 600;
  text-align: center;
}

.resources-section {
  margin-bottom: 20px;
}

.resources-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.resource-card {
  background: rgba(139, 233, 253, 0.1);
  border: 1px solid rgba(139, 233, 253, 0.2);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #f8f8f2;
  transition: all 0.3s ease;
}

.resource-card:hover {
  background: rgba(139, 233, 253, 0.15);
  border-color: rgba(139, 233, 253, 0.4);
  transform: translateX(-2px);
  box-shadow: -4px 0 15px rgba(139, 233, 253, 0.2);
}

.resource-icon {
  font-size: 1.25rem;
  min-width: 20px;
}

.resource-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.resource-title {
  font-weight: 600;
  font-size: 0.85rem;
  color: #8be9fd;
}

.resource-type {
  font-size: 0.75rem;
  color: #bd93f9;
  opacity: 0.8;
}

.resource-arrow {
  color: #8be9fd;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.resource-card:hover .resource-arrow {
  opacity: 1;
  transform: translateX(-3px);
}

.additional-info-section {
  margin-bottom: 24px;
}

.additional-content {
  background: rgba(255, 121, 198, 0.1);
  border: 1px solid rgba(255, 121, 198, 0.2);
  border-radius: 12px;
  padding: 16px;
  line-height: 1.6;
  font-size: 0.85rem;
}

.content-spacer {
  height: 80px;
}

.content-spacer-small {
  height: 20px;
}

.scroll-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
}

.glow-effect {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(
    to top,
    rgba(80, 250, 123, 0.15) 0%,
    rgba(80, 250, 123, 0.08) 50%,
    transparent 100%
  );
  border-radius: 0 0 0 16px;
}

.scroll-text {
  position: relative;
  background: rgba(40, 42, 54, 0.9);
  border: 1px solid rgba(80, 250, 123, 0.3);
  border-radius: 20px;
  padding: 8px 16px;
  color: #50fa7b;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  backdrop-filter: blur(10px);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(80, 250, 123, 0.3);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(80, 250, 123, 0);
  }
}

.modal-footer {
  position: sticky;
  bottom: 0;
  background: linear-gradient(
    to top,
    rgba(30, 30, 46, 0.95) 0%,
    rgba(30, 30, 46, 0.9) 70%,
    transparent 100%
  );
  padding: 20px 24px;
  border-radius: 0 0 0 16px;
  backdrop-filter: blur(10px);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.4s ease;
  pointer-events: none;
}

.modal-footer.visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.completion-button {
  width: 100%;
  background: linear-gradient(135deg, #50fa7b 0%, #8be9fd 100%);
  border: none;
  border-radius: 12px;
  padding: 14px 20px;
  cursor: pointer;
  transition: all 0.4s ease;
  box-shadow: 
    0 6px 20px rgba(80, 250, 123, 0.3),
    0 0 0 0 rgba(80, 250, 123, 0.5);
  position: relative;
  overflow: hidden;
}

.completion-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.completion-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 25px rgba(80, 250, 123, 0.4),
    0 0 0 3px rgba(80, 250, 123, 0.3);
}

.completion-button.completed {
  background: linear-gradient(135deg, #bd93f9 0%, #ff79c6 100%);
  box-shadow: 
    0 6px 20px rgba(189, 147, 249, 0.3),
    0 0 0 0 rgba(189, 147, 249, 0.5);
}

.completion-button.completed:not(:disabled):hover {
  box-shadow: 
    0 8px 25px rgba(189, 147, 249, 0.4),
    0 0 0 3px rgba(189, 147, 249, 0.3);
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.button-icon {
  font-size: 1rem;
}

.button-text {
  font-size: 0.9rem;
  font-weight: 700;
  color: #282a36;
}

/* Mobile Responsive Design - Full Screen */
@media (max-width: 768px) {
  .modal-content {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    right: 0;
    top: 0;
    box-shadow: none;
  }
  
  .modal-header {
    padding: 16px 20px;
    border-radius: 0;
  }
  
  .title-and-status {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .modal-title {
    font-size: 1.3rem;
  }
  
  .status-select {
    min-width: 100px;
    font-size: 0.8rem;
  }
  
  .close-button {
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }
  
  .content-wrapper {
    padding: 20px;
  }
  
  .section-title {
    font-size: 1rem;
  }
  
  .info-card,
  .learning-step,
  .resource-card {
    padding: 14px;
  }
  
  .modal-footer {
    padding: 16px 20px;
    border-radius: 0;
  }
  
  .completion-button {
    padding: 16px 20px;
  }
  
  .button-text {
    font-size: 1rem;
  }
  
  .scroll-text {
    font-size: 0.8rem;
    padding: 10px 16px;
  }
  
  .glow-effect {
    border-radius: 0;
  }
}

@media (max-width: 480px) {
  .modal-header {
    padding: 14px 16px;
  }
  
  .modal-title {
    font-size: 1.2rem;
  }
  
  .close-button {
    width: 36px;
    height: 36px;
  }
  
  .content-wrapper {
    padding: 16px;
  }
  
  .section-title {
    font-size: 0.95rem;
  }
  
  .info-card,
  .learning-step,
  .resource-card {
    padding: 12px;
  }
  
  .modal-footer {
    padding: 14px 16px;
  }
  
  .completion-button {
    padding: 14px 16px;
  }
}

/* Very wide screens - increase width */
@media (min-width: 1400px) {
  .modal-content {
    width: 450px;
  }
}

@media (min-width: 1800px) {
  .modal-content {
    width: 500px;
  }
}
</style>