FROM node:8
VOLUME [ "/srv/solid/fs", "/srv/solid/db" ]


ENV ROOT=/srv/solid/fs
ENV DB_PATH=/srv/solid/db

ENV CERT_PATH=/etc/ssl/fullchain.pem
ENV KEY_PATH=/etc/ssl/privkey.pem
ENV CONFIG_PATH=/home/node/lib/solid/config

ENV HOSTNAME=localhost
ENV PORT=443

ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV DEBUG=*

EXPOSE ${PORT}

WORKDIR /home/node/lib/solid

COPY package.json ./
RUN npm install

COPY config .
COPY scripts .
COPY app.js .

COPY fullchain.pem ${CERT_PATH}
COPY privkey.pem ${KEY_PATH}

CMD [ "node", "app" ]
