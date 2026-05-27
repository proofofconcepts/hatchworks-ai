---
name: create-new-module-backend
description: 'Scaffold a new NestJS feature module in the backend following the project layered architecture (domain / application / infrastructure / presentation). Use when asked to add a new module, feature, or resource to the backend.'
argument-hint: 'module name in kebab-case, for example: product, order, invoice'
user-invocable: true
---

# Create New Backend Module

Scaffold a complete NestJS feature module that follows the layered architecture already established in `backend/src/modules/checkout`. Every new module must replicate that exact structure.

## Naming Conventions

Given the argument `{module-name}` (kebab-case, e.g. `product`):

| Form | Example |
|------|---------|
| `{module-name}` | `product` |
| `{ModuleName}` | `Product` |
| `{moduleName}` | `product` |

Derive all three forms from the argument before generating any file.

---

## Directory Structure to Create

```
backend/src/modules/{module-name}/
├── {module-name}.module.ts
├── domain/
│   ├── {module-name}.domain.ts          ← domain interfaces / pure logic
│   └── repositories/
│       └── {module-name}.repository.interface.ts
├── application/
│   └── {module-name}.service.ts
├── infrastructure/
│   ├── {module-name}.mapper.ts
│   └── {module-name}.repository.ts
└── presentation/
    ├── {module-name}.controller.ts
    └── dto/
        ├── create-{module-name}.dto.ts
        └── {module-name}-response.dto.ts
```

Also create:
```
backend/test/unit/{module-name}.spec.ts   ← unit tests for domain logic
```

---

## Procedure

### Step 1 — Confirm the module name

If the argument is missing or ambiguous, ask for a kebab-case module name before generating anything. Do not guess.

### Step 2 — Ask what the module does

Ask the user for a one-sentence description of what this module manages (e.g. "manages product catalogue items"). Use that to write meaningful field names and comments in the generated files. If the user says to use placeholders, generate with `TODO` markers.

### Step 3 — Generate all files

Create each file below, **in this order**, adapting the templates in `assets/` to the module name and domain description provided. Replace every occurrence of the placeholder names with the correct forms.

Use the templates in:
- [module.template.ts](./assets/module.template.ts)
- [repository-interface.template.ts](./assets/repository-interface.template.ts)
- [service.template.ts](./assets/service.template.ts)
- [repository.template.ts](./assets/repository.template.ts)
- [mapper.template.ts](./assets/mapper.template.ts)
- [controller.template.ts](./assets/controller.template.ts)
- [create-dto.template.ts](./assets/create-dto.template.ts)
- [response-dto.template.ts](./assets/response-dto.template.ts)
- [spec.template.ts](./assets/spec.template.ts)

### Step 4 — Register the module in AppModule

Open `backend/src/app.module.ts` and add the new module to the `imports` array and the corresponding import statement. Follow the existing pattern exactly.

### Step 5 — Validate

- Confirm all files are created and paths are correct.
- Confirm `AppModule` imports the new module.
- Run `npm run build` from the `backend/` directory to verify the TypeScript compiles without errors. Fix any errors before reporting done.

---

## Rules

- **Never skip a layer.** Every module must have all four layers even if some are thin.
- **Always use a Symbol DI token** for the repository (`{MODULE_NAME}_REPOSITORY`).
- **Never inject PrismaService directly** into the service — always go through the repository interface.
- **DTOs must use `class-validator` decorators** for all input fields and `@ApiProperty` for all fields.
- **The controller must use `@ApiBearerAuth('JWT')`** — all routes are authenticated by the global guard.
- **Domain logic must be a pure function or a plain class with no NestJS decorators** — no `@Injectable` in the domain layer.
- **The mapper must live in infrastructure**, not in the domain or application layer.
- **Unit tests** must be placed in `test/unit/{module-name}.spec.ts` and must test only domain logic (pure functions or domain classes), not services or controllers.
