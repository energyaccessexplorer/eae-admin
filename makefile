default: lint build

deps:
	DEST=./dist/lib ./bin/deps

.include "./env.mk"
.include "./duck-tape.mk"
