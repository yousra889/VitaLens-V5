# --- build stage ---
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Vite bakes VITE_* vars in at build time, not container runtime -
# override for anything beyond local dev, e.g.:
#   docker build --build-arg VITE_GATEWAY_URL=https://api.vitalens.example .
ARG VITE_GATEWAY_URL=http://localhost:3000
ENV VITE_GATEWAY_URL=$VITE_GATEWAY_URL
RUN npm run build

# --- runtime stage ---
FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
