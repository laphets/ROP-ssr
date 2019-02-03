# build stage
FROM node:9 as build-stage
WORKDIR /app
COPY package.json yarn.lock ./

RUN npm i yarn -g --registry=https://registry.npm.taobao.org

RUN yarn config set registry https://registry.npm.taobao.org
RUN yarn --registry=https://registry.npm.taobao.org

COPY . .

RUN yarn build
RUN yarn start