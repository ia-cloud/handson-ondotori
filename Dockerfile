FROM node:6.11.0-slim

RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app

COPY ./package.json $HOME/ondo-proxy/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/ondo-proxy
RUN npm install --production

USER root
COPY ./index.js ./dist/ $HOME/ondo-proxy/
RUN chown -R app:app $HOME/*
USER app

CMD ["npm", "run", "start"]