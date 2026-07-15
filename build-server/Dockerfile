FROM ubuntu:focal

RUN apt-get update 
RUN apt-get upgrade -y

RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash - 
RUN apt-get install -y nodejs
RUN apt-get install git -y
RUN npm install -g pnpm yarn bun

WORKDIR /home/app
COPY builder builder
COPY script.js script.js
COPY main.sh main.sh
COPY package*.json .
COPY .env .env

RUN npm install

RUN chmod +x script.js
RUN chmod +x main.sh

ENTRYPOINT [ "/home/app/main.sh" ]
