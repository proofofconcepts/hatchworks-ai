---
name: create-new-component-frontend
description: 'Create a new React frontend component and its companion Zustand store in this repository. Use when asked to create a component, add a UI feature, or implement a new interactive form or section. Enforces the no-useState, store-first conventions established in this project.'
argument-hint: 'component name and purpose, for example: DeleteItemButton that removes an item from the checkout list'
user-invocable: true
---

# Create Frontend Component

Create a new React component and, if needed, a companion Zustand store, following this repository's frontend conventions.

## When to Use

- The user asks to create a new React component.
- A new UI feature or interactive section needs implementing.
- A form, button group, or data-display section needs adding to the frontend.

## Repository Conventions

### No useState

Components in this project do not use React's `useState`. All mutable state lives in a Zustand store. This keeps components as pure, predictable, presentation-only layers.

### One store per component concern

Each feature area that requires state gets its own store file. Do not add unrelated state to an existing store. Assess whether an existing store already covers the new component's concern before creating a new one.

Good reasons to **create a new store**:
- The component manages its own form draft state (e.g. `checkout-form.store.ts` for a form component).
- The component has async or loading state independent from existing stores.

Good reasons to **reuse an existing store**:
- The component is a read-only view of data already in an existing store.
- The component only needs `token` or `email` from `auth.store.ts`.

### Store-first business logic

All validation rules, constraints, and async API calls live in the store, not the component. The component calls a single store action on submit and displays store-derived state.

### Cross-store communication

When a store needs to trigger a side-effect in another store, use `useOtherStore.getState().action()` inside the acting store. Never import one store into a component just to call a cross-cutting action.

### File locations

This project uses a four-layer module structure. Match the component to the correct location:

| Case | Component path | Store path |
|------|---------------|------------|
| Feature-scoped component (auth, checkout, …) | `src/modules/{module}/presentation/{ComponentName}.tsx` | `src/shared/store/{feature-name}.store.ts` |
| Shared / cross-module component | `src/shared/components/{ComponentName}.tsx` | `src/shared/store/{feature-name}.store.ts` |

Domain types for a module live in `src/modules/{module}/domain/{module}.types.ts`.  
Shared types that span modules live in `src/shared/types/`.

The auth store at `src/shared/store/auth.store.ts` is the single source of truth for the JWT token — never duplicate it.

### Styling

Use Tailwind CSS utility classes only. No BEM, no inline `style` attributes, no CSS modules.

---

## Procedure

### Step 1 — Assess state needs

Determine whether the component needs its own store:
- Does it hold mutable input state (form fields, toggles, selections)?
- Does it trigger async operations?

If yes to either → create a new store.  
If no → the component can be a stateless functional component that reads from an existing store or receives props.

### Step 2 — Determine the correct module or shared location

Ask the user which feature module the component belongs to (auth, checkout, …), or whether it is a shared component. Use the file location table above to set the paths before generating anything.

### Step 3 — Check for existing types

Look in `src/modules/{module}/domain/{module}.types.ts` (or `src/shared/types/`) for type definitions that can be reused. Add only what is missing. Do not create a new types file unless no suitable one exists.

### Step 4 — Create the store (if needed)

Use the template in [store-template.ts](./assets/store-template.ts).

- Name it `use{FeatureName}Store` in `src/shared/store/{feature-name}.store.ts`.
- Export domain constants (field limits, thresholds) from the store so the component can reference them in HTML attributes without duplicating values.
- Implement all validation logic inside the store's submit action.
- Return `boolean` from async submit actions so the component can react to success or failure without coupling to implementation details.
- Call `use{Other}Store.getState().method()` for cross-store side-effects — never inside the component.

### Step 5 — Create the component

Use the template in [component-template.tsx](./assets/component-template.tsx).

- Place it at the correct path per the file location table above.
- Import state and actions from the companion store.
- Import `useAuthStore` only when the component needs the JWT token.
- Import exported constants from the store for HTML attributes (e.g. `maxLength`).
- **Do not use `useState`, `useReducer`, or `useRef` for form field values.**
- Keep `handleSubmit` a thin wrapper: `event.preventDefault()` then the store action.
- Display `formError` from the store inline — do not derive or compute error messages in the component.

### Step 6 — Mount the component

Identify the parent page or component where the new component should appear. Add the import and the JSX element at the correct location.

### Step 7 — Verify

Run the build to confirm no TypeScript errors:

```bash
cd frontend && npm run build
```

Fix any type errors before reporting the task done.

---

## Output Expectations

- Create exactly the files needed (store + component + any type additions).
- Do not add extra abstractions, helpers, or HOCs unless explicitly requested.
- The component must compile cleanly with no `useState` imports.
- Layer rules must be respected: the component imports only from its own module's domain, the shared store, and the shared HTTP client — never directly from infrastructure or application layers of other modules.
