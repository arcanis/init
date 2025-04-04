const {execFileSync} = require(`child_process`);
const {mkdirSync, readFileSync, writeFileSync} = require(`fs`);
const {parseArgs} = require(`util`);

const {values, positionals} = parseArgs({
  options: {
    vite: {
      type: `boolean`,
    },
  },
});

const devDeps = [`typescript`, `eslint`, `@yarnpkg/eslint-config`, `vitest`];

if (values.vite)
  devDeps.push(`tailwindcss`, `@tailwindcss/vite`, `vite`);

if (values.vite && values.react)
  devDeps.push(`react`, `react-dom`, `@types/react`, `@types/react-dom`, `@vitejs/plugin-react`);

execFileSync(`yarn`, [`add`, `-D`, ...devDeps], {stdio: `inherit`});
console.log(``);
execFileSync(`yarn`, [`dlx`, `@yarnpkg/sdks`, `vscode`], {stdio: `inherit`});

const pkgJson = readFileSync(`package.json`, `utf8`);

if (!pkgJson.includes(`"type":`))
  writeFileSync(`package.json`, pkgJson.replace(/("name":.*)/, `$1\n  "type": "module",`));

mkdirSync(`.cursor/rules`, {recursive: true});

writeFileSync(`.cursor/rules/package-manager.mdc`, [
  `---\n`,
  `description: Read this file when you need to use a package manager.\n`,
  `globs:\n`,
  `alwaysApply: false\n`,
  `---\n`,
  `Use Yarn. Never use npm or npx.\n`,
].join(``));

writeFileSync(`eslint.config.mjs`, [
  `import yarnConfig from '@yarnpkg/eslint-config';\n`,
  `\n`,
  `// eslint-disable-next-line arca/no-default-export\n`,
  `export default [\n`,
  `  {\n`,
  `    ignores: [\n`,
  `      \`.yarn\`,\n`,
  `    ],\n`,
  `  },\n`,
  `  ...yarnConfig,\n`,
  `];\n`,
].join(``));

writeFileSync(`tsconfig.json`, JSON.stringify({
  compilerOptions: {
    customConditions: [`node`],
    declaration: true,
    esModuleInterop: true,
    forceConsistentCasingInFileNames: true,
    jsx: `react-jsx`,
    lib: [`ES2022`, `DOM`],
    moduleResolution: `Bundler`,
    module: `ESNext`,
    noEmit: true,
    noImplicitAny: true,
    noImplicitOverride: true,
    noImplicitThis: true,
    noUncheckedIndexedAccess: true,
    strict: true,
    strictNullChecks: true,
    strictPropertyInitialization: true,
    target: `ES2022`,
    types: [`vitest/globals`],
  },
  include: [
    `./sources/**/*.tsx`,
    `./sources/**/*.ts`
  ]
}, null, 2) + `\n`);

if (values.vite) {
  mkdirSync(`sources`, {recursive: true});

  writeFileSync(`vite.config.ts`, [
    `import tailwindcss    from '@tailwindcss/vite';\n`,
    values.react ?
    `import react          from '@vitejs/plugin-react';\n` : ``,
    `import {defineConfig} from 'vite';\n`,
    `\n`,
    `export default defineConfig({\n`,
    `  plugins: [\n`,
    values.react ?
    `    react(),\n` : ``,
    `    tailwindcss(),\n`,
    `  ],\n`,
    `});\n`,
  ].join(``));

  writeFileSync(`index.html`, [
    `<!doctype html>\n`,
    `<html>\n`,
    `  <head>\n`,
    `    <meta charset="UTF-8"/>\n`,
    `    <link rel="stylesheet" href="./sources/index.css"/>\n`,
    `  </head>\n`,
    `  <body>\n`,
    `    <div id="root"></div>\n`,
    values.react ?
    `    <script type="module" src="./sources/index.tsx"></script>\n` : ``,
    !values.react ?
    `    <script type="module" src="./sources/index.ts"></script>\n` : ``,
    `  </body>\n`,
    `</html>\n`,
  ].join(``));

  writeFileSync(`sources/index.css`, [
    `@import "tailwindcss";\n`,
  ].join(``));

  if (values.react) {
    writeFileSync(`sources/index.tsx`, [
      `import './index.css';\n`,
      `\n`,
      `import {createRoot} from 'react-dom/client';\n`,
      `import {StrictMode} from 'react';\n`,
      `\n`,
      `import {App}        from './App.tsx';\n`,
      `\n`,
      `createRoot(document.getElementById('root')!).render(\n`,
      `  <StrictMode>\n`,
      `    <App/>\n`,
      `  </StrictMode>,\n`,
      `);\n`,
    ].join(``));

    writeFileSync(`sources/App.tsx`, [
      `export function App() {\n`,
      `  return (\n`,
      `    null\n`,
      `  );\n`,
      `}\n`,
    ].join(``));
  } else {
    writeFileSync(`sources/index.ts`, [
      `import './index.css';\n`,
      `\n`,
      `const root = document.getElementById('root')!;\n`,
    ].join(``));
  }
}
