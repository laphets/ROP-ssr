# build stage
FROM node:9 as build-stage
WORKDIR /app
COPY package.json package-lock.json ./

RUN npm i cnpm -g --registry=https://registry.npm.taobao.org

RUN cnpm i

COPY . .

RUN npm run build
RUN npm start