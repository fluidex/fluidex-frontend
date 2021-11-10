#!/bin/bash

#TARGET="$1"
TARGET="sw"
# PUBLIC_URL=""
# API_HOST="/api"
DEPLOY_DIR="/var/www"

echo -e "\n------------------------"
echo " Start building ..."
echo "  Target: $TARGET"
echo "  Dir: $DEPLOY_DIR"
echo -e "------------------------\n"

# check target
if [[ -z $TARGET ]]; then
   echo "Invalid Target"
   exit 1
fi

# export production env
export API_HOST=$API_HOST
export PUBLIC_URL=$PUBLIC_URL

# Clean build dir
rm -rf ./build/;

# Start build
yarn build;
echo "Build success";

# Zip dist file
zip -r ./build.zip build/*;
if [ ! -e ./build.zip ]; then
  echo "-- zip faild!"
  exit 1
fi

# Sync to server
echo "Sync build.zip";
scp ./build.zip $TARGET:$DEPLOY_DIR
rm ./build.zip;

# remote script: Deploy
ssh $TARGET bash -c "'
  echo "Deploying ...";
  
  if [ ! -d $DEPLOY_DIR ]; then
    mkdir -p $DEPLOY_DIR
  fi
  cd $DEPLOY_DIR;

  rm -rf ./build;
  unzip -o build.zip;
  rm build.zip;
'";

echo -e "\n------------------------"
echo "  Deploy successfully!"
echo -e "------------------------\n"
