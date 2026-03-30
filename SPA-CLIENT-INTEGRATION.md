# Content Acquisition Crawler — SPA Client Integration Guide

> **Package**: `content-acquisition-crawler`  
> **Version**: `0.1.2`  
> **Bundles**: `ca-entry.js` (Content Acquisition), `inventory-entry.js` (Inventory)  
> **Framework**: React 19 + single-spa-react  
> **Output**: ESM modules with `{ bootstrap, mount, unmount, metadata }` exports

---

## 1. Bundle Exports

Each entry file exports the standard single-spa lifecycle plus a `metadata` object:

```typescript
export { bootstrap, mount, unmount } from 'single-spa-react';

export const metadata: {
  name: string; // "content-acquisition-crawler"
  version: string; // "0.1.2"
  buildTime: string; // ISO 8601 build timestamp
};
```

### Reading version from the host

```typescript
const caModule = await import(
  /* webpackIgnore: true */ 'https://cdn.example.com/content-acquisition/ca-entry.js'
);
console.log(caModule.metadata);
// → { name: "content-acquisition-crawler", version: "0.1.2", buildTime: "2026-03-30T..." }
```

---

## 2. Required Props (Host → MFE)

Props are passed via single-spa parcel props. The MFE reads them through a `useSearchParams()` shim — **the host just needs to pass flat key-value props**.

### Content Acquisition (`ca-entry.js`)

| Prop            | Type     | Required | Used By                                      |
| --------------- | -------- | -------- | -------------------------------------------- |
| `project_id`    | `string` | **Yes**  | `PdfRegisterButton`, `PdfConfirmationButton` |
| `project_code`  | `string` | **Yes**  | `PdfRegisterButton`, `PdfConfirmationButton` |
| `workflow_id`   | `string` | **Yes**  | `PdfRegisterButton`, `PdfConfirmationButton` |
| `workflow_code` | `string` | **Yes**  | `PdfRegisterButton`, `PdfConfirmationButton` |
| `task_id`       | `string` | **Yes**  | `PdfRegisterButton`, `PdfConfirmationButton` |
| `task_uid`      | `string` | **Yes**  | `PdfRegisterButton`, `PdfConfirmationButton` |
| `user_id`       | `string` | **Yes**  | `PdfRegisterButton`, `PdfConfirmationButton` |

### Inventory (`inventory-entry.js`)

| Prop         | Type     | Required | Used By             |
| ------------ | -------- | -------- | ------------------- |
| `project_id` | `string` | **Yes**  | `ClientDataFetcher` |
| `job_id`     | `string` | **Yes**  | `ClientDataFetcher` |
| `file_id`    | `string` | **Yes**  | `ClientDataFetcher` |
| `task_id`    | `string` | **Yes**  | `ClientDataFetcher` |

---

## 3. Host-Side Registration

### Registry entry

```typescript
// apps/core/lib/single-spa/registry.ts
export const registry: MicroFrontendRegistry = {
  apps: [
    {
      name: '@uw/content-acquisition',
      loadApp: () =>
        import(
          /* webpackIgnore: true */
          'https://cdn.example.com/content-acquisition/v0.1.2/ca-entry.js'
        ),
      activeWhen: '/ext/content-acquisition',
    },
    {
      name: '@uw/inventory',
      loadApp: () =>
        import(
          /* webpackIgnore: true */
          'https://cdn.example.com/content-acquisition/v0.1.2/inventory-entry.js'
        ),
      activeWhen: '/ext/inventory',
    },
  ],
  widgets: [],
};
```

### Mounting as a parcel (User Modules integration)

```tsx
// Content Acquisition — inline panel
<ExternalTaskApp
  loadApp={() => import(
    /* webpackIgnore: true */
    'https://cdn.example.com/content-acquisition/v0.1.2/ca-entry.js'
  )}
  appName="@uw/content-acquisition"
  taskProps={{
    project_id: taskDetails.project_id,
    project_code: taskDetails.project_code,
    workflow_id: taskDetails.workflow_id,
    workflow_code: taskDetails.workflow_code,
    task_id: taskDetails.task_id,
    task_uid: taskDetails.task_uid,
    user_id: currentUser.id,
  }}
  mode="inline"
  isOpen={externalAppOpen}
  onTaskComplete={handleExternalTaskComplete}
/>

// Inventory — inline panel
<ExternalTaskApp
  loadApp={() => import(
    /* webpackIgnore: true */
    'https://cdn.example.com/content-acquisition/v0.1.2/inventory-entry.js'
  )}
  appName="@uw/inventory"
  taskProps={{
    project_id: taskDetails.project_id,
    job_id: taskDetails.job_id,
    file_id: fileRow.file_id,
    task_id: taskDetails.task_id,
  }}
  mode="inline"
  isOpen={externalAppOpen}
  onTaskComplete={handleExternalTaskComplete}
/>
```

---

## 4. Events (MFE → Host)

The MFE dispatches `CustomEvent`s on `window`. The host should listen for these.

### `uw:task-complete`

```typescript
// Dispatched when the user finishes processing
window.addEventListener('uw:task-complete', (e: CustomEvent) => {
  const { status, file_id, task_id, message, reason } = e.detail;
  // status: 'completed' | 'on-hold' | 'pending'
});
```

### `uw:task-progress` (optional)

```typescript
window.addEventListener('uw:task-progress', (e: CustomEvent) => {
  const { file_id, progress } = e.detail; // progress: 0-100
});
```

### `uw:task-error` (optional)

```typescript
window.addEventListener('uw:task-error', (e: CustomEvent) => {
  const { file_id, message } = e.detail;
});
```

---

## 5. API Proxy Requirement

Both MFEs make API calls through relative `/api/*` paths. The host's Next.js proxy must forward these routes:

| MFE Route                      | Backend Target                            |
| ------------------------------ | ----------------------------------------- |
| `/api/register-job-batch-file` | Backend registration endpoint             |
| `/api/pdfs`                    | Backend PDF registration endpoint         |
| `/api/inventory`               | Backend inventory / get-task-ongoing-file |
| `/api/pdf-proxy?url=...`       | Proxies PDF download URLs (S3/CDN)        |

Auth is handled via the host's httpOnly session cookie — no token management needed in the MFE.

---

## 6. Shared Dependencies (Externalized)

These are **not** bundled — the host must provide them via import map:

| Package            | Expected Version |
| ------------------ | ---------------- |
| `react`            | ^19.0.0          |
| `react-dom`        | ^19.0.0          |
| `react-dom/client` | ^19.0.0          |

### Host import map (already in place)

```html
<script type="importmap">
  {
    "imports": {
      "react": "/shared/react.production.min.js",
      "react-dom": "/shared/react-dom.production.min.js",
      "react-dom/client": "/shared/react-dom-client.production.min.js"
    }
  }
</script>
```

---

## 7. CSS Scoping

All styles are scoped under `.uw-mfe-ca-root` and `.uw-mfe-inventory-root` CSS class wrappers. The MFE does **not** inject global `:root` styles — theme variables are confined within the wrapper divs. No CSS pollution to the host.

---

## 8. Dev Workflow (Local Proxy)

1. In the MFE repo, run the dev server:

   ```bash
   npm run dev:spa   # starts Vite on http://localhost:8081
   ```

2. In the host's `.env.local`:

   ```bash
   MICRO_APP_CONTENT_ACQUISITION_URL=http://localhost:8081
   ```

3. Update registry to use the proxied path:

   ```typescript
   loadApp: () => import(
     /* webpackIgnore: true */
     '/micro-apps/content-acquisition/ca-entry.js'
   ),
   ```

4. The host proxies `/micro-apps/content-acquisition/*` → `http://localhost:8081/*`

---

## 9. Build & Deploy

```bash
# Install dependencies
npm install

# Build the SPA bundles
npm run build:spa

# Output:
#   dist-spa/ca-entry.js           (Content Acquisition)
#   dist-spa/inventory-entry.js    (Inventory)
#   dist-spa/assets/               (CSS)
#   dist-spa/chunks/               (shared code)

# Upload dist-spa/ contents to CDN under versioned path:
#   /content-acquisition/v0.1.2/ca-entry.js
#   /content-acquisition/v0.1.2/inventory-entry.js
#   /content-acquisition/v0.1.2/chunks/...
#   /content-acquisition/v0.1.2/assets/...
```

### CDN Requirements

- CORS: `Access-Control-Allow-Origin: *` (or host origin)
- Content-Type: `application/javascript` for `.js` files
- Versioned paths for rollback capability

---

## 10. Param Flow Diagram

```
  HOST (apps/core)                          MFE (content-acquisition-crawler)
  ────────────────                          ────────────────────────────────

  User clicks "Process"
         │
         ▼
  Build taskProps from
  task config + file row:
  {
    project_id: "42",
    project_code: "PROJ-A",
    workflow_id: "7",
    workflow_code: "WF-01",
    task_id: "15",
    task_uid: "ca-task-001",
    user_id: "99",
  }
         │
         │  single-spa mount(props)
         ▼
  ┌─────────────────────┐
  │ ExternalTaskApp      │
  │ passes props as      │──── props ──────▶ ┌─────────────────────────┐
  │ parcel customProps   │                   │ SpaPropsProvider        │
  └─────────────────────┘                   │ stores props in Context │
                                             └───────────┬─────────────┘
                                                         │
                                                         ▼
                                             ┌─────────────────────────┐
                                             │ useSearchParams() shim  │
                                             │ reads from Context:     │
                                             │  .get("project_id")→"42"│
                                             │  .get("task_uid")→"..."│
                                             └───────────┬─────────────┘
                                                         │
                                                         ▼
                                             ┌─────────────────────────┐
                                             │ Existing components     │
                                             │ work unchanged ✓        │
                                             └─────────────────────────┘
                                                         │
                                              MFE dispatches CustomEvent
                                                         │
         ◀──── uw:task-complete ─────────────────────────┘
         │
  Host unmounts parcel,
  shows summary, refreshes table
```
