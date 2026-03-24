# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-driven code review system that generates a dual-entry (Class + Concept) knowledge base, output as a VitePress static site with Mermaid diagrams, full-text search, and automatic GitHub source links.

## Commands

```bash
# VitePress development (run from docs/)
cd docs && npm install        # Install dependencies
cd docs && npm run dev        # Local dev server with hot reload
cd docs && npm run build      # Build static site to docs/.vitepress/dist/
cd docs && npm run preview    # Preview production build

# Detect source code changes since last review
bash review-system/scripts/check-updates.sh
```

## Review Workflow

All review operations are AI-prompt-driven via markdown files in `review-system/`:

1. **Bootstrap** (one-time): Execute `review-system/bootstrap.md` — scans source code, generates seed data, creates directory structure, initializes `docs/knowledge/_meta/coverage.md`
2. **Review loop**: Execute `review-system/run.md` — processes one item per execution (class or concept), guided by coverage.md status (`pending` → `reviewed`)
3. **Scan**: Execute `review-system/scan.md` — finds uncovered classes not yet tracked

## Architecture

### Central Configuration
`review-system/config/project.yaml` is the single source of truth for all settings: project metadata, paths, glob patterns, git/CI config, VitePress site settings, and review parameters. Both AI prompts and `docs/.vitepress/config.ts` read from it.

### Two-Layer Knowledge Model
- **`docs/knowledge/classes/`** — One file per class: responsibility, architecture diagram, dependencies, lifecycle, key methods, sequence diagrams
- **`docs/knowledge/concepts/`** — Cross-class mechanism analysis: complete flow, sequence/flowchart/state diagrams, modification guide
- Bidirectional linking between class and concept documents

### Prompt Templates as Executable Specs
- `review-system/prompts/class-review.md` — Template for single-class analysis
- `review-system/prompts/concept-review.md` — Template for cross-class mechanism analysis
- `review-system/prompts/site-build.md` — Template for VitePress site setup
- `review-system/schema/` — Defines required sections and format for class/concept docs (with examples)

### Coverage Tracking
`docs/knowledge/_meta/coverage.md` tracks review status per item. Statuses: `pending`, `reviewed`, `needs-update`, `skip`. The `run.md` entry point reads this to determine the next review target.

### VitePress Site (`docs/`)
- `docs/.vitepress/config.ts` dynamically parses `project.yaml` via regex to configure navigation, sidebars, and base path
- Custom theme in `docs/.vitepress/theme/` includes `SourceLink.vue` for automatic GitHub source code links
- Mermaid diagram plugin for sequence, state, flowchart, and graph diagrams

## Key Conventions

- All documentation content must be 100% sourced from actual code — no assumptions or guesses
- Reviews are iterative updates (not rewrites) — only changed sections get updated, verified content is preserved
- Documentation is written in Traditional Chinese (zh-TW)
- Mermaid diagrams are required where schema specifies them (architecture, sequence, state, flowchart)
