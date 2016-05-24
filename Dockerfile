FROM node:5

COPY . /src
WORKDIR /src

RUN npm install
RUN make build
RUN npm prune --production

VOLUME /src

EXPOSE 3000
CMD ["node", "--harmony", "--harmony_destructuring", "/src/bin/server"]