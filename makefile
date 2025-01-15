default: lint dtbuild

lint:
	./bin/lint ./src

deps:
	DEST=./dist/lib ./bin/deps

.include "./env.mk"
.include "./duck-tape.mk"
