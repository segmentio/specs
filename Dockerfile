FROM node:6

COPY . /src
WORKDIR /src

RUN npm install
RUN make build
RUN npm prune --production

VOLUME /src

EXPOSE 3000
CMD ["node", "--harmony", "/src/bin/server"]
