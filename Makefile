COMMIT = $(shell git rev-parse --short HEAD)

TAG_VERSION = $(shell git tag --sort=taggerdate | tail -1)
PROD_DOCKER_IMAGE = fluidex/exchange-front:$(TAG_VERSION)

.PHONY: build image publish push

build:
	PUBLIC_URL=/exchange npm run build

image:
	docker build -t fluidex/exchange-front:$(COMMIT) .

publish:
	docker tag fluidex/exchange-front:$(COMMIT) fluidex/exchange-front:latest
	docker push fluidex/exchange-front:$(COMMIT)
	docker push fluidex/exchange-front:latest

push: image publish

prod-image:
	# git checkout $(TAG_VERSION)
	docker build -t $(PROD_DOCKER_IMAGE) .

publish-prod-image:
	docker push $(PROD_DOCKER_IMAGE)
	
sync-kline:
	cd public; git clone git@github.com:fluidex/tradingView.git
