# 🎨 Guía de Diseño UX/UI - Figma

## 📋 Información del Proyecto

**Aplicación**: Módulo de Efecto de la Inflación sobre el Ahorro  
**Curso**: DESARROLLO DE APLICACIONES WEB Y MÓVILES  
**Equipo**: Anibal Huaman, Karen Medrano, David Cantorín, Sulmairy Garcia, Diego Arrieta

## 🎯 Objetivo del Diseño

Crear una interfaz intuitiva, moderna y accesible que permita a los usuarios calcular fácilmente el impacto de la inflación en sus ahorros.

## 🎨 Paleta de Colores

### Colores Principales
```
Primario: #0066CC (Azul corporativo)
Primario Oscuro: #004D99
Primario Claro: #E6F2FF

Secundario: #475569 (Gris azulado)
Éxito: #059669 (Verde)
Advertencia: #D97706 (Naranja)
Peligro: #DC2626 (Rojo)
```

### Colores de Fondo
```
Fondo Principal: #F8FAFC (Gris muy claro)
Superficie: #FFFFFF (Blanco)
Superficie Elevada: #FFFFFF (Blanco con sombra)
Acento Gris: #F1F5F9
```

### Colores de Texto
```
Texto Principal: #0F172A (Casi negro)
Texto Secundario: #475569 (Gris medio)
Texto Terciario: #64748B (Gris claro)
Texto Inverso: #FFFFFF (Blanco)
```

## 📐 Tipografía

### Familia de Fuentes
- **Principal**: Inter (Google Fonts)
- **Fallback**: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif

### Escalas Tipográficas
```
H1: 1.875rem (30px) - Títulos principales
H2: 1.5rem (24px) - Títulos de sección
H3: 1.125rem (18px) - Subtítulos
Body: 1rem (16px) - Texto principal
Small: 0.875rem (14px) - Texto secundario
Tiny: 0.75rem (12px) - Texto de ayuda
```

### Pesos de Fuente
- **300**: Light (para textos grandes)
- **400**: Regular (texto normal)
- **500**: Medium (énfasis sutil)
- **600**: Semi-bold (títulos)
- **700**: Bold (énfasis fuerte)

## 🖼️ Componentes de Diseño

### 1. Header
- **Altura**: 200px (desktop), 160px (móvil)
- **Fondo**: Gradiente azul (#0066CC → #004D99)
- **Badge del Curso**: 
  - Fondo: rgba(255, 255, 255, 0.15) con blur
  - Borde: rgba(255, 255, 255, 0.2)
  - Radio: 20px
  - Padding: 8px 16px
- **Icono**: 48px, animación flotante
- **Título**: Blanco, peso 600, espaciado de letras -0.015em

### 2. Formulario
- **Contenedor**: 
  - Fondo blanco
  - Padding: 40px
  - Radio: 8px
  - Sombra: 0 1px 3px rgba(0, 0, 0, 0.1)
- **Inputs**:
  - Altura: 48px
  - Borde: 1.5px sólido #E2E8F0
  - Radio: 6px
  - Padding: 14px 16px
  - Focus: Borde azul + sombra 0 0 0 4px rgba(0, 102, 204, 0.1)
- **Labels**:
  - Tamaño: 14px
  - Peso: 600
  - Color: #0F172A
  - Margin bottom: 8px
- **Botón Principal**:
  - Fondo: Gradiente azul
  - Altura: 52px
  - Padding: 18px 40px
  - Radio: 6px
  - Sombra: 0 4px 12px rgba(0, 102, 204, 0.3)
  - Hover: Elevación -2px, sombra más intensa

### 3. Tarjetas de Resultados
- **Dimensiones**: 
  - Desktop: Grid 3 columnas
  - Móvil: 1 columna
  - Gap: 16px
- **Estilo**:
  - Fondo blanco
  - Padding: 28px
  - Radio: 6px
  - Borde: 1.5px sólido
  - Sombra: 0 1px 2px rgba(0, 0, 0, 0.05)
  - Hover: Elevación -3px, sombra más grande
- **Iconos**: 32px, con drop-shadow
- **Valores**: 26px, peso 700, color principal

### 4. Tabla de Series Temporales
- **Header**:
  - Fondo: #F8FAFC
  - Altura: 48px
  - Peso: 600
  - Padding: 12px 16px
- **Filas**:
  - Altura: 48px
  - Padding: 12px 16px
  - Hover: Fondo #F8FAFC
- **Bordes**: 1px sólido #E2E8F0 entre filas

### 5. Gráfico Canvas
- **Dimensiones**: 800x400px (desktop), 100%x400px (móvil)
- **Padding interno**: 60px
- **Colores**:
  - Valor Nominal: #EF4444 (Rojo, línea punteada)
  - Valor Real: #2563EB (Azul, línea sólida)
- **Puntos**: Círculos de 4px de radio
- **Ejes**: #E2E8F0, grosor 1px
- **Etiquetas**: 12px, color #64748B

### 6. Footer
- **Fondo**: #F8FAFC
- **Padding**: 40px 0
- **Borde superior**: 1px sólido #E2E8F0
- **Información del curso**: 
  - Título: 15px, peso 600
  - Subtítulo: 13px, peso 400
- **Equipo**:
  - Label: 11px, uppercase, letter-spacing 0.1em
  - Nombres: 13px, separados por "•"
  - Hover: Color primario

## 📱 Breakpoints Responsivos

```
Mobile: < 640px
Tablet: 640px - 768px
Desktop: > 768px
```

### Ajustes por Breakpoint

#### Mobile (< 640px)
- Header: Padding 20px, título 24px
- Formulario: Padding 24px
- Grid de resultados: 1 columna
- Tabla: Scroll horizontal
- Footer: Integrantes en columna

#### Tablet (640px - 768px)
- Header: Padding 24px
- Grid de resultados: 2 columnas
- Formulario y resultados: Grid 1 columna

#### Desktop (> 768px)
- Layout completo: Grid 2 columnas (formulario | resultados)
- Grid de resultados: 3 columnas
- Espaciado máximo: 1200px

## ✨ Animaciones y Transiciones

### Transiciones
- **Botones**: 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- **Inputs**: 0.2s cubic-bezier(0.4, 0, 0.2, 1)
- **Tarjetas**: 0.3s cubic-bezier(0.4, 0, 0.2, 1)

### Animaciones
- **Icono flotante**: 3s ease-in-out infinite (translateY -10px)
- **Spinner de carga**: 1s linear infinite (rotate 360deg)
- **Fade in**: 0.5s ease-out (opacity 0 → 1, translateY 20px → 0)

## 🎯 Principios de UX

### 1. Claridad
- Etiquetas descriptivas en todos los campos
- Texto de ayuda bajo cada input
- Mensajes de error claros y específicos

### 2. Feedback Visual
- Estados hover en elementos interactivos
- Indicadores de carga durante cálculos
- Mensajes de éxito/error visibles

### 3. Accesibilidad
- Contraste mínimo 4.5:1 para texto
- Focus visible en elementos interactivos
- Navegación por teclado funcional
- Textos alternativos para iconos

### 4. Consistencia
- Mismos estilos para elementos similares
- Espaciado uniforme (sistema de 4px)
- Colores consistentes en toda la aplicación

## 📐 Sistema de Espaciado

Basado en múltiplos de 4px:
```
4px: 0.25rem   - Espaciado mínimo
8px: 0.5rem    - Espaciado pequeño
12px: 0.75rem  - Espaciado medio-pequeño
16px: 1rem     - Espaciado base
24px: 1.5rem   - Espaciado medio
32px: 2rem     - Espaciado grande
40px: 2.5rem   - Espaciado muy grande
```

## 🖼️ Mockups en Figma

### Estructura Recomendada

1. **Frame Principal**: 1440x1024px (Desktop)
2. **Frame Móvil**: 375x812px (iPhone)
3. **Frame Tablet**: 768x1024px (iPad)

### Componentes a Crear

1. **Button** (variantes: primary, secondary, danger)
2. **Input** (variantes: text, number, select)
3. **Card** (variantes: default, primary, danger, warning)
4. **Badge** (variante: course badge)
5. **Table** (header + rows)
6. **Chart** (placeholder para canvas)

### Estilos en Figma

Crear estilos de texto:
- **H1**: Inter, 30px, Semi-bold, #0F172A
- **H2**: Inter, 24px, Semi-bold, #0F172A
- **Body**: Inter, 16px, Regular, #0F172A
- **Small**: Inter, 14px, Regular, #475569
- **Tiny**: Inter, 12px, Regular, #64748B

Crear estilos de color:
- **Primary**: #0066CC
- **Primary Dark**: #004D99
- **Success**: #059669
- **Warning**: #D97706
- **Danger**: #DC2626
- **Background**: #F8FAFC
- **Surface**: #FFFFFF

## 📝 Checklist de Diseño

### Wireframes
- [ ] Estructura general (desktop)
- [ ] Estructura móvil
- [ ] Flujo de usuario completo

### Mockups de Alta Fidelidad
- [ ] Página principal (desktop)
- [ ] Página principal (móvil)
- [ ] Estado de carga
- [ ] Estado de error
- [ ] Resultados con gráfico

### Componentes
- [ ] Botones
- [ ] Inputs
- [ ] Tarjetas
- [ ] Tabla
- [ ] Footer

### Especificaciones
- [ ] Espaciado documentado
- [ ] Colores documentados
- [ ] Tipografía documentada
- [ ] Breakpoints documentados

## 🔗 Enlaces Útiles

- [Figma](https://www.figma.com/) - Herramienta de diseño
- [Inter Font](https://fonts.google.com/specimen/Inter) - Fuente principal
- [Tailwind CSS Colors](https://tailwindcss.com/docs/customizing-colors) - Referencia de colores
- [Material Design Guidelines](https://material.io/design) - Referencia de UX

## 📸 Capturas de Pantalla Sugeridas

Para incluir en la documentación:
1. Vista completa desktop
2. Vista móvil
3. Detalle del formulario
4. Detalle de resultados
5. Gráfico de evolución
6. Estado de error

## 🎓 Notas para el Equipo

Este diseño sigue principios de:
- **Material Design** (Google)
- **Human Interface Guidelines** (Apple)
- **Web Content Accessibility Guidelines (WCAG) 2.1**

El diseño es completamente responsivo y accesible, cumpliendo con estándares modernos de desarrollo web.

