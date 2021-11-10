#!/bin/bash

NAME="exchange-dev"
COMMIT=$(git rev-parse --short HEAD)

if [ -n "$1" ]
then
    COMMIT=$1
fi

cd k8s/

echo "Create exchange front pod of $NAME"
cat exchange-front.yaml | sed 's/\$COMMIT'"/$COMMIT/g" | kubectl create -f - -n $NAME
