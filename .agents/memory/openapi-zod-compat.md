---
name: OpenAPI to Zod compatibility
description: Notes on the workspace's Orval and Zod compatibility constraints.
---

The generated validator package currently resolves Zod 3, while Orval may emit Zod 4-only helpers for some OpenAPI formats and integer schemas.

**Why:** Code generation succeeds but the required library typecheck fails when generated code calls unavailable helpers such as `zod.email()` or `zod.int()`.

**How to apply:** Prefer plain string constraints for email fields and numeric quantity schemas in the OpenAPI contract unless the workspace Zod generation/runtime is upgraded together.