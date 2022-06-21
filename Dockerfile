FROM node:17-alpine3.12

# Create app directory
WORKDIR /usr/src/app

ENV DB_CONNECT_STRING=undefined
ENV POPULATE=false

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]
