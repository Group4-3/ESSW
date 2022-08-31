FROM node:18

WORKDIR /home/node/app
COPY . /home/node/app/.

RUN npm install
RUN mkdir /home/node/app/node_modules/.cache && chown -R node:node /home/node/app/node_modules/.cache

EXPOSE 3000
CMD ["npm", "start"]
