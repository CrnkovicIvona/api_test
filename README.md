# API Test Automation with Playwright & TypeScript

Practice project demonstrating API test automation using [Playwright](https://playwright.dev/) and TypeScript, tested against the [JSONPlaceholder](https://jsonplaceholder.typicode.com/) mock REST API.

## What this covers

- Writing API tests with Playwright's `request` fixture (no browser required)
- GET, POST, PUT, PATCH, DELETE requests and response validation
- Continuous Integration with GitHub Actions — tests run automatically on every push and pull request
- Automated dependency updates with Dependabot (npm packages and GitHub Actions)

## Tech stack

- **TypeScript**
- **Playwright Test** (`@playwright/test`)
- **GitHub Actions** (CI)
- **Dependabot** (dependency management)


## CI

Tests run automatically via GitHub Actions on every push and pull request to `main`. Workflow runs can also be triggered manually from the **Actions** tab.

## How to run the project locally

### 1. Install Node.js

You need Node.js installed, preferably the LTS version. You can check the installation with:

​```
node --version
npm --version
​```

### 2. Clone the project

​```
git clone https://github.com/CrnkovicIvona/api_test.git
cd api_test
​```

### 3. Install dependencies

To install according to the versions locked in `package-lock.json`, use:

​```
npm ci
​```

`npm ci` is well-suited for CI environments and a clean local install. If the project doesn't have a `package-lock.json`, you can use:

​```
npm install
​```

### 4. Install Playwright browsers

If Playwright is being used for the first time on your machine, install the browsers with:

​```
npx playwright install
​```

A browser isn't required for these API tests, but the command is useful since the project is set up with a Playwright configuration and can be extended with UI tests.

### 5. Run the tests

​```
npx playwright test
​```

To view the HTML report after a run:

​```
npx playwright show-report
​```

## Postman collection

The API endpoints were also explored and validated manually using a Postman collection before automating them with Playwright — organized into `Todos` and `Users` folders, covering GET, POST, PUT, PATCH, and DELETE requests.


# How this project was built (from scratch)
 
These are the steps taken to set up this project from an empty repository:
 
### 1. Initialize a Node.js project
 
```bash
npm init -y
```
 
This creates `package.json`.
 
### 2. Install Playwright with TypeScript
 
```bash
npm init playwright@latest
```
 
During setup, the following options were chosen:
- Language: **TypeScript**
- Test folder: `tests`
- Add a GitHub Actions workflow: **Yes** (generates `.github/workflows/playwright.yml`)
- Install Playwright browsers: Yes
### 3. Clean up the generated example files
 
The installer creates example tests and a `tests-examples` folder, which were removed and replaced with a dedicated folder for API tests:
 
```bash
rm -rf tests-examples
rm tests/example.spec.ts
mkdir tests/api
```
 
### 4. Simplify `playwright.config.ts` for API testing
 
Since these are pure API tests (no browser UI involved), the config was simplified to remove the multi-browser `projects` section (chromium/firefox/webkit) and set a `baseURL` pointing to the JSONPlaceholder API:
 
```typescript
import { defineConfig } from '@playwright/test';
 
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://jsonplaceholder.typicode.com',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
  },
});
```
 
### 5. Write the API tests
 
Tests were added using Playwright's `request` fixture, which sends HTTP requests directly without launching a browser (`tests/api/todos.spec.ts`).
 
### 6. Simplify the CI workflow
 
The auto-generated `.github/workflows/playwright.yml` originally installed browsers with `npx playwright install --with-deps`. Since browsers aren't needed for API tests, that step was removed to keep CI faster:
 
```yaml
name: Playwright API Tests
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:
 
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
 
      - uses: actions/setup-node@v7
        with:
          node-version: lts/*
 
      - name: Install dependencies
        run: npm ci
 
      - name: Run Playwright API tests
        run: npx playwright test
 
      - uses: actions/upload-artifact@v7
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```
 
`workflow_dispatch` was added so the workflow can also be triggered manually from the **Actions** tab, not just on push/PR.
 
### 7. Add Dependabot configuration
 
`.github/dependabot.yml` was added at the root of `.github/` (not inside `workflows/`) to keep npm packages and GitHub Actions versions up to date automatically:
 
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
 
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```
 
### 8. Commit and push
 
```bash
git add .
git commit -m "feat: initial setup with Playwright API tests, CI workflow and Dependabot"
git push origin main
```
 
After the push, GitHub Actions ran the tests automatically, and Dependabot opened its first pull requests within minutes, bumping outdated GitHub Actions versions (`checkout`, `setup-node`, `upload-artifact`) from v4 to v7.
