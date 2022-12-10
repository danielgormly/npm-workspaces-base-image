# NODE LTS
FROM node:18.12-alpine3.15

ENV REPO=/home/me/repo
WORKDIR $REPO

RUN mkdir -p $REPO
COPY skeleton/ $REPO
RUN npm install
