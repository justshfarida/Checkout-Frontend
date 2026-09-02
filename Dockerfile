# Stage 1: Build React/Vite application
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


# Stage 2: Serve built frontend
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
# Go to the previous builder stage, take the generated /app/dist files, and put them into Nginx's website directory.
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]