FROM ubuntu:focal

RUN apt-get update 
RUN apt-get upgrade -y

RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash - 
RUN apt-get install -y nodejs
RUN apt-get install git -y

ENV GITHUB_REPO_URL=url-to-your-repo

WORKDIR /home/app
COPY script.js script.js
COPY package*.json .

RUN npm install
RUN git clone $GITHUB_REPO_URL /home/app/output

RUN chmod +x script.js

CMD ["node", "script.js"]
