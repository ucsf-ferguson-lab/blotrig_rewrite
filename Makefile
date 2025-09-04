.PHONY: run fmt clean

run: fmt
	cd blotrig && \
	npm run dev

fmt:
	cd blotrig && \
	npm run lint && \
	npx prettier . --write

clean:
	find . -type d -name "node_modules" | xargs rm -rf