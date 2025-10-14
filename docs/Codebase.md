# Overview

Tech stack: TypeScript, React, TailwindCSS, NodeJS

## Structure

`src/components`, `src/logic`, `src/routes` are only files that should be changed. Everything else are configuration files. Note components and routes files end in .tsx extension, logic files end in .ts extension.

### App Layout

Classic sidebar + main view app layout. Panels in main view unlocked at specific checkpoints:

1. user uploads csv file
2. click "Create subjects table"
3. click "Create gel"

## Logic

There are checks that run in background:

1. Duplicate IDs. User can't proceed with creating gel if there are duplicate IDs found.
2. Custom gel number of lanes. Custom gel doesn't allow entering a number less than number of groups + 1 ladder.

Button will be greyed out if these conditions aren't met.

## Data privacy

All computation is done locally within the browser.

For self hosting:

1. fork repo
2. enable GitHub Pages and GitHub Actions
3. run actions workflow and wait for deploy to finish

## Updates

Run `npm update` at project root (where `package.json` file located)
