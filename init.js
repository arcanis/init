const {execFileSync} = require(`child_process`);
const {writeFileSync} = require(`fs`);

execFileSync(`yarn`, [`add`, `-D`, `typescript`, `eslint`, `@yarnpkg/eslint-config`]);
execFileSync(`yarn`, [`dlx`, `@yarnpkg/sdks`, `vscode`]);

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
]);

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
