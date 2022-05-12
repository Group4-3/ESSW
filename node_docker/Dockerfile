FROM node:17

WORKDIR /home/node/app

COPY node_app ./

RUN npm install

EXPOSE 8080
CMD ["npm", "start"]