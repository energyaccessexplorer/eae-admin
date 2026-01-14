DIST = ./dist

DT_BASE ?= "/"

lint:
	eslint --format unix --fix ./src

build:
	@mkdir -p src images templates views

	@rsync -r src ${DIST}/
	@rsync -r images ${DIST}/
	@rsync -r templates ${DIST}/
	@rsync -r views/ ${DIST}

	@echo '{}' \
		| jq '.api = ${DT_API}' \
		| jq '.logo = ${DT_LOGO}' \
		| jq '.auth_server = ${AUTH_SERVER}' \
		| jq '.auth_world = ${AUTH_WORLD}' \
		| jq '.production = ${DT_PRODUCTION}' \
		| jq '.upload = ${DT_UPLOAD}' \
		| jq '.src = ${DT_SRC}' \
		| jq '.base = ${DT_BASE}' \
		| jq '.project = ${DT_PROJECT}' \
		> tmpconfig

	@cat tmpconfig | jq

	@touch src/config-extras.js

	@printf "%s" "export const config = " | \
		cat - tmpconfig \
		src/config-extras.js \
		> ${DIST}/config.js

	@rm -f tmpconfig

sync:
	@rsync -OPvr \
		--copy-links \
		--checksum \
		--delete-after \
		${DIST}/ \
		${DT_HOST}:${DT_DEST}

synced:
	@rsync -OPr \
		--info=FLIST0 \
		--dry-run \
		--copy-links \
		--checksum \
		--delete-after \
		${DIST}/ \
		${DT_HOST}:${DT_DEST}

deploy: envpatchreverse build sync envpatch
	bmake build env=development
