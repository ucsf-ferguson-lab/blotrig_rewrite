.PHONY: run test fmt clean

run: fmt
	cd blotrig && npm run dev

test:
	cd blotrig/src && npx ts-node test.ts

fmt:
	cd blotrig && \
	npm run lint && \
	npx prettier . --write

clean:
	find . -type d -name "node_modules" | xargs rm -rf