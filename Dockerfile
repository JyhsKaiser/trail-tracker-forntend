# Stage 1: Build
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration development

# Stage 2: Serve con Nginx (Estándar de Producción)
FROM nginx:alpine
# Configuración personalizada para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/trail-tracker/browser /usr/share/nginx/html
EXPOSE 80
