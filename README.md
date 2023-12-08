# htmxpress

Simple todo app using [htmx](https://htmx.org/), [Express](https://expressjs.com/) and [Prisma](https://www.prisma.io/) with [TypeScript](https://www.typescriptlang.org/).

Also using React to server-side render components like a templating engine, to give a type-safe DX vs. EJS or Pug.

### Setup

- Clone
- `npm install`
- `npm run dev`
- Or `npm run dev:sass` to watch any Sass files for changes

### Notes

[htmx](https://htmx.org/) makes just about any HTML element capable of sending HTTP requests and directing the response to another element, such that for example a submit button can send a POST request directly to the server and target the server response to a separate `<div>` element.

The server should return Hypermedia (HTML) rather than JSON in the response. This Express server does so using the EJS templating engine, but the others can be used too.

This means that there is minimal JS in the client, and certain elements can change other elements without needing to reload the entire page. It does other stuff too, but the upshot is you can focus your JS skills on the server instead of the client, unless you want some form of interactivity.

htmx is designed with [HATEOAS](https://htmx.org/essays/hateoas/) in mind, meaning that the client does not need to be aware of state, but rather what the server returns will determine the actions available to the client.
