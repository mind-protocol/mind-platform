# mind-platform

Mind Platform — Frontend, Dashboard, L3 Ecosystem.

## Development

```bash
npm install
npm run dev
```

## Structure

```
/app
├── /docs — Generated from graph
├── /registry — Public registry browser (L4)
├── /templates — L3 ecosystem browser
└── /dashboard — Authenticated user area

/l3 — Ecosystem content
├── /templates — Shared procedures, vocabularies, mappings
├── /contributions — Community contribution flow
└── /federation — Publish/pull between orgs
```

## L3 Ecosystem

L3 is the shared layer where orgs contribute and pull templates.
The platform manages this content and provides the UI for browsing.

## License

MIT
