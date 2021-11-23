#!/usr/bin/env bash
server="18.180.248.43"
server_arr_dev=('18.182.40.214')
server_arr_prod=('18.180.248.43')

set -ex
IMAGE_TAG=$2
DOCKER_PORT="8080"
if [ -z "$IMAGE_TAG" ]; then
    IMAGE_TAG=$(git rev-parse --verify HEAD)
fi

ENV=$3

if [ -z "$ENV" ]; then
    ENV="dev"
fi

if [ $ENV = prod ]; then
    DOCKER_PORT="8081"
fi

ECR_REGISTRY="ccr.ccs.tencentyun.com"
ECR_REPO="fluidex"
NAME=fluidex-web
CONTAINER_NAME=${NAME}-${ENV}
IMAGE=${ECR_REGISTRY}/${ECR_REPO}/${NAME}:$IMAGE_TAG

echo "$1"
#IMAGE=$IMAGE-web
echo image: "$IMAGE"

servers=`eval echo '$'{server_arr_"$ENV"[@]}`

function build() {
  docker build -t "$IMAGE" -f Dockerfile ..
}

function pull() {
  docker pull "$IMAGE"
}

function push() {
  docker push "$IMAGE"
}

function run() {
  docker rm -f $CONTAINER_NAME
  docker run -d --restart=always -p $DOCKER_PORT:80 --name $CONTAINER_NAME $IMAGE
}

function pull_run() {
  pull
  run
}

function build_push() {
  build
  push
}

function deploy() {
  for server in ${servers[@]}
    do
      ssh-keyscan ${server} >> ~/.ssh/known_hosts &&
      echo deploy $ENV on "$server" start
      scp ./docker/fluidex-web.sh ubuntu@${server}:~/
      ssh ubuntu@${server} "
        ./fluidex-web.sh pull_run ${IMAGE_TAG} ${ENV} 
      "
      echo deploy  $ENV on "$server" finish
    done
}

case $1 in
  "run")
  run
  ;;
  "build")
    build
  ;;
  "pull")
    pull
  ;;
  "push")
  push
  ;;
  "pull_run")
  pull_run
  ;;
  "build_push")
  build_push
  ;;
  "deploy")
  deploy
  ;;
  "notify")
  notify "$@"
  ;;
esac
