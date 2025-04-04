# Running Services with Docker

Create the docker build file inside the service.

1. touch Dockerfile
2. Add the following code to the docker file

```docker
FROM node:alpine

WORKDIR /app
COPY package.json ./
RUN npm install

COPY ./ ./
CMD ["npm", "start"]
```

Add .dockerignore file to avoid copying node modules

To build the docker image

1. docker build .
2. docker run IMG_ID
3. docker images
4. docker ps -a

Useful commands

1. docker build -t shubhansu-kr/posts
2. docker run [img_tag or img_id]
3. docker run -it img_id
4. docker ps
5. docker exec -it container_id
6. docker logs container_id
