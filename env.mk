OS != uname
TIME != date +'%Y-%m-%d--%T'

env ?= development

DEFAULTMK != ./bin/upfind -name default.mk
include ${DEFAULTMK}

ENVMK != ./bin/upfind -name ${env}.mk
include ${ENVMK}

envpatchreverse:
	@echo "TESTING PATCHES development => ${env}"
	@echo "--------"
	patch --dry-run --strip=1 --reverse <development.diff
	@echo "--------"
	patch --dry-run --strip=1 <${env}.diff

	@echo ""
	@echo "PATCHING development => ${env}"
	@touch development.diff ${env}.diff
	@echo "--------"
	@patch --strip=1 --reverse <development.diff
	@echo "--------"
	@patch --strip=1 <${env}.diff

envpatch:
	@echo ""
	@echo "TESTING PATCHES ${env} => development"
	@echo "--------"
	patch --dry-run --strip=1 --reverse <${env}.diff
	@echo "--------"
	patch --dry-run --strip=1 <development.diff

	@echo ""
	@echo "PATCHING ${env} => development"
	@touch development.diff ${env}.diff
	@echo "--------"
	@patch --strip=1 --reverse <${env}.diff
	@echo "--------"
	@patch --strip=1 <development.diff
