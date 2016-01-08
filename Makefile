
bin = ./node_modules/.bin
browserify =$(bin)/browserify 
watchify =$(bin)/watchify
nodemon =$(bin)/nodemon

server:
	node --harmony \
		--harmony_destructuring \
		bin/server

watch-server:
	$(nodemon) --harmony \
		--harmony_destructuring \
		bin/server

build:
	mkdir -p build
	$(browserify) -v -t [ babelify --presets [ react es2015 ] ] \
		client/index.js -o build/build.js

watch-build:
	$(watchify) -v -t [ babelify --presets [ react es2015 ] ] \
		client/index.js -o build/build.js

docker:
	docker build -t segment/specs .
	docker push segment/specs:latest


.PHONY: build server