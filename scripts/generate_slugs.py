#!/usr/bin/env python3
"""
generate_slugs.py — Compute flat Gwern-style slugs for all content/**/*.md files.

Rules:
  content/index.md                              → slug = "index"   (home page, served at /)
  content/contact.md                            → slug = "contact"
  content/glossary.md                           → slug = "glossary"
  content/<section>/index.md                    → slug = "<section>"
  content/<section>/<file>.md                   → slug = "<file>"   (filename without .md)
  content/<section>/<subdir>/index.md           → slug = "<subdir>"
  content/<section>/<subdir>/<file>.md          → slug = "<file>"   (filename without .md)

Collision resolution: append -2, -3, … to the later file's slug.

Writes:
  - Updated slug: field in each file's YAML frontmatter (in-place)
  - src/lib/slug-map.json  { slug: relPath }  (relPath has no .md extension)
"""

import os
import re
import json

CONTENT_DIR = os.path.join(os.path.dirname(__file__), '..', 'content')
SLUG_MAP_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'lib', 'slug-map.json')


def compute_slug(rel_path: str) -> str:
    """
    Given a relative path like 'currents/du-trojan-horse' (no .md),
    return the flat slug.
    """
    parts = rel_path.split('/')

    if len(parts) == 1:
        # Top-level file: index, contact, glossary
        return parts[0]  # "index", "contact", "glossary"

    if len(parts) == 2:
        section, name = parts
        if name == 'index':
            return section   # currents, archive, waves, lifestyle
        return name          # e.g. du-trojan-horse

    # 3+ parts: content/section/subdir/file  or  content/section/subdir/index
    # Take the filename (last part) unless it's index, in which case take the parent dir
    name = parts[-1]
    if name == 'index':
        return parts[-2]   # the subdirectory name
    return name


def collect_md_files(content_dir: str):
    """Walk content dir, return list of rel paths (no .md extension)."""
    results = []
    for root, dirs, files in os.walk(content_dir):
        dirs.sort()
        for fname in sorted(files):
            if fname.endswith('.md'):
                full = os.path.join(root, fname)
                rel = os.path.relpath(full, content_dir)
                rel_no_ext = rel[:-3]  # strip .md
                # Normalize path separators
                rel_no_ext = rel_no_ext.replace(os.sep, '/')
                results.append(rel_no_ext)
    return results


def resolve_collisions(slug_to_rels: dict) -> dict:
    """
    Given {slug: [rel_path, ...]} (where list length > 1 means collision),
    return {rel_path: final_slug}.
    """
    rel_to_slug = {}
    for slug, rels in slug_to_rels.items():
        if len(rels) == 1:
            rel_to_slug[rels[0]] = slug
        else:
            # First one keeps original slug, rest get -2, -3, ...
            for i, rel in enumerate(rels):
                if i == 0:
                    rel_to_slug[rel] = slug
                else:
                    rel_to_slug[rel] = f'{slug}-{i + 1}'
    return rel_to_slug


def update_frontmatter(file_path: str, new_slug: str):
    """Update the slug: field in the YAML frontmatter of a markdown file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match YAML frontmatter block
    fm_pattern = re.compile(r'^---\n(.*?)\n---', re.DOTALL)
    match = fm_pattern.match(content)
    if not match:
        print(f'  WARNING: No frontmatter in {file_path}')
        return

    fm_block = match.group(1)
    rest = content[match.end():]

    # Replace existing slug: line or append it
    slug_line_re = re.compile(r'^slug:.*$', re.MULTILINE)
    if slug_line_re.search(fm_block):
        new_fm = slug_line_re.sub(f'slug: "{new_slug}"', fm_block)
    else:
        new_fm = fm_block.rstrip() + f'\nslug: "{new_slug}"'

    new_content = f'---\n{new_fm}\n---{rest}'
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)


def main():
    content_dir = os.path.abspath(CONTENT_DIR)
    rel_paths = collect_md_files(content_dir)
    print(f'Found {len(rel_paths)} markdown files.')

    # Compute raw slugs
    slug_to_rels: dict[str, list] = {}
    for rel in rel_paths:
        slug = compute_slug(rel)
        slug_to_rels.setdefault(slug, []).append(rel)

    # Detect collisions
    collisions = {s: rels for s, rels in slug_to_rels.items() if len(rels) > 1}
    if collisions:
        print(f'\nCollisions detected ({len(collisions)}):')
        for slug, rels in collisions.items():
            print(f'  {slug}: {rels}')

    rel_to_slug = resolve_collisions(slug_to_rels)

    # Update frontmatter and build slug map
    slug_map = {}
    for rel, slug in sorted(rel_to_slug.items()):
        file_path = os.path.join(content_dir, rel + '.md')
        update_frontmatter(file_path, slug)
        slug_map[slug] = rel

    # Write slug-map.json
    os.makedirs(os.path.dirname(SLUG_MAP_PATH), exist_ok=True)
    with open(SLUG_MAP_PATH, 'w', encoding='utf-8') as f:
        json.dump(slug_map, f, indent=2, sort_keys=True)
    print(f'\nSlug map written to {SLUG_MAP_PATH} ({len(slug_map)} entries).')

    # Summary
    print('\nSample entries:')
    for slug, rel in list(slug_map.items())[:10]:
        print(f'  {slug!r:50s} → {rel}')


if __name__ == '__main__':
    main()
