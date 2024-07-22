deps:
	sudo apt-get install mkcert -y
	
watch:
	RULES_DIR=../../rules RUSTFLAGS=-Awarnings cargo watch -c -w backend/src -x run

build:
	docker build .

run:
	docker run -p 3000:3000 gorules/editor

dev:
	npm i pnpm -g
	pnpm i
	mkcert --install
	cd cert && mkcert localhost
	cd ..
	pnpm dev
