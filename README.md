# Azure Playwright Testing

End-to-end tests for a sample web app using Playwright. This repo supports three run modes:
- Local: spins up the included Express server and runs tests on your machine
- Azure Web App URL: points tests at a deployed app via BASE_URL
- Azure Playwright Service (Workspace): runs browsers in Azure with your tests published as runs

## Prerequisites
- Node.js 18+ (Node 22+ recommended)
- npm (bundled with Node)
- Git
- Optional for Workspace runs:
  - Azure CLI logged in to a subscription with access: `az login`
  - Network access to your chosen Playwright Service region (eastus by default)

## Install
```cmd
git clone https://github.com/jvargh/azure-playwright-testing.git
cd azure-playwright-testing
npm install
npx playwright install
```

## Project scripts
- Local: `npm run test:local`
- Azure (BASE_URL): `npm run test:azure`
- Azure Workspace (Service): `npm run test:workspace`
- Azure Workspace (more workers): `npm run test:workspace:scale`

Key configs
- `playwright.local.config.ts` – starts `node ./server.js` and tests `http://localhost:3000`
- `playwright.config.ts` – shared base; uses `process.env.BASE_URL` if set
- `playwright.service.config.ts` – Azure Playwright Service; uses `process.env.PLAYWRIGHT_SERVICE_URL`

## How to run

### 1) Local (auto web server)
This starts the bundled server and runs tests against http://localhost:3000.
```cmd
npm run test:local
```
Optional: start the server yourself, then run tests:
```cmd
npm run start:src
npx playwright test -c playwright.local.config.ts
```

### 2) Against a deployed URL (BASE_URL)
The script sets BASE_URL for you. Update the URL in `package.json` if needed.
```cmd
npm run test:azure
```
Alternatively, ad‑hoc:
```cmd
set BASE_URL=https://yourapp.azurewebsites.net
npx playwright test -c playwright.config.ts --reporter=line
```

### 3) Azure Playwright Service (Workspace)
Ensure you’re logged into Azure first:
```cmd
az login
```
Local run (excerpt):
```text
Running 81 tests using 4 workers
[chromium] › tests\example.spec.ts:3:1 › site is reachable and uses configured baseURL
[firefox]  › tests\todomvc.smoke.spec.ts:3:5 › todomvc smoke: input visible, storage initialized, filter selected
…
✓ 81 passed (45s)
```

\u2713 81 passed (45s)
```

Workspace list (excerpt):
```text
[debug] Using PLAYWRIGHT_SERVICE_URL=https://eastus.api.playwright.microsoft.com
Running tests using Azure Playwright service.
Listing tests:
  tests/example.spec.ts: 3 tests
  tests/todomvc.smoke.spec.ts: 15 tests
  tests-examples/demo-todo-app.spec.ts: 9 tests

To open last HTML report run:
  npx playwright show-report

$  npx playwright show-report
  Serving HTML report at http://localhost:9323. Press Ctrl+C to quit.
```

## Troubleshooting
- PLAYWRIGHT_SERVICE_URL error: verify the region endpoint, no quotes, and that you ran `az login`.
- Node ESM warning for server.js: add `"type": "module"` to `package.json` to silence the warning.
- Missing browsers: run `npx playwright install`.

## Repo structure (abridged)
```
server.js
playwright.config.ts
playwright.local.config.ts
playwright.service.config.ts
tests/
tests-examples/
```
