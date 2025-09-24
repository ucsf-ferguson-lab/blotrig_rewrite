.PHONY: run test fmt clean

run: fmt
	npm run dev

test:
	cd src && npx ts-node test.ts

fmt:
	npm run lint && \
	npx prettier . --write

clean:
	find . -type d -name "node_modules" | xargs rm -rf