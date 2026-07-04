# worldcup

A lightweight, frontend-only tracker for our six-entry 2026 World Cup bracket pool.

## Updating the pool

All tournament data lives in [`data.js`](./data.js). Update match winners, statuses, and player picks there; standings are calculated automatically in the browser.

## Running locally

Because the app uses JavaScript modules, serve the folder over HTTP:

```sh
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Deployment

The site is built from plain HTML, CSS, and JavaScript and is compatible with GitHub Pages without a build step. All asset paths are relative, so it also works at a project URL such as `https://USERNAME.github.io/worldcup/`.
