FROM node:12.18-alpine3.11 as build
WORKDIR /src
COPY package* ./
RUN apk add --update make
RUN npm install
COPY . .
RUN make build
FROM 528451384384.dkr.ecr.us-west-2.amazonaws.com/segment-node:12.22.10-alpine3.15

WORKDIR /src
COPY package* ./
RUN npm install --production
COPY --from=build /src/bin ./bin
COPY --from=build /src/build ./build
COPY --from=build /src/server ./server

VOLUME /src

EXPOSE 3000
CMD ["node", "--harmony", "/src/bin/server"]
