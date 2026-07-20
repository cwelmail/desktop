# aeri desktop

Native macOS desktop client for [aeri](https://aeri.rest) — anonymous, private email.

Built with Electron + Next.js + React 19 + Tailwind CSS.

## Install

Download the latest `.dmg` from [Releases](https://github.com/cwelmail/desktop/releases) and drag **aeri** into Applications.

## Development

```bash
npm install
npm run dev
```

This starts the Next.js dev server on `localhost:3000` and launches Electron pointing at it.

## Build

```bash
npm run build
```

Produces a signed DMG in `dist-electron/`.

## Tech stack

- **Electron 35** — desktop shell, tray, system integration
- **Next.js 16** — static export served via custom `app://` protocol
- **React 19** + **Motion** — UI and animations
- **Tailwind CSS 4** — styling with CSS variable theming

## Project structure

```
electron/          Electron main process + preload
app/               Next.js pages (onboarding, sign-in, inbox)
components/        UI components (inbox, compose, modals)
lib/               API client, auth, types, utilities
public/            Static assets (icon)
```

## License

Private — [cwelmail](https://github.com/cwelmail)
