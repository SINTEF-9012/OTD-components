FROM ubuntu:17.04
RUN apt-get update
RUN apt-get install -y curl git nodejs npm
RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN apt-get update

RUN npm install npm@latest -g

RUN git clone https://github.com/node-red/node-red.git
WORKDIR "/node-red"
RUN npm install
RUN npm run build


WORKDIR "/"
RUN git clone https://github.com/SINTEF-9012/OTD-components.git
WORKDIR "/OTD-components"
RUN npm install
RUN npm link

WORKDIR "/OTD-components/components/ruter"
RUN npm install
RUN npm link

WORKDIR "/OTD-components/components/sirisx"
RUN npm install
RUN npm link


WORKDIR /root/.node-red
RUN npm link node-red-reisapi
RUN npm link node-red-sirisx
RUN npm link node-red-ckan


WORKDIR "/node-red"
ENTRYPOINT npm start
