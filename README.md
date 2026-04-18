# Leuren Moret: Global Nuclear Coverup — Modern Site

A modern, fully static rebuild of **leurenmoret.info**, the assembled works of Leuren Moret (BS, MS, PhD ABD) — geoscientist, nuclear whistleblower, and independent radiation researcher.

Built to last. Source of truth is Markdown. Renders to pure HTML with zero runtime JavaScript required for content.

**Source mirror:** [krisyotam/leurenmoret](https://github.com/krisyotam/leurenmoret)

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (`output: 'export'`) |
| Language | TypeScript (strict) |
| Content | Markdown + YAML frontmatter |
| Parsing | gray-matter + marked |
| Font | Lora (serif, Google Fonts via `next/font`) |
| Styling | CSS Modules + global CSS variables |
| Rendering | 100% static — no client JS for content |

---

## Architecture

This is a **static site generator**, not a dynamic app. At build time:

1. `generateStaticParams` enumerates all 371 `.md` files in `content/`
2. `gray-matter` parses frontmatter (title, description, section, slug)
3. `marked` renders Markdown body to HTML
4. Next.js exports a flat directory of HTML files to `out/`

No database. No API. No server. The built `out/` directory can be served by any static host.

---

## Content Structure

```
content/
├── index.md                    # Home page
├── contact.md
├── glossary.md
├── archive/                    # Historical documents & papers
│   └── *.md
├── currents/                   # Contemporary analysis
│   ├── 21st-century-silk-road/
│   ├── donetsk-nuclear-explosion/
│   └── *.md
├── waves/                      # Serial content & radiation monitoring
│   ├── radiation-around-the-nation/
│   └── *.md
└── lifestyle/                  # Reading list & personal
    └── *.md
```

Content files use this frontmatter schema:

```yaml
---
title: "Leuren Moret: Hiroshima, Nagasaki, Fukushima"
description: "..."
section: "currents"
slug: "leuren-moret-hiroshima"
path: "currents/leuren-moret-hiroshima"
sidebar: |
  (sidebar Markdown)
---

Article body in Markdown...
```

---

## Source Files

```
src/
├── app/
│   ├── layout.tsx                    # Root layout: Header, Navigation, footer
│   ├── globals.css                   # Design tokens, typography, base styles
│   ├── page.tsx                      # Home page
│   ├── [section]/[[...slug]]/        # All section & article routes
│   │   └── page.tsx
│   ├── contact/page.tsx
│   └── glossary/page.tsx
├── components/
│   ├── Header.tsx                    # ⚛ atom logo, site title, tagline
│   ├── Navigation.tsx                # Sticky top nav with dropdowns
│   ├── ArticlePage.tsx               # Two-column: article + sidebar
│   ├── ArticleContent.tsx            # Markdown→HTML renderer
│   └── Sidebar.tsx                   # Sidebar renderer
└── lib/
    ├── content.ts                    # gray-matter + marked loader
    └── nav-data.ts                   # Typed navigation tree
```

---

## Content Extraction

The `content/` directory was generated from the HTML mirror by:

```bash
pip install html2text
python3 scripts/extract_content.py   # HTML → Markdown + frontmatter
python3 scripts/build_nav.py         # index.html nav → src/lib/nav-data.ts
```

To re-extract from an updated mirror:

```bash
MIRROR_DIR=../leurenmoret python3 scripts/extract_content.py
```

---

## Design

| Token | Value |
|-------|-------|
| Background | `#f8f6f1` (warm paper) |
| Text | `#1a1a1a` |
| Accent | `#1a3a5c` (deep navy) |
| Sidebar bg | `#f0ede6` |
| Border | `#d4cfc5` |
| Body font | Lora 18px, line-height 1.75 |
| Link hover | `#8b0000` (dark crimson) |

---

## Development

```bash
npm install
npm run dev        # localhost:3000

# Regenerate content from mirror
python3 scripts/extract_content.py

# Type check
npx tsc --noEmit

# Static build (outputs to out/)
npm run build
```

> **Note:** Do not run `npm run build` on low-memory machines — 371 pages generate a large static export.
