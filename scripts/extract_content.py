#!/usr/bin/env python3
"""Extract structured content from the raw maproc.pt HTML snapshots.

Reads  data/raw/html/*.html
Writes data/content/<page>.json  (structured)
       data/content/<page>.md    (readable)
       data/content/site.json    (nav, footer, contact info shared across pages)

Requires: beautifulsoup4, lxml
"""
import json
import re
import sys
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "data" / "raw" / "html"
OUT = ROOT / "data" / "content"
OUT.mkdir(parents=True, exist_ok=True)

NOISE_SELECTORS = ["script", "style", "noscript", "svg", "template", "iframe"]


def clean(text: str) -> str:
    return re.sub(r"\s+", " ", text or "").strip()


def best_img_url(img):
    for attr in ("data-src", "data-lazy-src", "src"):
        v = img.get(attr)
        if v and not v.startswith("data:"):
            return v
    srcset = img.get("srcset") or img.get("data-srcset")
    if srcset:
        # last entry in srcset is usually the largest
        return srcset.split(",")[-1].strip().split(" ")[0]
    return None


def extract_blocks(root):
    """Walk the content tree in document order and emit flat blocks."""
    blocks, seen = [], set()

    def add(block):
        key = json.dumps(block, sort_keys=True, ensure_ascii=False)
        if key not in seen:
            seen.add(key)
            blocks.append(block)

    for el in root.find_all(
        ["h1", "h2", "h3", "h4", "h5", "h6", "p", "ul", "ol", "img", "a", "table", "blockquote", "video", "source"]
    ):
        name = el.name
        if name.startswith("h") and len(name) == 2:
            t = clean(el.get_text(" "))
            if t:
                add({"type": "heading", "level": int(name[1]), "text": t})
        elif name == "p":
            t = clean(el.get_text(" "))
            if t:
                add({"type": "paragraph", "text": t})
        elif name in ("ul", "ol"):
            if el.find_parent(["ul", "ol"]):
                continue
            items = [clean(li.get_text(" ")) for li in el.find_all("li")]
            items = [i for i in items if i]
            if items:
                add({"type": "list", "ordered": name == "ol", "items": items})
        elif name == "img":
            src = best_img_url(el)
            if src:
                add({"type": "image", "src": src, "alt": clean(el.get("alt", ""))})
        elif name in ("video", "source"):
            src = el.get("src")
            if src:
                add({"type": "video", "src": src})
        elif name == "a":
            href = el.get("href", "")
            cls = " ".join(el.get("class", []))
            t = clean(el.get_text(" "))
            if t and "elementor-button" in cls:
                add({"type": "button", "text": t, "href": href})
        elif name == "table":
            rows = []
            for tr in el.find_all("tr"):
                rows.append([clean(c.get_text(" ")) for c in tr.find_all(["th", "td"])])
            if rows:
                add({"type": "table", "rows": rows})
        elif name == "blockquote":
            t = clean(el.get_text(" "))
            if t:
                add({"type": "quote", "text": t})
    return blocks


def extract_widgets(root):
    """Elementor pages keep content in custom widgets (rs-heading, rs-service-grid, ...)
    that plain tag walking misses. Emit one entry per leaf widget, in document order."""
    widgets = []
    for w in root.select("div.elementor-widget"):
        if w.select_one("div.elementor-widget"):
            continue  # not a leaf
        wtype = (w.get("data-widget_type") or "").split(".")[0]
        lines = []
        for s in w.stripped_strings:
            s = clean(s)
            if s and s not in ("▼",):
                lines.append(s)
        images, seen_img = [], set()
        for img in w.find_all("img"):
            src = best_img_url(img)
            if src and src not in seen_img and not src.endswith("dummy.png"):
                seen_img.add(src)
                images.append({"src": src, "alt": clean(img.get("alt", ""))})
        links, seen_link = [], set()
        for a in w.find_all("a", href=True):
            href = a["href"]
            if href.startswith(("#", "javascript:")) or href in seen_link:
                continue
            seen_link.add(href)
            links.append({"text": clean(a.get_text(" ")), "href": href})
        videos = [v.get("src") for v in w.find_all(["video", "source"]) if v.get("src")]
        # iframes are stripped earlier, so recover embedded video URLs from widget settings
        raw = w.get("data-settings")
        if raw:
            for m in re.findall(r"https?:\\?/\\?/[^\"'\s\\]+(?:youtube|youtu\.be|vimeo)[^\"'\s\\]*", raw):
                videos.append(m.replace("\\/", "/"))
        if lines or images or links or videos:
            widgets.append(
                {"widget": wtype, "text": lines, "images": images, "links": links, "videos": sorted(set(videos))}
            )
    return widgets


def to_markdown(page):
    lines = [f"# {page['title']}", "", f"> Source: {page['canonical']}"]
    if page.get("meta_description"):
        lines += [f"> Meta description: {page['meta_description']}"]
    lines.append("")
    if page.get("widgets"):
        for w in page["widgets"]:
            lines.append(f"<!-- widget: {w['widget']} -->")
            for t in w["text"]:
                lines.append(t)
                lines.append("")
            for im in w["images"]:
                lines += [f"![{im['alt']}]({im['src']})", ""]
            for l in w["links"]:
                lines += [f"[{l['text'] or l['href']}]({l['href']})", ""]
            for v in w["videos"]:
                lines += [f"[video]({v})", ""]
        return "\n".join(lines)
    for b in page["blocks"]:
        t = b["type"]
        if t == "heading":
            lines += ["#" * min(b["level"] + 1, 6) + " " + b["text"], ""]
        elif t == "paragraph":
            lines += [b["text"], ""]
        elif t == "list":
            for i, it in enumerate(b["items"], 1):
                lines.append(f"{i}. {it}" if b["ordered"] else f"- {it}")
            lines.append("")
        elif t == "image":
            lines += [f"![{b['alt']}]({b['src']})", ""]
        elif t == "button":
            lines += [f"[{b['text']}]({b['href']})", ""]
        elif t == "video":
            lines += [f"[video]({b['src']})", ""]
        elif t == "quote":
            lines += [f"> {b['text']}", ""]
        elif t == "table":
            for r in b["rows"]:
                lines.append("| " + " | ".join(r) + " |")
            lines.append("")
    return "\n".join(lines)


def process(path: Path):
    soup = BeautifulSoup(path.read_text(encoding="utf-8", errors="replace"), "lxml")
    for sel in NOISE_SELECTORS:
        for n in soup.select(sel):
            n.decompose()

    def meta(prop=None, name=None):
        n = soup.find("meta", attrs={"property": prop}) if prop else soup.find("meta", attrs={"name": name})
        return clean(n.get("content", "")) if n else None

    canonical = soup.find("link", rel="canonical")
    page = {
        "slug": path.stem,
        "title": clean(soup.title.get_text()) if soup.title else path.stem,
        "canonical": canonical.get("href") if canonical else None,
        "meta_description": meta(name="description") or meta(prop="og:description"),
        "og_image": meta(prop="og:image"),
        "language": (soup.html.get("lang") if soup.html else None),
    }

    # Site chrome (kept separately so it isn't duplicated in every page body)
    header = soup.find("header")
    footer = soup.find("footer")
    chrome = {"nav": [], "footer_blocks": []}
    if header:
        for a in header.find_all("a"):
            t = clean(a.get_text(" "))
            if t and a.get("href"):
                chrome["nav"].append({"text": t, "href": a["href"]})
    if footer:
        chrome["footer_blocks"] = extract_blocks(footer)

    for chrome_el in soup.find_all(["header", "footer", "nav"]):
        chrome_el.decompose()
    for consent in soup.select("[class*=cmplz], [id*=cmplz], [class*=cookie]"):
        consent.decompose()
    # Pages are built from several Elementor templates, so scope to the whole body,
    # not the first data-elementor-type element.
    main = soup.find("main") or soup.body
    page["blocks"] = extract_blocks(main)
    page["widgets"] = extract_widgets(main)
    return page, chrome


def main():
    files = sorted(RAW.glob("*.html"))
    if not files:
        sys.exit(f"No HTML in {RAW}")
    site = None
    for f in files:
        page, chrome = process(f)
        (OUT / f"{f.stem}.json").write_text(json.dumps(page, ensure_ascii=False, indent=2), encoding="utf-8")
        (OUT / f"{f.stem}.md").write_text(to_markdown(page), encoding="utf-8")
        if f.stem == "home":
            site = chrome
        print(f"{f.stem:38s} blocks={len(page['blocks']):4d}  title={page['title']!r}")
    if site:
        (OUT / "site.json").write_text(json.dumps(site, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
