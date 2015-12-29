FROM node:5

COPY . /src
WORKDIR /src

RUN npm install --production
RUN make build

VOLUME /src

EXPOSE 3000
CMD ["node", "--harmony", "--harmony_destructuring", "/src/bin/server"]