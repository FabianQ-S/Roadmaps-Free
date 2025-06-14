// Forzar hot reload - timestamp: 2025-06-13 - SERVIDOR REINICIADO
// Los nodos recreados tienen IDs: 200 (AdonisJS), 201 (Inertia.js), 202 (Podman)
// TIMESTAMP ÚNICO: 13_06_2025_16_45

// Datos del roadmap interactivo de JavaScript & Vue.js
// Colores Dracula Theme
const draculaColors = {
  background: '#282a36',
  currentLine: '#44475a',
  foreground: '#f8f8f2',
  comment: '#6272a4',
  cyan: '#8be9fd',
  green: '#50fa7b',
  orange: '#ffb86c',
  pink: '#ff79c6',
  purple: '#bd93f9',
  red: '#ff5555',
  yellow: '#f1fa8c'
}

// Función para obtener color de dificultad
export const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'Fácil': return draculaColors.green
    case 'Intermedio': return draculaColors.yellow
    case 'Difícil': return draculaColors.orange
    case 'Avanzado': return draculaColors.red
    default: return draculaColors.comment
  }
}

// Función para obtener estrellas de dificultad
export const getDifficultyStars = (difficulty) => {
  switch (difficulty) {
    case 'Fácil': return '⭐'
    case 'Intermedio': return '⭐⭐'
    case 'Difícil': return '⭐⭐⭐'
    case 'Avanzado': return '⭐⭐⭐⭐'
    case 'Experto': return '⭐⭐⭐⭐⭐'
    default: return '⭐'
  }
}

export const roadmapData = {
  title: '🗺️ Roadmap Interactivo de JavaScript & Vue.js',
  subtitle: 'Tu guía paso a paso hacia el dominio del desarrollo frontend',
  phases: [
    {
      id: 0,
      title: '⓪ Fase 0: Fundamentos Absolutos e Indispensables 🏛️',
      backgroundColor: draculaColors.cyan,
      borderColor: draculaColors.comment,
      nodes: [
        {
          id: 1,
          name: 'HTML/CSS',
          difficulty: 'Fácil',
          timeEstimate: '3-4 semanas',
          backgroundColor: draculaColors.currentLine,
          borderColor: draculaColors.comment,
          isMain: true,
          completed: false,
          description: 'Fundamentos de estructura web con HTML semántico y diseño moderno con CSS incluyendo Flexbox y Grid.'
        },
        {
          id: 31,
          name: 'JavaScript',
          difficulty: 'Intermedio',
          timeEstimate: '4-5 semanas',
          backgroundColor: draculaColors.currentLine,
          borderColor: draculaColors.cyan,
          isMain: true,
          completed: false,
          description: 'Lenguaje de programación esencial para interactividad web, DOM manipulation y programación asíncrona.'
        },
        {
          id: 2,
          name: 'Git/GitHub',
          difficulty: 'Intermedio',
          timeEstimate: '2-3 semanas',
          backgroundColor: draculaColors.currentLine,
          borderColor: draculaColors.cyan,
          isMain: true,
          completed: false,
          description: 'Sistema de control de versiones distribuido esencial para cualquier desarrollador moderno.'
        },
        {
          id: 5,
          name: 'NPM',
          difficulty: 'Intermedio',
          timeEstimate: '2-3 semanas',
          backgroundColor: draculaColors.currentLine,
          borderColor: draculaColors.cyan,
          isMain: true,
          completed: false,
          description: 'Gestor de paquetes de Node.js para manejar dependencias y scripts en proyectos JavaScript.'
        }
      ],
      optionalNodes: [
        {
          id: 29,
          name: 'Tailwind CSS',
          difficulty: 'Intermedio',
          timeEstimate: '2-3 semanas',
          backgroundColor: draculaColors.currentLine,
          borderColor: draculaColors.cyan,
          isOptional: true,
          position: 'right',
          completed: false,
          description: 'Framework CSS utility-first que permite crear interfaces modernas rapidamente sin escribir CSS personalizado. Incluye sistema de diseño integrado, responsive design, dark mode y optimización automática para producción.'
        }
      ]
    },
    {
      id: 1,
      title: '🧱 Fase 1: Cimientos del Frontend Moderno con JavaScript',
      backgroundColor: draculaColors.orange,
      borderColor: draculaColors.comment,
      nodes: [
        {
          id: 7,
          name: 'Vite',
          difficulty: 'Intermedio',
          timeEstimate: '2-3 semanas',
          backgroundColor: draculaColors.currentLine,
          borderColor: draculaColors.cyan,
          isMain: true,
          completed: false,
          description: 'Build tool rápido y moderno para desarrollo frontend con Hot Module Replacement.'
        },
        {
          id: 6,
          name: 'Vue.js',
          difficulty: 'Difícil',
          timeEstimate: '5-6 semanas',
          backgroundColor: draculaColors.currentLine,
          borderColor: draculaColors.green,
          isMain: true,
          completed: false,
          description: 'Framework progresivo de JavaScript para construir interfaces de usuario reactivas.'
        },
        {
          id: 3,
          name: 'React',
          difficulty: 'Avanzado',
          timeEstimate: '6-7 semanas',
          backgroundColor: draculaColors.currentLine,
          borderColor: draculaColors.orange,
          isMain: true,
          completed: false,
          description: 'Biblioteca de JavaScript para construir interfaces de usuario basadas en componentes.'
        }
      ],
      optionalNodes: [
        {
          id: 4,
          name: 'TypeScript',
          difficulty: 'Difícil',
          timeEstimate: '3-4 semanas',
          backgroundColor: draculaColors.currentLine,
          borderColor: draculaColors.orange,
          isOptional: true,
          position: 'left',
          completed: false,
          description: 'Superconjunto tipado de JavaScript que compila a JavaScript puro. Añade tipado estático opcional, interfaces, generics y herramientas avanzadas de desarrollo para crear aplicaciones más robustas y mantenibles.'
        },
        {
          id: 21,
          name: 'Firebase',
          difficulty: 'Intermedio',
          timeEstimate: '2-3 semanas',
          backgroundColor: draculaColors.currentLine,
          borderColor: draculaColors.yellow,
          isOptional: true,
          position: 'right',
          completed: false,
          description: 'Plataforma Backend-as-a-Service (BaaS) de Google que proporciona autenticación, base de datos en tiempo real, almacenamiento, hosting y analytics sin necesidad de gestionar infraestructura backend.'
        }
      ]
    },
    {
      id: 2,
      title: '🌍 Fase 2: Backend, Testing, Automatización y Meta-Frameworks Frontend',
      backgroundColor: draculaColors.pink,
      borderColor: draculaColors.comment,
      nodes: [
        {
          id: 8,
          name: 'Testing',
          difficulty: 'Difícil',
          timeEstimate: '3-4 semanas',
          backgroundColor: draculaColors.currentLine,
          borderColor: draculaColors.green,
          isMain: true,
          completed: false,
          description: 'Pruebas unitarias, de integración y end-to-end para garantizar calidad del código.'
        },
        {
          id: 17,
          name: 'Express.js',
          difficulty: 'Difícil',
          timeEstimate: '4-5 semanas',
          backgroundColor: draculaColors.currentLine,
          borderColor: draculaColors.green,
          isMain: true,
          completed: false,
          description: 'Framework web minimalista y flexible para Node.js.'
        },
        {
          id: 18,
          name: 'Nuxt.js',
          difficulty: 'Avanzado',
          timeEstimate: '4-5 semanas',
          backgroundColor: draculaColors.currentLine,
          borderColor: draculaColors.orange,
          isMain: true,
          completed: false,
          description: 'Framework de Vue.js para aplicaciones universales (SSR/SSG).'
        }
      ],
      optionalNodes: [
        {
          id: 10,
          name: 'Testing Library',
          difficulty: 'Difícil',
          timeEstimate: '2-3 semanas',
          backgroundColor: draculaColors.currentLine,
          borderColor: draculaColors.orange,
          isOptional: true,
          position: 'left',
          completed: false,
          description: 'Conjunto de utilidades de testing que fomentan buenas prácticas centrándose en cómo los usuarios interactúan con la aplicación. Soporta React, Vue, Angular y DOM vanilla con filosofía de testing accesible.'
        },
        {
          id: 14,
          name: 'PWAs',
          difficulty: 'Difícil',
          timeEstimate: '3-4 semanas',
          backgroundColor: draculaColors.currentLine,
          borderColor: draculaColors.orange,
          isOptional: true,
          position: 'left',
          completed: false,
          description: 'Progressive Web Apps que combinan lo mejor de web y móvil. Incluye Service Workers para funcionalidad offline, Web App Manifest para instalabilidad y APIs modernas para experiencias nativas.'
        },
        {
          id: 22,
          name: 'GraphQL',
          difficulty: 'Avanzado',
          timeEstimate: '4-5 semanas',
          backgroundColor: draculaColors.currentLine,
          borderColor: draculaColors.red,
          isOptional: true,
          position: 'right',
          completed: false,
          description: 'Lenguaje de consulta y runtime para APIs que permite a los clientes solicitar exactamente los datos que necesitan. Proporciona sistema de tipos fuerte, introspección, subscripciones en tiempo real y resolución eficiente.'
        }
      ]
    },
    {
      id: 3,
      title: '🚀 Fase 3: Explorando Nuevos Horizontes y Plataformas con JavaScript',
      backgroundColor: draculaColors.purple,
      borderColor: draculaColors.comment,
      nodes: [
        {
          id: 9,
          name: 'Electron',
          difficulty: 'Avanzado',
          timeEstimate: '4-5 semanas',
          backgroundColor: draculaColors.currentLine,
          borderColor: draculaColors.orange,
          isMain: true,
          completed: false,
          description: 'Framework para crear aplicaciones de escritorio usando tecnologías web.'
        },
        {
          id: 19,
          name: 'Astro',
          difficulty: 'Intermedio',
          timeEstimate: '3-4 semanas',
          backgroundColor: draculaColors.currentLine,
          borderColor: draculaColors.yellow,
          isMain: true,
          completed: false,
          description: 'Framework moderno para sitios web ultra-rápidos con arquitectura de islas y cero JS por defecto.'
        },
        {
          id: 20,
          name: 'Expo (RN)',
          difficulty: 'Difícil',
          timeEstimate: '4-5 semanas',
          backgroundColor: draculaColors.currentLine,
          borderColor: draculaColors.orange,
          isMain: true,
          completed: false,
          description: 'Desarrollo móvil multiplataforma simplificado con React Native. SDK, Expo Go y EAS Build para iOS/Android.'
        }
      ],
      optionalNodes: [
        {
          id: 200,
          name: 'AdonisJS',
          difficulty: 'Avanzado',
          timeEstimate: '4-5 semanas',
          backgroundColor: draculaColors.currentLine,
          borderColor: draculaColors.red,
          isOptional: true,
          position: 'left',
          completed: false,
          description: 'Framework backend full-stack para Node.js con arquitectura MVC, ORM Lucid, autenticación y CLI potente.'
        },
        {
          id: 201,
          name: 'Inertia.js',
          difficulty: 'Difícil',
          timeEstimate: '2-3 semanas',
          backgroundColor: draculaColors.currentLine,
          borderColor: draculaColors.orange,
          isOptional: true,
          position: 'left',
          completed: false,
          description: 'Puente backend-frontend para "monolitos modernos" con experiencia SPA sin API separada.'
        },
        {
          id: 202,
          name: 'Podman',
          difficulty: 'Difícil',
          timeEstimate: '2-3 semanas',
          backgroundColor: draculaColors.currentLine,
          borderColor: draculaColors.orange,
          isOptional: true,
          position: 'right',
          completed: false,
          description: 'Alternativa a Docker para contenerización sin daemon, ideal para desarrollo consistente y despliegue simplificado.'
        }
      ]
    }
  ],
  
  // Información detallada de las fases
  phaseDetails: {
    0: {
      title: 'Fase 0: Fundamentos Absolutos e Indispensables',
      emoji: '🏛️',
      totalTime: '11-16 semanas',
      description: 'Los cimientos fundamentales de todo desarrollador web. Sin estos conocimientos es imposible avanzar efectivamente en el desarrollo frontend moderno.',
      
      mainTechnologies: {
        title: 'Tecnologías Principales',
        description: 'Estas son las tecnologías base que DEBES dominar antes de continuar. Son la base de todo el desarrollo web.',
        technologies: [
          {
            name: 'HTML/CSS',
            reason: 'Fundamentos de estructura y presentación web. HTML para semántica y CSS para diseño responsivo.',
            synergy: 'Base indispensable para cualquier tecnología frontend. Crítico antes de frameworks como Vue.js o React.'
          },
          {
            name: 'JavaScript',
            reason: 'Lenguaje de programación que da vida a las páginas web con interactividad y lógica.',
            synergy: 'Esencial para frameworks modernos, APIs, y toda la programación frontend/backend en este roadmap.'
          },
          {
            name: 'Git/GitHub',
            reason: 'Control de versiones es esencial para cualquier proyecto profesional y colaboración en equipo.',
            synergy: 'Necesario para gestionar código en todos los proyectos futuros.'
          },
          {
            name: 'NPM',
            reason: 'Gestor de paquetes de JavaScript. Todas las librerías y frameworks se instalan a través de NPM.',
            synergy: 'Fundamental para instalar Vue.js, React, y cualquier herramienta de desarrollo.'
          }
        ]
      },
      
      optionalTechnologies: {
        title: 'Tecnologías Opcionales',
        description: 'Aunque opcionales, estas tecnologías te darán ventaja competitiva y harán tu desarrollo más eficiente desde el inicio.',
        technologies: [
          {
            name: 'Tailwind CSS',
            reason: 'Framework CSS utilitario que acelera el desarrollo de interfaces y es muy popular en la industria.',
            synergy: 'Se integra perfectamente con Vue.js y React, mejorando tu velocidad de desarrollo de UI.'
          }
        ]
      },
      
      keyConcepts: [
        'Semántica HTML y estructura de documentos',
        'Flexbox y CSS Grid para layouts modernos',
        'JavaScript ES6+ (arrow functions, destructuring, modules)',
        'DOM manipulation y eventos',
        'Async/await y promesas',
        'Git workflows básicos (add, commit, push, pull)',
        'Package.json y gestión de dependencias',
        'Conceptos de responsive design'
      ]
    },
    
    1: {
      title: 'Fase 1: Cimientos del Frontend Moderno con JavaScript',
      emoji: '🧱',
      totalTime: '11-14 semanas',
      description: 'Aquí das el salto a herramientas y frameworks modernos. Aprenderás a construir aplicaciones web profesionales y escalables.',
      
      mainTechnologies: {
        title: 'Tecnologías Principales',
        description: 'El trio esencial del desarrollo frontend moderno: un bundler moderno y los dos frameworks más populares.',
        technologies: [
          {
            name: 'Vite',
            reason: 'Build tool ultrarrápido que revoluciona el desarrollo frontend con hot reload instantáneo.',
            synergy: 'Optimiza el desarrollo tanto con Vue.js como con React, proporcionando la mejor experiencia de desarrollo.'
          },
          {
            name: 'Vue.js',
            reason: 'Framework progresivo con curva de aprendizaje suave pero muy potente para aplicaciones complejas.',
            synergy: 'Se complementa perfectamente con Vite y es ideal para aprender conceptos de frameworks antes de React.'
          },
          {
            name: 'React',
            reason: 'El framework más popular de la industria, con el ecosistema más grande y demanda laboral.',
            synergy: 'Los conceptos aprendidos en Vue.js facilitan enormemente el aprendizaje de React.'
          }
        ]
      },
      
      optionalTechnologies: {
        title: 'Tecnologías Opcionales',
        description: 'Estas tecnologías opcional te preparan para desarrollo enterprise y backend integration.',
        technologies: [
          {
            name: 'TypeScript',
            reason: 'Superset de JavaScript que añade tipado estático, reduciendo errores y mejorando la productividad.',
            synergy: 'Se integra nativamente con Vue.js y React, especialmente poderoso con Vite.'
          },
          {
            name: 'Firebase',
            reason: 'Backend-as-a-Service que permite prototipar y lanzar aplicaciones fullstack sin backend propio.',
            synergy: 'Se integra perfectamente con Vue.js y React para autenticación, base de datos y hosting.'
          }
        ]
      },
      
      keyConcepts: [
        'Reactive programming y state management',
        'Component-based architecture',
        'Virtual DOM y reconciliation',
        'Props, state y lifecycle methods',
        'Single File Components (Vue) y JSX (React)',
        'Hot Module Replacement (HMR)',
        'ES Modules y tree shaking',
        'Build optimization y code splitting'
      ]
    },
    
    2: {
      title: 'Fase 2: Backend, Testing, Automatización y Meta-Frameworks Frontend',
      emoji: '🌍',
      totalTime: '11-14 semanas',
      description: 'Expande tus horizontes hacia el fullstack y la calidad profesional. Aprende a crear aplicaciones robustas, testeadas y optimizadas.',
      
      mainTechnologies: {
        title: 'Tecnologías Principales',
        description: 'La triada para desarrollo fullstack profesional: testing, backend y meta-frameworks.',
        technologies: [
          {
            name: 'Testing',
            reason: 'Fundamental para código de calidad y confidence en deployments. Requerido en cualquier trabajo profesional.',
            synergy: 'Esencial para validar componentes de Vue.js/React y lógica de negocio en Express.js.'
          },
          {
            name: 'Express.js',
            reason: 'El framework de backend más popular para Node.js, te permite crear APIs REST completas.',
            synergy: 'Se conecta perfectamente con Vue.js/React frontend y bases de datos para aplicaciones fullstack.'
          },
          {
            name: 'Nuxt.js',
            reason: 'Meta-framework de Vue.js que añade SSR, SSG, y optimizaciones automáticas para producción.',
            synergy: 'Eleva Vue.js al siguiente nivel con SEO, performance y experiencia de desarrollo superior.'
          }
        ]
      },
      
      optionalTechnologies: {
        title: 'Tecnologías Opcionales',
        description: 'Especialización en testing avanzado, aplicaciones offline, y APIs modernas.',
        technologies: [
          {
            name: 'Testing Library',
            reason: 'La librería estándar para testing de componentes UI de forma similar a como los usuarios interactúan.',
            synergy: 'Se especializa en testear componentes Vue.js y React de manera más natural y mantenible.'
          },
          {
            name: 'PWAs',
            reason: 'Progressive Web Apps proporcionan experiencias nativas en navegadores, con offline support.',
            synergy: 'Se integra excelentemente con Vue.js/React y Nuxt.js para aplicaciones que funcionan sin internet.'
          },
          {
            name: 'GraphQL',
            reason: 'Query language que optimiza la comunicación frontend-backend con fetching inteligente.',
            synergy: 'Revoluciona cómo Vue.js/React consumen datos, especialmente potente con meta-frameworks.'
          }
        ]
      },
      
      keyConcepts: [
        'Unit testing, integration testing, y E2E testing',
        'Test-driven development (TDD)',
        'RESTful API design y middleware',
        'Authentication y authorization',
        'Server-side rendering (SSR) y Static Site Generation (SSG)',
        'Performance optimization y Core Web Vitals',
        'Service workers y caching strategies',
        'GraphQL schemas, resolvers y queries'
      ]
    },
    
    3: {
      title: 'Fase 3: Explorando Nuevos Horizontes y Plataformas con JavaScript',
      emoji: '🚀',
      totalTime: '12-15 semanas',
      description: 'El último nivel: especialización en plataformas múltiples y tecnologías de vanguardia. Conviértete en un desarrollador JavaScript verdaderamente completo.',
      
      mainTechnologies: {
        title: 'Tecnologías Principales',
        description: 'Tres plataformas que expanden JavaScript más allá del navegador: desktop, web optimizado y mobile.',
        technologies: [
          {
            name: 'Electron',
            reason: 'Permite crear aplicaciones desktop nativas usando tecnologías web. Usado por VS Code, Discord, WhatsApp Desktop.',
            synergy: 'Reutiliza todo tu conocimiento de Vue.js/React para crear aplicaciones desktop profesionales.'
          },
          {
            name: 'Astro',
            reason: 'Framework de nueva generación enfocado en performance con arquitectura de islas y multi-framework.',
            synergy: 'Permite usar Vue.js y React en el mismo proyecto, optimizando automáticamente la carga.'
          },
          {
            name: 'Expo (React Native)',
            reason: 'Plataforma para desarrollo mobile que permite crear apps iOS y Android con JavaScript.',
            synergy: 'Aprovecha tu conocimiento de React para desarrollo mobile, compartiendo lógica entre web y mobile.'
          }
        ]
      },
      
      optionalTechnologies: {
        title: 'Tecnologías Opcionales',
        description: 'Especialización en backend robusto, full-stack bridging y containerización moderna.',
        technologies: [
          {
            name: 'AdonisJS',
            reason: 'Framework backend de Node.js inspirado en Laravel, para aplicaciones backend robustas y escalables.',
            synergy: 'Se conecta perfectamente con frontends Vue.js/React para aplicaciones enterprise fullstack.'
          },
          {
            name: 'Inertia.js',
            reason: 'Protocolo que permite crear SPAs usando backend routing clásico, lo mejor de ambos mundos.',
            synergy: 'Une AdonisJS con Vue.js de forma elegante, eliminando la necesidad de APIs REST tradicionales.'
          },
          {
            name: 'Podman',
            reason: 'Alternativa moderna a Docker para containerización sin daemon, más segura y lightweight.',
            synergy: 'Facilita el despliegue de aplicaciones fullstack (frontend + backend) de forma consistente.'
          }
        ]
      },
      
      keyConcepts: [
        'Cross-platform development patterns',
        'Native API integration (filesystem, notifications, etc.)',
        'Partial hydration y architecture islands',
        'Mobile-first design y touch interactions',
        'Build optimization para diferentes plataformas',
        'Monorepo strategies y code sharing',
        'Container orchestration y deployment',
        'Performance monitoring y error tracking'
      ]
    }
  }
}