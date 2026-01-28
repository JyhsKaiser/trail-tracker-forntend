# 🥾 Trail Tracker Web - UI Interface (Angular 21)

Interfaz de usuario de alto rendimiento diseñada para una experiencia inmersiva en el rastreo de senderos. Este cliente utiliza las últimas capacidades de **Angular 21** junto con **Tailwind CSS** para ofrecer una aplicación rápida, segura y estéticamente premium.

🔗 **Repositorio Backend:** https://github.com/JyhsKaiser/trail-tracker-backend
---

## 🎨 Diseño y Experiencia de Usuario (UI/UX)

- **Premium Dark UI:** Estética "Dark Mode" moderna basada en una paleta de colores esmeralda y pizarra para reducir la fatiga visual y mejorar la legibilidad.
- **Tailwind CSS:** Implementación de diseño basado en utilidades que garantiza un sistema de estilos consistente, ligero y fácil de mantener.
- **Responsividad Total:** Arquitectura _Mobile-First_ que garantiza una visualización fluida desde smartphones hasta pantallas de escritorio de gran formato.
- **Interacciones Fluidas:** Uso de micro-animaciones y estados de carga dinámicos para proporcionar un feedback constante al usuario.

---

## ✨ Fortalezas Técnicas

- **Angular 21 (Modern Core):** Implementación completa de **Standalone Components** y el nuevo **Control Flow** nativo (`@if`, `@for`) para un código más limpio.
- **Estado Reactivo (Signals):** Uso de **Angular Signals** para una detección de cambios de grano fino, optimizando el rendimiento y la gestión global del estado del usuario.
- **Seguridad Integrada:**
  - **XSRF Interceptor:** Interceptor especializado que gestiona automáticamente los tokens de seguridad para peticiones `PATCH` y `POST`.
  - **AuthGuards:** Protección de rutas a nivel de cliente para prevenir accesos no autorizados a paneles privados.

---

## 🚢 Dockerización y Despliegue

- **Nginx Server:** El contenedor Docker utiliza **Nginx** configurado específicamente para manejar el enrutamiento de Single Page Applications (SPA), evitando errores 404 al recargar rutas.
- **Multi-stage Build:** Proceso de construcción que separa la instalación de dependencias y compilación (Node.js) de la entrega final (Nginx), garantizando una imagen de producción ligera y segura.
- **Puerto:** Expuesto por defecto en el puerto 4200 (mapeado al 80 interno del contenedor) para facilitar el acceso local.

---

## 🚀 Instrucciones de Levantamiento (Ecosistema Completo)

Para que el frontend pueda comunicarse con la API y la base de datos, se recomienda utilizar la orquestación de Docker.

### 1. Requisitos Previos

- **Docker Desktop** instalado y en ejecución.
- **Git** para clonar el proyecto.

### 2. Estructura de Carpetas

Clonar ambos repositorios en la misma ubicación para respetar el contexto de construcción del orquestador
