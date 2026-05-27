# Simple Checkout Service — Code Challenge

## Challenge Overview

Build a lightweight backend checkout service for an early-stage commerce workflow.
This is an MVP-level implementation: fast to build, easy to understand, and designed
to validate initial use cases without blocking future evolution.

---

## Endpoint

### POST /checkout

**Request body:**
```json
{
  "items": [
    {
      "name": "string",
      "unit_price": number,
      "quantity": number
    }
  ]
}
```

**Response body:**
```json
{
  "subtotal": number,
  "taxes": number,
  "discount": number,
  "total": number
}
```

---

## Business Rules

| Field      | Formula                                          |
|------------|--------------------------------------------------|
| subtotal   | sum of (unit_price × quantity) for all items     |
| taxes      | 13% of subtotal                                  |
| discount   | 10% of subtotal if subtotal > 100, otherwise 0   |
| total      | subtotal + taxes - discount                      |

---

## Non-Functional Requirements

- **Clarity and correctness** over completeness
- **Easy to extend** as business rules evolve
- **Persistence layer** required (store checkout records)
- **Authentication** required (protect the endpoint)
- **Distributed architecture** required (containerized / deployable at scale)
- UI is not required but adds a bonus

---

## Project Goals

- Demonstrate sound API design and calculation logic
- Show awareness of extensibility (e.g. tax rates, discount tiers may change)
- Use a persistence layer to record each checkout transaction
- Secure the endpoint with authentication (JWT or API Key)
- Package the solution so it runs reliably across environments (Docker / Docker Compose)
