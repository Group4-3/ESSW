FROM node:18 as client-base

WORKDIR /home/node/app
COPY . /home/node/app/.

RUN mkdir -p /home/node/app/node_modules/.cache && chown -R node:node /home/node/app
RUN npm install
RUN npm install --global serve


FROM client-base as client-base-prod
RUN npm run build
CMD ["serve", "-s", "build"]

FROM client-base as client-base-dev 
CMD ["npm", "start"]
