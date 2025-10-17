# react-mini-search

A tiny, dependency-light React search UI powered by MiniSearch and Tailwind CSS. Exported components provide an inline search box and a keyboard-accessible search dialog suitable for docs, apps, and component libraries.

## Features

- Lightweight client-side full-text search using `minisearch`.
- Ready-to-use components: `InlineSearch`and `SearchDialog`
- Fully typed with TypeScript and exportable types .
- Tailwind CSS for styling; build step generates a distributable `styles.css`.

## Installation

Install peer dependencies in your project (React >= 17) and then add this package as a dependency. Example using pnpm:

```powershell
pnpm add -D react-mini-search
```

## Quick start

Example documents (each document must have an `id` and `title`):

```tsx
const docs = [
  { id: 1, title: 'Getting Started', description: 'Intro docs', url: '/getting-started' },
  { id: 2, title: 'API', description: 'Reference docs', url: '/api' },
]

import { InlineSearch, SearchDialog } from 'react-mini-search'

// Inline
<InlineSearch
  documents={docs}
  fields={["title", "description"]}
  storeFields={["title", "description", "url"]}
  placeholder="Search docs..."
  onResultClick={(res) => { if (res.url) window.location.href = res.url }}
/>

// Dialog (provides a / Ctrl/Cmd+K keyboard shortcut)
<SearchDialog
  documents={docs}
  fields={["title", "description"]}
  storeFields={["title", "description", "url"]}
  placeholder="Search documentation..."
  onResultSelect={(res) => console.log('selected', res)}
/>
```

## API

Exports (from `src/index.ts`):

- `InlineSearch` — Inline search component.
- `SearchDialog` — Modal search dialog with keyboard shortcut and selectable results.
- `SearchTrigger` — Small trigger component (bar/button) for opening the dialog.
- Types: `Document`, `Result`, `UseSearchProps`.

Types and important props (summary):

- Document

  - `id` (string | number) — required
  - `title` (string) — required
  - optional fields: `url`, `description`, `category`, `icon`, and any metadata

- UseSearchProps<T>

  - `documents: T[]` — array of documents
  - `fields: (keyof T)[]` — fields to index/search
  - `storeFields: (keyof T)[]` — fields to include in search results
  - `searchOptions?: MiniSearch.SearchOptions` — pass-through to MiniSearch

- SearchComponentProps (used by `InlineSearch` and `SearchDialog`)

  - `placeholder?: string`
  - `onResultClick?: (result) => void` — `InlineSearch`
  - `onResultSelect?: (result) => void` — `SearchDialog`
  - `debounceMs?: number` — default 300
  - `minQueryLength?: number` — default 2
  - `showClearButton?: boolean`
  - `emptyStateMessage?: string`
  - `loadingMessage?: string`
  - `className?: string`, `resultClassName?: string`, `renderResult?: (result) => React.ReactNode`

For full prop and type details see `src/lib/type.ts`.

## Development

Scripts are defined in `package.json` and expect `pnpm`:

- `pnpm build` — build JS (via `tsup`) and CSS (tailwind) to `dist/`.
- `pnpm build:js` — build JS only.
- `pnpm build:css` — build Tailwind CSS to `dist/styles.css`.
- `pnpm format` — format with Biome.
- `pnpm check` — run biome checks.

Example local build:

```powershell
pnpm install
pnpm build
```

## Bundling / Distribution

The package exposes `dist/index.mjs` and `dist/index.d.ts`. A `styles.css` build artifact is available at `dist/styles.css` and can be imported directly:

```js
import 'react-mini-search/styles.css'
```

## Notes & Recommendations

- MiniSearch runs in the browser and keeps an in-memory index. It's great for small to medium-sized datasets. For very large datasets prefer a server-side search service.
- Ensure `fields` and `storeFields` are chosen to include searchable text and any metadata your render functions use.
- The `SearchDialog` listens for `Ctrl/Cmd + K` to open. If you have another global shortcut, adapt or disable it.

## Contributing

Contributions are welcome. Open issues or PRs for bug fixes, small features, or documentation improvements.

