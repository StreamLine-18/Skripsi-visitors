# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Accept Vite ENV
ARG VITE_API_BASE_URL
ARG VITE_MIDTRANS_CLIENT_KEY
ARG VITE_HOLIDAY_API

ENV VITE_API_BASE_URL=https://api.strmlns.app/api
ENV VITE_MIDTRANS_CLIENT_KEY=Mid-server-W-HY7BjvZNRJj7pTmxfBORf9
ENV VITE_HOLIDAY_API=https://api-harilibur.vercel.app/api

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf 
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]