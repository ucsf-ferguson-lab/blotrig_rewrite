.PHONY: fmt clean

fmt:
	npx prettier . --write

clean:
	find . -type d -name "node_modules" | xargs rm -rf