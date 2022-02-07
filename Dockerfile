FROM node:17

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# COPY package*.json ./

# Install app dependencies
COPY package*.json /usr/src/app/
RUN npm install

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y git
RUN cd /usr/src/app
RUN git clone https://github.com/robertwitzke/webprog.git

# If you are building your code for production
# RUN npm ci --only=production

EXPOSE 8080
CMD [ "node", "webprog/app.js" ]