# Vendored data

`market-research.json` is a COPY of `docs/reports/market-research.json` from the
lytebuy monorepo (LB-Web-5) - the verified competitor fee data the homepage and
/who-we-are render.

## Why it is copied rather than imported

`lytebuy-web` is its own GitHub repo. Three files used to import it as
`../../../docs/reports/market-research.json`, which climbs OUT of the repo and
only resolves on a machine where lytebuy-web happens to sit inside the monorepo
folder. It built locally and could never build anywhere else - the Amplify build
failed with `UNRESOLVED_IMPORT` the first time it ran on a clean checkout.

## Keeping it in step

This is a snapshot. If the source report changes, re-copy it:

    cp ../../lytebuy/docs/reports/market-research.json src/lib/data/

`src/lib/fees.test.ts` asserts against the same file, so a stale or malformed copy
fails the test suite rather than shipping wrong numbers to the fee comparison.
