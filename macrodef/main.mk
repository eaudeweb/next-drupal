.DEFAULT_GOAL: help

NPM=pnpm
#NPM_INSTALL_FLAGS=--legacy-peer-deps

help: ## This help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: install
install:		## Bootstraps the package
	# npm install -g npm
	$(NPM) i $(NPM_INSTALL_FLAGS)

.PHONY: dev
dev:		## Starts websites in development mode
	$(NPM) run dev

.PHONY: docker-build
docker-build:
	@docker build -f .docker/Dockerfile . -t mlf-frontend:latest

.PHONY: docker-run
docker-run:
	@docker run -it -p 3000:3000 mlf-frontend:latest

.PHONY: docker-shell
docker-shell:
	@docker run -it -p 3000:3000 --entrypoint bash mlf-frontend:latest

# .PHONY: sb
# sb:		## start storybook in development mode
# 	$(NPM) run storybook
#
# .PHONY: start
# start:		## Start the website frontend in development mode
# 	$(NPM) run dev

# .PHONY: build
# build:		## Build a production bundle
# 	$(NPM) run build
#
# .next/BUILD_ID:
# 	$(NPM) run build
#
# .PHONY: start-prod
# start-prod:	.next/BUILD_ID		## Starts the frontend in production mode
# 	$(NPM) run start

.PHONY: test
test:		## Run Jest tests
	$(NPM) run test

# .PHONY: clean
# clean:		## Cleanup nextjs build folder
# 	@echo "This will clean the .next folder"
# 	rm -rf ./.next
# 	@echo "Done"

