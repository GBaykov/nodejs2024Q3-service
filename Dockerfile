FROM node:22.11-alpine3.19

EXPOSE ${PORT}

WORKDIR /docker/app

# регулярка на копирование любых package
COPY package*.json .

RUN npm install 

#перенос содержимого папки приложения в папку контейнера 
COPY . .

CMD ["npm", "run", "start:dev"]