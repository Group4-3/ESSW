FROM node:18

WORKDIR /home/node/app
COPY . /home/node/app/.

RUN chown -R node:node .
USER node
RUN npm ci

CMD ["npm", "start"]
