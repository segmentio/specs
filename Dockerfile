FROM segment/shifu-node:latest

COPY . /src

WORKDIR /src

RUN make build && npm prune --production

VOLUME /src

EXPOSE 3000

CMD ["/src/bin/server"]
