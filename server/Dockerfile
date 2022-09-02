FROM node:18

WORKDIR /home/node/app
COPY . /home/node/app/.

RUN npm install
RUN chown -R node:node .

CMD ["npm", "start"]
