# React + Vite

## Learning data

Published questions and templates come from `src/data/`. Personal notes, progress,
custom questions, and deletions are stored separately in the browser. Legacy data
is migrated with retained backups. Use **Export Backup** / **Import Backup** in
the app to save or restore personal data.

Study activity is recorded only in production builds on non-local hosts, while a
lesson or practice page is visible and recently active. Open **Current Streak**
on the progress page to see a monthly calendar and daily study time. Activity is
stored in that site's browser storage, so it is specific to the browser and device;
it is included in personal backups. Local development and localhost previews do
not accumulate study time or streak days.

See [DATA_FLOW.md](DATA_FLOW.md) for identity rules, migration behavior, recovery,
and verification. Run `npm test`, `npm run lint`, and `npm run build` for checks.

## Content foundation and pilot

The OS tab now includes one **Processes, threads, and the execution lifecycle**
lesson and three Markdown interview questions. The other 187 questions remain in
legacy JSON. Run `npm run dev` to review the pilot, or open
`/#/lesson/lesson-os-processes-threads`.

See [CONTENT_AUTHORING.md](CONTENT_AUTHORING.md) for schemas, authoring examples,
links/assets, build-time validation, and compatibility rules. `npm run content:check`
validates without generating files; normal development and production builds
compile content automatically. Deployment remains a static Vite build to `dist/`.
See [BROWSER_VERIFICATION.md](BROWSER_VERIFICATION.md) for the pilot browser checks.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
