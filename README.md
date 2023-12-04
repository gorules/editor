# Open-source Rules Engine Editor with build in Simulator

URL: https://editor.gorules.io

## Running via Docker

Running locally:
```bash
docker run -p 3000:3000 --platform=linux/amd64 gorules/editor
```

Repository:
https://hub.docker.com/r/gorules/editor

## Quickstart

Run rust backend:
```bash
make watch
```

Run frontend:
```bash
npm i pnpm -g
pnpm i
pnpm dev
```


### Local HTTPS

To create a local HTTPS certificate:
```bash
brew install mkcert

mkcert --install
cd cert && mkcert localhost
```