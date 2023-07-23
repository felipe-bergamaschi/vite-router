# vite-plugin-router

[![npm version](https://badgen.net/npm/v/vite-plugin-router)](https://www.npmjs.com/package/vite-plugin-router)
[![monthly downloads](https://badgen.net/npm/dm/vite-plugin-router)](https://www.npmjs.com/package/vite-plugin-router)
[![types](https://badgen.net/npm/types/vite-plugin-router)](https://github.com/felipe-bergamaschi/vite-router/blob/main/src/types.ts)
[![license](https://badgen.net/npm/license/vite-plugin-router)](https://github.com/felipe-bergamaschi/vite-router/blob/main/LICENSE)

> File system routing for React + Typescript applications using
> [Vite](https://github.com/vitejs/vite)

## Getting Started

### React

> Does not support versions below react-router v6

#### Install:

```bash
npm install -D vite-plugin-router
npm install react-router react-router-dom 
```

### Vite config

Add to your `vite.config.js`:

```js
import Routes from 'vite-plugin-router'

export default {
  plugins: [
    // ...
    Routes(),
  ],
}
```

## Overview

By default, vite-plugin-router creates a route file in the `src/` directory containing all the route settings for your application, while observing the files within `src/app`.

Routes are configured using the [Suspense API](https://react.dev/reference/react/Suspense) of `react-router` by default.

### React

Create `app` folder within `src/` and add `index.tsx` file. Export a default component as an example:

```js
export default function Page() {
  return (
    <div>
      <h1>Vite Router</h1>
    </div>
  )
}

```

Run your application `npm run dev`, and you will be able to observe the `(VITE ROUTER)` logs and find the 'routes' file created.

Add `AppRoutes` to your `main.tsx`:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
// ...
import { AppRoutes } from './routes'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>,
)
```

## Configuration

To use custom configuration, pass your options to Pages when instantiating the
plugin:

```js
// vite.config.js
import { defineConfig } from 'vite'
import Routes from 'vite-plugin-router'

export default defineConfig({
  plugins: [
    Routes({
      dir: 'src/app',
      outDir: 'src',
    })
  ],
})

```

### dir

- **Type:** `string`
- **Default:** `'src/app'`

Path to the pages directory.

### outDir

- **Type:** `string`
- **Default:** `'src'`

Output path for the `routes` file.

### extensions

- **Default:**
  - `['tsx', 'jsx', 'ts', 'js']`

### ignore files

- **Default:** 
  - `[style.*, *.css]` An array of glob patterns to ignore matches.

```bash
# folder structure
src/app/
    ├── admin/
    │  └── index.tsx
    │  └── index.css
    └── index.tsx
    └── style.ts
```

## File System Routing

Inspired by the routing from
[NextJS](https://nextjs.org/docs/pages/building-your-application/routing)

'Vite router' simplifies the process of creating routes for your vite application by automatically generating a 'routes' file based on the structure of the `.tsx` files in your pages directory. With this approach, connecting to your vite application becomes effortless, as no additional configuration is needed on your part.

### Basic Routing

Pages will automatically map files from your pages directory to a route with the
same name:

- `src/app/users.tsx` -> `/users`
- `src/app/users/profile.tsx` -> `/users/profile`
- `src/app/settings.tsx` -> `/settings`

### Index Routes

Files with the name `index` are treated as the index page of a route:

- `src/app/index.tsx` -> `/`
- `src/app/users/index.tsx` -> `/users`

### Dynamic Routes

Dynamic routes are denoted using square brackets. Both directories and pages can
be dynamic:

- `src/app/users/[id].tsx` -> `/users/:id` (`/users/123`)
- `src/app/users/[user]/settings.tsx` -> `/users/:user/settings` (`/users/123/settings`)


### Layouts

We can utilize 'layout' files to create nested layouts from the parent. By naming a specific file 'layout' and defining its child routes within it, we can establish a hierarchical structure for our application. This approach enhances the organization and management of routes, making it easier to maintain and extend the application.

For example, this directory structure:

```
src/app/
    ├── users/
    │  ├── index.tsx
    │  └── layout.tsx
    └── index.tsx
```

## 🚀 New features

Our application is in a constant state of evolution, and our team is dedicated to bringing you numerous improvements and exciting new features that will enhance its power and user-friendliness. Below, we present a glimpse of some of the features we are actively developing:

### 🚧 Catch-all Routes

Catch-all routes are denoted with square brackets containing an ellipsis:

- `src/app/[...all].vue` -> `/*` (`/non-existent-page`)

The text after the ellipsis will be used both to name the route, and as the name
of the prop in which the route parameters are passed.

### 🚧 Custom error 404

Create custom 404 routes tailored to each directory.

```
src/app/
    ├── users/
    │  ├── index.tsx
    │  ├── layout.tsx
    │  └── 404.tsx
    └── index.tsx
```

## License

MIT License © 2023-PRESENT [Felipe Bergamaschi](https://github.com/felipe-bergamaschi)