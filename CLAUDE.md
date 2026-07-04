# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Playwright end-to-end test suite (TypeScript) for the GreenKart demo app at
`https://rahulshettyacademy.com/seleniumPractise/#/`. The suite has no application code of its own —
it only exercises the live public demo site over the network, so tests depend on that site being
reachable and its markup/behavior remaining stable.

## Commands

- Install dependencies: `npm install`
- Install Playwright browsers (first run only): `npx playwright install`
- Run the full suite: `npm test` (equivalent to `npx playwright test`)
- Run a single test file: `npx playwright test tests/greenkart.spec.ts`
- Run a single test by name: `npx playwright test -g "should search for a product and add it to the cart"`
- Run with the browser visible: `npx playwright test --headed`
- Debug a test step-by-step: `npx playwright test --debug`
- View the HTML report after a run: `npx playwright show-report`

There is no lint, typecheck, or build script configured in `package.json`.

## Architecture

- `playwright.config.ts` — single project (`chromium`/Desktop Chrome). `fullyParallel: true`;
  CI runs (`process.env.CI`) get 1 worker, 2 retries, and `forbidOnly`. Reporter is `html`.
  Tracing is captured on first retry, screenshots on every test, video on first retry.
- `tests/greenkart.spec.ts` — all specs currently live in one file under a single
  `test.describe('GreenKart E2E Tests', ...)` block. There are no page objects, fixtures, or
  helper modules yet; each test drives the page directly via locators (CSS selectors and
  `getByRole`).
- Tests currently cover: searching for a product and completing checkout end-to-end (search →
  add to cart → cart preview → checkout → place order → confirmation), and searching with
  multiple results to verify cart count and checkout line items.

## Notes for writing new tests

- Follow the existing pattern in `tests/greenkart.spec.ts`: locate elements by their real CSS
  classes (e.g. `.product`, `input.search-keyword`, `a.cart-icon`) or accessible role/name
  (`getByRole('button', { name: '...' })`), and scope repeated lookups via `.filter({ hasText })`
  or `.nth()` rather than fragile indexed selectors.
- Since these tests hit a real external site, prefer `expect(...).toBeVisible()` /
  auto-retrying assertions over manual waits or `page.waitForTimeout`.
