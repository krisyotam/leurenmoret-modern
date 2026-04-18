#!/usr/bin/env python3
"""
extract_content.py — Extract HTML pages from leurenmoret mirror into Markdown files.

Usage:
    python3 scripts/extract_content.py

Reads from:   ../../leurenmoret/  (the HTML mirror, sibling of this project)
Writes to:    content/            (Markdown + YAML frontmatter, relative to project root)

Each output file has YAML frontmatter:
    ---
    title: "Page Title"
    description: "Meta description"
    section: "currents"
    slug: "leuren-moret-hiroshima"
    path: "currents/leuren-moret-hiroshima"
    sidebar: |
      (sidebar markdown, optional)
    ---

    # Markdown body here
"""

import re
import sys
from pathlib import Path

try:
    from bs4 import BeautifulSoup
except ImportError:
    sys.exit("ERROR: beautifulsoup4 not installed. Run: pip install beautifulsoup4")

try:
    import html2text
except ImportError:
    sys.exit("ERROR: html2text not installed. Run: pip install html2text")

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
SCRIPT_DIR  = Path(__file__).parent.resolve()
PROJECT_DIR = SCRIPT_DIR.parent
MIRROR_DIR  = PROJECT_DIR.parent / "leurenmoret"
CONTENT_DIR = PROJECT_DIR / "content"

SECTIONS     = {"archive", "currents", "waves", "lifestyle"}

# ---------------------------------------------------------------------------
# html2text setup
# ---------------------------------------------------------------------------
def make_converter() -> html2text.HTML2Text:
    h = html2text.HTML2Text()
    h.ignore_links   = False
    h.ignore_images  = False
    h.body_width     = 0       # no line-wrapping
    h.unicode_snob   = True
    h.protect_links  = False
    h.wrap_links     = False
    return h


# ---------------------------------------------------------------------------
# Title cleaning
# ---------------------------------------------------------------------------
def clean_title(raw: str) -> str:
    """Strip trailing site-name/author suffixes from <title> text."""
    # Pipe-split: "Page Title | Site Title | Author"
    parts = [p.strip() for p in raw.split("|")]
    noise = {
        "leuren moret: global nuclear coverup",
        "global nuclear coverup",
        "laurens battis",
        "laurens l battis iii",
        "laurens l battis",
    }
    filtered = [
        p for p in parts
        if p.lower().strip("⚛ ❁ ") not in noise
        and "laurens" not in p.lower()
        and "global nuclear coverup" not in p.lower()
    ]
    candidate = filtered[0] if filtered else parts[0]
    # Strip decorative symbols
    candidate = re.sub(r'^[\s⚛❁]+', '', candidate)
    candidate = re.sub(r'[\s⚛❁]+$', '', candidate)
    return candidate.strip() or parts[0].strip()


# ---------------------------------------------------------------------------
# Extraction helpers
# ---------------------------------------------------------------------------
def get_page_title(soup: BeautifulSoup) -> str:
    # Prefer the in-page h2.title (rendered heading inside main-content)
    h2 = soup.find("h2", class_="title")
    if h2:
        text = h2.get_text(separator=" ", strip=True)
        # Strip emojis and atom symbols
        text = re.sub(r'[\u2600-\u27BF\U0001F300-\U0001FAFF⚛❁]+', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        if text:
            return text
    # Fall back to <title>
    title_tag = soup.find("title")
    if title_tag:
        return clean_title(title_tag.get_text())
    return "Untitled"


def get_description(soup: BeautifulSoup) -> str:
    meta = soup.find("meta", attrs={"name": "description"})
    if meta:
        return meta.get("content", "").strip()
    return ""


def get_article_md(soup: BeautifulSoup, conv: html2text.HTML2Text) -> str:
    article = soup.find(class_="article-content")
    if not article:
        main = soup.find(id="main-content")
        if main:
            h2 = main.find("h2", class_="title")
            if h2:
                h2.decompose()
            article = main
    if not article:
        return ""
    return conv.handle(str(article))


def get_sidebar_md(soup: BeautifulSoup, conv: html2text.HTML2Text) -> str:
    sidebar = soup.find(id="sidebar-content")
    if not sidebar:
        return ""
    return conv.handle(str(sidebar))


# ---------------------------------------------------------------------------
# YAML frontmatter serialisation (minimal, no external dep)
# ---------------------------------------------------------------------------
def yaml_str(s: str) -> str:
    """Escape a string for a YAML double-quoted scalar."""
    return s.replace('\\', '\\\\').replace('"', '\\"')


def write_md(out_path: Path, fm: dict, body: str):
    out_path.parent.mkdir(parents=True, exist_ok=True)
    lines = ["---"]
    for key, val in fm.items():
        if val is None or val == "":
            continue
        val = str(val)
        if "\n" in val:
            lines.append(f"{key}: |")
            for line in val.splitlines():
                lines.append(f"  {line}")
        else:
            lines.append(f'{key}: "{yaml_str(val)}"')
    lines += ["---", "", body.strip(), ""]
    out_path.write_text("\n".join(lines), encoding="utf-8")


# ---------------------------------------------------------------------------
# Per-file processing
# ---------------------------------------------------------------------------
def process_file(html_path: Path, conv: html2text.HTML2Text) -> bool:
    try:
        raw = html_path.read_text(encoding="utf-8", errors="replace")
    except Exception as exc:
        print(f"  SKIP (read error): {html_path.relative_to(MIRROR_DIR)} — {exc}")
        return False

    soup = BeautifulSoup(raw, "html.parser")

    # Determine section
    rel_to_mirror = html_path.relative_to(MIRROR_DIR)
    parts = rel_to_mirror.parts  # e.g. ('currents', 'subdir', 'page.html')

    if len(parts) == 1:
        # Root-level file: index.html, contact.html, glossary.html
        section = "home"
        slug    = html_path.stem   # "index", "contact", "glossary"
        out_path = CONTENT_DIR / f"{slug}.md"
        path_str = slug
    elif parts[0] in SECTIONS:
        section = parts[0]
        # Build slug from sub-path within section
        sub_parts = parts[1:]  # may be multiple levels deep
        slug_parts = []
        for p in sub_parts:
            slug_parts.append(p[:-5] if p.endswith(".html") else p)
        slug     = "/".join(slug_parts)
        path_str = f"{section}/{slug}"
        out_path = CONTENT_DIR / section / f"{slug}.md"
    else:
        # Skip anything else (likely asset directories that slipped through)
        return False

    title       = get_page_title(soup)
    description = get_description(soup)
    body        = get_article_md(soup, conv)
    sidebar     = get_sidebar_md(soup, conv)

    fm = {
        "title":       title,
        "description": description or None,
        "section":     section,
        "slug":        slug,
        "path":        path_str,
    }
    if sidebar.strip():
        fm["sidebar"] = sidebar.strip()

    write_md(out_path, fm, body)
    return True


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    print(f"Mirror dir:  {MIRROR_DIR}")
    print(f"Content dir: {CONTENT_DIR}")

    if not MIRROR_DIR.exists():
        sys.exit(f"ERROR: Mirror directory not found: {MIRROR_DIR}")

    CONTENT_DIR.mkdir(parents=True, exist_ok=True)
    conv = make_converter()

    html_files = sorted(
        p for p in MIRROR_DIR.rglob("*.html")
        if "assets" not in p.parts
    )
    print(f"Found {len(html_files)} HTML files\n")

    written = 0
    for i, html_path in enumerate(html_files, 1):
        ok = process_file(html_path, conv)
        if ok:
            written += 1
            rel = html_path.relative_to(MIRROR_DIR)
            print(f"  [{written:3d}] {rel}")

    print(f"\nDone. Wrote {written}/{len(html_files)} files.")


if __name__ == "__main__":
    main()
