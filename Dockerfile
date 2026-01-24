# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist/exam-app /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf