FROM node:20-alpine as frontend-build
WORKDIR /build/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend .

COPY --from=frontend-build /build/frontend/dist /app/frontend/dist

EXPOSE 3000
CMD ["node", "server.js"]
