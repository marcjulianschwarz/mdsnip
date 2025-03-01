FROM node:20-alpine

ARG FRONTEND_URL
ENV FRONTEND_URL=${FRONTEND_URL}

WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]