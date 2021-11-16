# Frontend for FluiDex

## Requirements

- react
- redux/rematch
- sass
- antd

## Setup

- npm install
- git submodule update --init --recursive
- npm run compilecontract
- npm run build
- Put the dist directory in the target folder
- Can refer to deploy.sh
- Deployment: PUBLIC_URL=/exchange API_PREFIX="https://fluidex.app/" npm run build
- Deployment: PUBLIC_URL=/exchange npm run build

PUBLIC_URL=/exchange API_PREFIX="http://fluidex.app/" npm run build
