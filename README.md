![Logo](https://github.com/user-attachments/assets/0ac36345-03c4-4a5b-beb6-83ffff3af7c4)

<h1 align="center">Hatsuboshi App - Types Package</h1>

<div align="center">
  <a href="https://www.npmjs.com/package/@hatsuboshi/types"><img src="https://img.shields.io/npm/v/%40hatsuboshi%2Ftypes?style=for-the-badge&logo=npm&label=%40hatsuboshi%2Ftypes&color=red"></a>
  <img src="https://img.shields.io/github/check-runs/hatsuboshi-app/types/main?nameFilter=publish&style=for-the-badge&logo=github&label=Checks">
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/Vitest-%23252529.svg?style=for-the-badge&logo=vitest&logoColor=FCC72B">
</div>
<br>

**[Hatsuboshi App Types Package](https://docs.hatsuboshi.app/types/latest/) is a TypeScript package that defines data structures to represent in-game data / assets from _Gakuen IDOLM@STER_.** It provides shared, canonical data object definitions across the Hatsuboshi App project, and is available for public use via [npm](https://www.npmjs.com/package/@hatsuboshi/types).

- Strongly defined data representations for different use cases (e.g. class instances, JSON objects, document-store-compatible JSON objects, etc.)
- Easy conversion between data representations via class constructors and methods
- Utility types for sorting, filtering & pagination of data
- Convenient methods on model classes for manipulating and deriving data
- Fully documented with [JSDoc](https://jsdoc.app/) & generated as static HTML pages using [TypeDoc](https://typedoc.org/), hosted on the [Hatsuboshi App Docs](https://docs.hatsuboshi.app/)

## Install from npm

```bash
npm i @hatsuboshi/types
```

For a list of all available types exported by this package, checkout the [Types Reference](https://docs.hatsuboshi.app/types/latest/).

## Example usage

We demonstrate here some features of the package using the [PIdol](https://docs.hatsuboshi.app/types/latest/classes/PIdol/) class as an example, but other model classes provide similar functionality.

```ts
// Default instance
new PIdol()

// From partial data
new PIdol({ name: { ja: "Hello" } })

// From JSON data returned by an API
const res = await fetch(...)
const data = new PIdol(await res.json())

// Changing the Potential Level of a PIdol instance
const pIdol = new PIdol()
pIdol.setPotentialLevel(3)  // updates all relevant data fields accordingly!
console.log(pIdol.initialParameter === pIdol.currentParameter)  // false
```

## Technical Details

This package is written in TypeScript with no runtime dependencies. It uses [tsup](https://tsup.egoist.dev/) to build the package, [TypeDoc](https://typedoc.org/) to generate static HTML documentation pages, and [Vitest](https://vitest.dev/) to run unit tests.

### Building the package

To build the package for publishing to npm or local use (to the `./dist` folder, by default):

```bash
$ npm run build
```

To generate static HTML documentation pages (to the `./docs` folder, by default):

```bash
$ npm run docs
```

To run unit tests:

```bash
$ npm run test
```

## Deployment

This package uses [GitHub Actions](https://github.com/features/actions) to automatically run CI/CD pipelines for publishing. Versioning is handled by [semantic-release](https://github.com/semantic-release/semantic-release).

- The `main` branch automatically publishes the package to npm ([`@hatsuboshi/types`](https://www.npmjs.com/package/@hatsuboshi/types)) when the commits since the previous release warrant a new version according to the configured [semantic-release](https://github.com/semantic-release/semantic-release) rules.
  - If a new version is published, it also automatically pushes generated documentation artifacts to [docs repo](https://github.com/hatsuboshi-app/docs),
  - ...which then automatically deploys the up-to-date documentation to [`https://docs.hatsuboshi.app/types`](https://docs.hatsuboshi.app/types)

## Contributing

Feel free to [open an issue](https://github.com/hatsuboshi-app/types/issues/new) for any bugs, feature requests, or questions to do with this package.

When contributing, please use _feature branching_ when implementing new features, and submit a pull request titled using the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification, targeting the `main` branch.

Feel free to contact me, [@HuzzuDesu on Twitter](https://x.com/HuzzuDesu) or `@huzzudesu` on Discord for any other questions or inquiries.

**There is currently no Discord server for the purposes of development for this project.**

## Disclaimer

> [!WARNING]
> This package is a part of a fan-made project and **NOT** an officially endorsed app for Gakuen IDOLM@STER, nor is it associated with BNEI, QualiArts Inc., or any other official entities. All rights to the original game assets, content, and intellectual property belong to their respective copyright owners.
