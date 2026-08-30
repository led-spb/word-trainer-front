FROM node:25-slim as build

WORKDIR /app
COPY ./package.json ./package-lock.json /app/
RUN npm install 
COPY . /app/
RUN npm run build && npm cache clean --force


FROM nginx:1.29-alpine-slim

COPY --from=build /app/dist/ /usr/share/nginx/html
COPY ./config/nginx.conf /etc/nginx/
COPY ./config/*.template /etc/nginx/templates/