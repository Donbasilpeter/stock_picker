FROM node:18 As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install 

COPY . .

EXPOSE 8000


CMD ["npm", "run", "start"]
