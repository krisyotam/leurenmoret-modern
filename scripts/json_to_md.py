#!/usr/bin/env python3
"""
json_to_md.py — Convert extracted JSON files to Markdown+frontmatter files.

The linter's content.ts expects .md files with YAML frontmatter and HTML body.
This script converts our content/*.json files into content/*.md files that
content.ts can load via gray-matter + marked.

Since the content is already HTML (not Markdown), we embed the HTML directly
as the body — marked passes raw HTML through unchanged, so this is safe.

Run: python3 scripts/json_to_md.py
"""
import json
import re
from pathlib import Path

CONTENT_DIR = Path(__file__).parent.parent / 'content'


def yaml_scalar(s: str) -> str:
    """Wrap a string in YAML double-quotes, escaping as needed."""
    s = s.replace('\\', '\\\\').replace('"', '\\"')
    return f'"{s}"'


def write_md(json_path: Path) -> None:
    data = json.loads(json_path.read_text(encoding='utf-8'))
    md_path = json_path.with_suffix('.md')

    title = data.get('title', 'Untitled')
    description = data.get('description', '')
    section = data.get('section', 'root')
    slug = data.get('slug', '')
    path_str = data.get('path', '')
    content_html = data.get('content', '')
    sidebar_html = data.get('sidebar', '')

    lines = ['---']
    lines.append(f'title: {yaml_scalar(title)}')
    if description:
        lines.append(f'description: {yaml_scalar(description)}')
    lines.append(f'section: {yaml_scalar(section)}')
    lines.append(f'slug: {yaml_scalar(slug)}')
    lines.append(f'path: {yaml_scalar(path_str)}')

    # Sidebar: embed as literal block scalar (YAML |) so gray-matter reads it
    if sidebar_html.strip():
        lines.append('sidebar: |')
        for line in sidebar_html.splitlines():
            lines.append(f'  {line}')

    lines.append('---')
    lines.append('')
    # Body: the HTML content. marked passes raw HTML through, so this works.
    lines.append(content_html)
    lines.append('')

    md_path.write_text('\n'.join(lines), encoding='utf-8')


def main():
    json_files = list(CONTENT_DIR.rglob('*.json'))
    print(f'Converting {len(json_files)} JSON files to .md ...')
    for i, jf in enumerate(sorted(json_files)):
        write_md(jf)
        if (i + 1) % 50 == 0:
            print(f'  {i+1} done...')
    print(f'Done. {len(json_files)} .md files written.')


if __name__ == '__main__':
    main()
