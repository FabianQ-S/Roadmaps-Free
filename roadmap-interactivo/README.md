# 🗺️ Roadmap Interactivo de JavaScript & Vue.js

![Vue.js](https://img.shields.io/badge/Vue.js-3.x-green.svg)
![Vite](https://img.shields.io/badge/Vite-6.x-blue.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

Una experiencia de aprendizaje interactiva y moderna para dominar el desarrollo frontend con JavaScript y Vue.js.

## ✨ Características

### 🎯 **Roadmap Completo**
- **4 Fases estructuradas** desde fundamentos hasta tecnologías avanzadas
- **12 tecnologías principales** + **11 opcionales** = **23 tecnologías totales**
- **Sistema de dificultad** de 1-5 estrellas con colores dinámicos
- **Estimaciones de tiempo** realistas para cada tecnología
- **✅ Todos los nodos funcionando correctamente** (incluye AdonisJS, Inertia.js y Podman)

### 🎨 **Diseño Moderno**
- **Tema oscuro elegante** con gradientes dinámicos
- **Fully responsive** - optimizado para móviles, tablets y desktop
- **Animaciones suaves** y efectos glassmorphism
- **Logo Vue.js giratorio** con efectos de partículas

### 🔧 **Funcionalidades Interactivas**
- **Modales informativos** con descripciones detalladas, conceptos clave y recursos
- **Sistema de progreso** con seguimiento de estado por tecnología
- **Rutas de aprendizaje** paso a paso con checkboxes interactivos
- **Recursos de aprendizaje** con enlaces a documentación oficial y tutoriales
- **Experiencia de usuario** intuitiva y atractiva

### 📚 **Recursos de Aprendizaje**
- **100+ enlaces curados** para cada tecnología
- **Documentación oficial**, tutoriales y cursos
- **Recursos categorizados** por tipo (📖 Docs, 🎥 Videos, 🔧 Tools)

### 🎮 **Interactividad**
- **Sistema de progreso** visual con contador flotante
- **Modal informativo** con detalles completos
- **Estado de completado** persistente
- **Efectos hover** y animaciones de feedback

### 🔧 **Última Actualización (12 Jun 2025)**
- **✅ ISSUE RESOLVED:** Nodos opcionales ahora se muestran correctamente
- **Optimización Vue.js:** Computed properties para mejor reactividad
- **11 nodos opcionales** funcionando en todas las fases
- **Bundle optimizado:** 85.87 kB (31.44 kB gzipped)

## 🚀 Inicio Rápido

### Requisitos previos
- Node.js 18+ 
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El proyecto estará disponible en `http://localhost:5173`

## 📱 Tecnologías del Roadmap

### **⓪ Fase 0: Fundamentos Absolutos**
- `HTML/CSS/JS` - Base del desarrollo web
- `Git/GitHub` - Control de versiones
- `NPM` - Gestión de paquetes
- **Opcionales:** `Docker`, `MongoDB`

### **🧱 Fase 1: Frontend Moderno**
- `Vite` - Build tool moderno
- `Vue.js` - Framework progresivo
- `React` - Librería declarativa
- **Opcionales:** `TypeScript`, `Firebase`

### **🌍 Fase 2: Backend y Testing**
- `Testing` - Jest/Vitest para calidad
- `Express.js` - Backend con Node.js
- `Nuxt.js` - Meta-framework para Vue
- **Opcionales:** `Testing Library`, `PWAs`, `GraphQL`, `Puppeteer`

### **🚀 Fase 3: Nuevos Horizontes**
- `Electron` - Apps de escritorio
- `Astro` - Sitios web ultra-rápidos
- `Expo (RN)` - Desarrollo móvil
- **Opcionales:** `AdonisJS`, `Inertia.js`, `Podman`

## 🛠️ Estructura del Proyecto

```
src/
├── components/
│   ├── RoadmapView.vue      # Componente principal
│   ├── RoadmapNode.vue      # Nodos individuales  
│   ├── NodeModal.vue        # Modal con detalles
│   └── ProgressCounter.vue  # Contador de progreso
├── data/
│   └── roadmapData.js       # Datos del roadmap
└── assets/
    └── *.css               # Estilos globales
```

## 🎨 Personalización

### Colores (Tema Dracula)
```javascript
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
```

## 📱 Responsive Design

- **📱 Móvil:** 320px - 768px (layout vertical)
- **📟 Tablet:** 769px - 1400px (grid 2 columnas)  
- **💻 Desktop:** 1400px+ (layout completo)

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción  
npm run build

# Preview del build
npm run preview
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🙏 Agradecimientos

- [Vue.js](https://vuejs.org/) por el excelente framework
- [Vite](https://vitejs.dev/) por el build tool ultra-rápido
- [Dracula Theme](https://draculatheme.com/) por los hermosos colores

---

**⭐ Si este proyecto te ayuda en tu aprendizaje, considera darle una estrella!**

## 🧪 Pruebas y Verificación

### Script de Pruebas Completo

El proyecto incluye un script completo de pruebas que verifica todas las funcionalidades:

```bash
# 1. Abrir la aplicación en el navegador
http://localhost:5173

# 2. Abrir DevTools (F12) → Console

# 3. Cargar el script de pruebas
# Copiar y pegar el contenido de: test-completo-final.js

# 4. Ejecutar todas las pruebas
testAll()
```

### Funciones de Prueba Disponibles

```javascript
// Pruebas completas (recomendado)
testAll()

// Pruebas específicas
testCriticalNodes()    // Solo AdonisJS, Inertia.js, Podman
testModalsOnly()       // Solo funcionalidad de modales
```

### Lo que se Prueba

- ✅ **Nodos principales** (12 tecnologías core)
- ✅ **Nodos opcionales** (11 tecnologías adicionales)
- ✅ **Nodos de fase** (correctamente bloqueados)
- ✅ **Contenido de modales** (descripción, recursos, conceptos)
- ✅ **Diseño responsivo** (móvil, tablet, desktop)
- ✅ **Reactividad Vue** (dropdowns, checkboxes)

### Criterios de Éxito

- **95%+** → 🎉 Excelente funcionamiento
- **80-94%** → ✅ Bueno con problemas menores
- **<80%** → ⚠️ Requiere corrección
