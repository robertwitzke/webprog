FROM node:17

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# COPY package*.json ./

# Install app dependencies
COPY package*.json /usr/src/app/
RUN npm install

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y git
RUN cd /usr/src/app
RUN git clone https://github.com/robertwitzke/webprog.git

WORKDIR /usr/src/app/webprog
EXPOSE 8080
CMD [ "node", "app.js" ]