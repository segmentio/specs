
.DEFAULT_GOAL := node_modules

WEBPACK_FLAGS ?= -p

server: node_modules
	node_modules/.bin/nodemon --harmony \
		--harmony_destructuring \
		--ignore client \
		--ignore build \
		bin/server

dev-server: node_modules
	node_modules/.bin/webpack-dev-server -d --hot --inline --port 3001

build: node_modules
	NODE_ENV=production node_modules/.bin/webpack $(WEBPACK_FLAGS)
	cp client/index.html build/index.html

docker:
	docker build -t segment/specs .
	docker push segment/specs:latest

node_modules: package.json
	npm install
	touch $@

clean:
	rm -rf build

distclean: clean
	rm -rf node_modules

.PHONY: clean distclean build server dev-server
