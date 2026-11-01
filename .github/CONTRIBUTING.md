# Contributing

Hey! Thanks for wanting to help out with Web Check.

> [!IMPORTANT]
> We don't accept unsolicited AI contributions

## Getting started

You'll need [Node](https://nodejs.org/) 22.23.4+ or 24.16+, [yarn](https://yarnpkg.com/) and git. Chromium and `traceroute` are optional, since the checks that need them just skip without.

```bash
git clone git@github.com:Lissy93/web-check.git
cd web-check
yarn
yarn dev
```

This starts the API on port 3001 and the frontend on 4321. Env vars are all optional, see [`.env.sample`](https://github.com/Lissy93/web-check/blob/master/.env.sample).

## Adding a check

1. Write the API function in `api/<id>.js`, wrapped in the shared `middleware`. Return `{ skipped: 'reason' }` when there's nothing to show, rather than throwing
2. Build its results card in `src/client/components/Results/`
3. Register it in `src/client/jobs/registry.ts`
4. Add its docs in `src/data/checks/<id>.ts`, and list it in that folder's `index.ts`

Each check gets its own page at `/<id>`, so pick an id that isn't already a category or page.
If it sends the target to a third-party service, add it to `publicOnlyChecks` in `api/_common/check-skipper.js`.
If it needs an API key, skip cleanly when the key is missing (see `requireEnv`), and add it to `.env.sample`.

## Bugs and security issues

Raise bugs as an [issue](https://github.com/Lissy93/web-check/issues/new/choose), with steps to reproduce and how you're running Web Check.
Security issues shouldn't be public, see [SECURITY.md](SECURITY.md) for how to report them.

## Code of conduct

Be kind and constructive. We follow the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).
By contributing, you agree that your work is licensed under the project's [MIT license](https://github.com/Lissy93/web-check/blob/master/LICENSE).
