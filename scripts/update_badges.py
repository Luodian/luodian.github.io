#!/usr/bin/env python3
"""Update citation and GitHub stars badges."""

import json
import os
import re
import urllib.request
from pathlib import Path


def get_github_stars(org: str) -> int:
    total = 0
    page = 1
    while True:
        url = f"https://api.github.com/orgs/{org}/repos?per_page=100&page={page}"
        req = urllib.request.Request(url)
        req.add_header("Accept", "application/vnd.github.v3+json")
        if token := os.environ.get("GITHUB_TOKEN"):
            req.add_header("Authorization", f"token {token}")
        
        with urllib.request.urlopen(req) as resp:
            repos = json.loads(resp.read().decode())
        
        if not repos:
            break
        
        for repo in repos:
            total += repo.get("stargazers_count", 0)
        page += 1
    
    return total


def get_scholar_citations(user_id: str) -> int:
    url = f"https://scholar.google.com/citations?user={user_id}&hl=en"
    req = urllib.request.Request(url)
    req.add_header("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)")
    
    with urllib.request.urlopen(req, timeout=30) as resp:
        html = resp.read().decode("utf-8")
    
    # gsc_rsb_std is Google Scholar's stats table cell class
    match = re.search(r'<td class="gsc_rsb_std">(\d+)</td>', html)
    if match:
        return int(match.group(1))
    
    raise ValueError("Could not find citation count")


def format_number(n: int) -> str:
    return f"{n:,}"


def generate_citations_svg(count: int) -> str:
    count_str = str(count)
    text_width = len(count_str) * 7 + 10
    total_width = 76 + text_width
    count_x = 76 + text_width // 2
    
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{total_width}" height="20" role="img" aria-label="Citations: {count}"><title>Citations: {count}</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="{total_width}" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="76" height="20" fill="#555"/><rect x="76" width="{text_width}" height="20" fill="#007ec6"/><rect width="{total_width}" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><image x="5" y="3" width="14" height="14" href="data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjNDI4NUY0IiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+R29vZ2xlIFNjaG9sYXI8L3RpdGxlPjxwYXRoIGQ9Ik01LjI0MiAxMy43NjlMMCA5LjUgMTIgMGwxMiA5LjUtNS4yNDIgNC4yNjlDMTcuNTQ4IDExLjI0OSAxNC45NzggOS41IDEyIDkuNWMtMi45NzcgMC01LjU0OCAxLjc0OC02Ljc1OCA0LjI2OXpNMTIgMTBhNyA3IDAgMSAwIDAgMTQgNyA3IDAgMCAwIDAtMTR6Ii8+PC9zdmc+"/><text aria-hidden="true" x="475" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="490">Citations</text><text x="475" y="140" transform="scale(.1)" fill="#fff" textLength="490">Citations</text><text aria-hidden="true" x="{count_x * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="{text_width * 10 - 100}">{count}</text><text x="{count_x * 10}" y="140" transform="scale(.1)" fill="#fff" textLength="{text_width * 10 - 100}">{count}</text></g></svg>'''


def generate_stars_svg(count: int) -> str:
    count_str = format_number(count)
    text_width = len(count_str) * 8 + 10
    total_width = 80 + text_width
    count_x = 80 + text_width // 2
    
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{total_width}" height="20">
  <linearGradient id="b" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <mask id="a"><rect width="{total_width}" height="20" rx="3" fill="#fff"/></mask>
  <g mask="url(#a)">
    <path fill="#555" d="M0 0h80v20H0z"/>
    <path fill="#4c1" d="M80 0h{text_width}v20H80z"/>
    <path fill="url(#b)" d="M0 0h{total_width}v20H0z"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
    <text x="40" y="15" fill="#010101" fill-opacity=".3">GitHub Stars</text>
    <text x="40" y="14">GitHub Stars</text>
    <text x="{count_x}" y="15" fill="#010101" fill-opacity=".3">{count_str}</text>
    <text x="{count_x}" y="14">{count_str}</text>
  </g>
</svg>'''


def main():
    scholar_id = os.environ.get("SCHOLAR_ID", "1_zc1-IAAAAJ")
    github_org = os.environ.get("GITHUB_ORG", "EvolvingLMMs-Lab")
    assets_dir = Path(__file__).parent.parent / "assets" / "img"
    
    print(f"Fetching GitHub stars for {github_org}...")
    stars = get_github_stars(github_org)
    print(f"  -> {stars:,} stars")
    
    print(f"Fetching citations for scholar ID {scholar_id}...")
    citations = get_scholar_citations(scholar_id)
    print(f"  -> {citations:,} citations")
    
    citations_svg = generate_citations_svg(citations)
    stars_svg = generate_stars_svg(stars)
    
    (assets_dir / "citations.svg").write_text(citations_svg)
    print(f"Updated {assets_dir / 'citations.svg'}")
    
    (assets_dir / "github-stars.svg").write_text(stars_svg)
    print(f"Updated {assets_dir / 'github-stars.svg'}")


if __name__ == "__main__":
    main()
