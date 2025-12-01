# blotRig

> blotRig is a user-friendly interface designed to facilitate appropriate counterbalancing, technical replication, and analysis of western blot experiments.

blotRig has 2 components:

1. Gel creator
2. Analysis

## Gel creator

![](https://github.com/ucsf-ferguson-lab/blotrig_rewrite/raw/main/docs/main_logic.png)

### Quick start

Visit [https://ucsf-ferguson-lab.github.io/blotrig_rewrite](https://ucsf-ferguson-lab.github.io/blotrig_rewrite) and follow instructions on left side-bar.

#### Run locally

With node 20+ installed, run

```shell
npm install && npm run dev
```

### Structure

`src/components`, `src/logic`, `src/routes` are only files that should be changed. Everything else are configuration files. Note components and routes files end in .tsx extension, logic files end in .ts extension.

#### App Layout

Classic sidebar + main view app layout. Panels in main view unlocked at specific checkpoints:

1. user uploads csv file
2. click "Create subjects table"
3. click "Create gel"

### Logic

There are checks that run in background:

1. Duplicate IDs. User can't proceed with creating gel if there are duplicate IDs found.
2. Custom gel number of lanes. Custom gel doesn't allow entering a number less than number of groups + 1 ladder.

Button will be greyed out if these conditions aren't met.

### Data privacy

All computation is done locally within the browser.

For self hosting:

1. fork repo
2. enable GitHub Pages and GitHub Actions
3. run actions workflow and wait for deploy to finish

### Updates

Run `npm update` at project root (where `package.json` file located)

## Analysis

### Quick start

Visit [\_](_)

## Design decisions

blotRig was originally written in R as a shiny app. Later rewritten with TypeScript + React to simplify deployment and update UI design.
