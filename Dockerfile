FROM node:12.17-alpine3.10 as build
WORKDIR /src
COPY package* ./
RUN npm install
COPY . .
RUN make build
FROM node:12.17-alpine3.10
WORKDIR /src
COPY package* ./
RUN npm install --production
COPY --from=build /src/bin ./bin
# Create unprividged user to run as
RUN addgroup -g 1001 -S unprivilegeduser && adduser -u 1001 -S -G unprivilegeduser unprivilegeduser
RUN chown -R unprivilegeduser:unprivilegeduser ./bin
USER unprivilegeduser
COPY --from=build /src/build ./build
COPY --from=build /src/server ./server
VOLUME /src
EXPOSE 3000
CMD ["node", "--harmony", "/src/bin/server"]
