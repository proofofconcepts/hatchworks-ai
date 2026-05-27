# ADR-008: GitHub Actions at Repo Root with Monorepo Path Filters

## Status

Accepted

## Context

The repository contains both a `backend/` and a `frontend/` subtree. The original backend workflows were placed inside `backend/.github/workflows/`, which GitHub does not read — Actions only processes workflows in the repository root's `.github/workflows/`. Both components need independent CI and deploy pipelines that trigger only when their own files change, avoiding unnecessary rebuilds.

## Decision

Place all workflows in the repository root `.github/workflows/` and add `paths` filters so each workflow triggers only on changes to its own subtree (`backend/**` or `frontend/**`). The four workflows are: `backend-ci.yml`, `backend-deploy.yml`, `frontend-ci.yml`, and `frontend-deploy.yml`. Deploy workflows use the Render webhook API, each referencing its own `RENDER_SERVICE_ID` secret (`RENDER_SERVICE_ID` for the backend, `RENDER_FRONTEND_SERVICE_ID` for the frontend).

## Consequences

- A commit touching only `frontend/` triggers `frontend-ci.yml` and `frontend-deploy.yml` but not the backend workflows, saving CI minutes.
- Both pipelines are visible and comparable in the same `.github/workflows/` directory, making the monorepo CI easy to audit.
- The existing `backend/.github/workflows/` files are superseded and can be deleted; they are inert since GitHub ignores nested `.github/` directories.
- Adding a third component (e.g. a shared library) follows the same pattern: add a new pair of `*-ci.yml` / `*-deploy.yml` with the appropriate `paths` filter.
