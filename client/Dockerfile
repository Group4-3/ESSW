FROM node:18 as client-base

WORKDIR /home/node/app

ARG HOST_NAME
RUN mkdir -p /home/node/app/build_final
RUN chown 1001 /home/node/app/build_final
RUN chown node /home/node/app/
RUN npm i -g envsub
USER node
COPY --chown=node:node . /home/node/app/.
RUN npm install
ENV API_HOST_NAME=$HOST_NAME
RUN envsub /home/node/app/src/helpers/constants.js /home/node/app/src/helpers/constants.js
RUN cat /home/node/app/src/helpers/constants.js

RUN npm run build
CMD ["cp", "-r", "/home/node/app/build", "/home/node/app/build_final"]