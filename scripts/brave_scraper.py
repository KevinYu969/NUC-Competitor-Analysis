#!/usr/bin/env python3
"""
Brave Search API Scraper for ASUS NUC PN70 Competitor Analysis
Scrapes Reddit, forums, news, and social media for customer voice data.
Runs twice daily via GitHub Actions.
"""

import json
import os
import sys
import time
import hashlib
from datetime import datetime, timedelta
from pathlib import Path
from urllib.parse import quote_plus

import requests

# ==========================================
# CONFIGURATION
# ==========================================
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
CONFIG_DIR = PROJECT_ROOT / "config"
DATA_DIR = PROJECT_ROOT / "dashboard" / "data"
OUTPUT_FILE = DATA_DIR / "voice_data.json"

# Search queries organized by category
SEARCH_QUERIES = {
    "general_competitor": [
        "ASUS NUC PN70 review",
        "Strix Halo mini PC review 2025",
        "AMD Ryzen AI Max mini PC comparison",
        "HP Z2 Mini G1a review Strix Halo",
        "GMKtec EVO-X2 AI Strix Halo review",
        "Beelink GTR9 Pro Strix Halo review",
        "Minisforum MS-S1 MAX Strix Halo",
        "Dell Pro Micro AMD mini PC 2025",
        "Lenovo ThinkCentre Neo 55q AMD review",
        "mini PC AMD Zen5 Strix Halo comparison",
        "Acer Revo Box AI mini PC review",
    ],
    "halo_llm_performance": [
        "Strix Halo local LLM performance",
        "Ryzen AI Max local AI inference benchmark",
        "Strix Halo llama tokens per second",
        "AMD Strix Halo LLM 128GB unified memory",
        "mini PC local LLM Strix Halo",
        "Ryzen AI Max+ 395 LLM benchmark",
    ],
    "halo_oem_feedback": [
        "HP Z2 Mini G1a review user feedback",
        "HP Z2 Mini G1a Strix Halo workstation experience",
        "GMKtec EVO-X2 build quality review",
        "Beelink GTR9 Pro build quality review",
        "white label Strix Halo mini PC quality BIOS firmware",
        "Strix Halo OEM comparison quality build noise thermal",
    ],
    "halo_rocm_feedback": [
        "ROCm Strix Halo RDNA 3.5",
        "ROCm AMD Ryzen AI Max GPU compute",
        "ROCm RDNA 3.5 integrated graphics experience",
        "AMD ROCm mini PC AI developer experience",
        "ROCm gfx1151 Strix Halo support",
        "ROCm PyTorch AMD Strix Halo",
    ],
}

# Halo category mapping
HALO_CATEGORY_MAP = {
    "halo_llm_performance": "llm_performance",
    "halo_oem_feedback": "oem_feedback",
    "halo_rocm_feedback": "rocm_feedback",
}

# Product detection keywords
PRODUCT_KEYWORDS = {
    "asus": ["asus", "nuc", "pn70", "asus nuc"],
    "hp": ["hp ", "z2 mini", "z2 mini g1a", "hp z2", "hp workstation"],
    "beelink": ["beelink", "gtr9", "ser9"],
    "gmktec": ["gmktec", "evo-x2", "evo x2"],
    "minisforum": ["minisforum", "ms-s1", "elitemini"],
    "dell": ["dell", "optiplex", "pro micro"],
    "lenovo": ["lenovo", "thinkcentre", "neo 55q"],
    "acer": ["acer", "revo"],
}

# Simple sentiment keywords
POSITIVE_WORDS = [
    "excellent", "amazing", "great", "impressive", "love", "perfect",
    "awesome", "fantastic", "incredible", "solid", "best", "game changer",
    "smooth", "fast", "powerful", "recommend", "happy", "pleased",
    "outstanding", "superior", "well-built", "efficient",
]
NEGATIVE_WORDS = [
    "terrible", "awful", "worst", "horrible", "hate", "broken",
    "disappointing", "poor", "bad", "slow", "crash", "bug", "issue",
    "problem", "fail", "frustrating", "unreliable", "overpriced",
    "noisy", "loud", "hot", "overheating", "painful", "annoying",
]


def load_api_key():
    """Load Brave Search API key from secrets or environment."""
    # Check environment variable first (GitHub Actions)
    api_key = os.environ.get("BRAVE_SEARCH_API_KEY", "")
    if api_key:
        return api_key

    # Check secrets file
    secrets_file = CONFIG_DIR / "secrets.json"
    if secrets_file.exists():
        with open(secrets_file) as f:
            secrets = json.load(f)
            return secrets.get("brave_search_api_key", "")

    return ""


def brave_search(query, api_key, count=20, freshness="pw"):
    """
    Execute a Brave Search API query.
    freshness: 'pd' (past day), 'pw' (past week), 'pm' (past month), 'py' (past year)
    """
    url = "https://api.search.brave.com/res/v1/web/search"
    headers = {
        "Accept": "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": api_key,
    }
    params = {
        "q": query,
        "count": count,
        "freshness": freshness,
        "text_decorations": False,
        "search_lang": "en",
    }

    try:
        resp = requests.get(url, headers=headers, params=params, timeout=30)
        resp.raise_for_status()
        return resp.json()
    except requests.RequestException as e:
        print(f"  [ERROR] Search failed for '{query}': {e}")
        return None


def detect_product(text):
    """Detect which product is being discussed."""
    text_lower = text.lower()
    for product, keywords in PRODUCT_KEYWORDS.items():
        for kw in keywords:
            if kw in text_lower:
                return product
    return "other"


def analyze_sentiment(text):
    """Simple keyword-based sentiment analysis."""
    text_lower = text.lower()
    pos_count = sum(1 for w in POSITIVE_WORDS if w in text_lower)
    neg_count = sum(1 for w in NEGATIVE_WORDS if w in text_lower)

    if pos_count > neg_count + 1:
        return "positive"
    elif neg_count > pos_count + 1:
        return "negative"
    return "neutral"


def detect_source(url, title):
    """Detect the source type from URL."""
    url_lower = url.lower()
    if "reddit.com" in url_lower:
        # Extract subreddit
        parts = url_lower.split("/r/")
        subreddit = ""
        if len(parts) > 1:
            subreddit = "r/" + parts[1].split("/")[0]
        return "reddit", {"subreddit": subreddit}
    elif any(f in url_lower for f in ["forum", "servethehome", "notebookreview", "overclock"]):
        return "forum", {"forum_name": extract_domain(url)}
    elif any(n in url_lower for n in ["twitter.com", "x.com", "youtube.com", "facebook"]):
        platform = "X/Twitter" if "twitter" in url_lower or "x.com" in url_lower else \
                   "YouTube" if "youtube" in url_lower else "Facebook"
        return "social", {"platform": platform}
    else:
        return "news", {"outlet": extract_domain(url)}


def extract_domain(url):
    """Extract clean domain name from URL."""
    try:
        from urllib.parse import urlparse
        parsed = urlparse(url)
        domain = parsed.netloc.replace("www.", "")
        return domain
    except Exception:
        return url


def extract_tags(text, category):
    """Extract relevant tags from text content."""
    text_lower = text.lower()
    tags = []

    tag_keywords = {
        "local-llm": ["llm", "llama", "mistral", "mixtral", "gpt", "inference", "tokens/sec"],
        "rocm": ["rocm", "hip", "hip sdk"],
        "rdna3.5": ["rdna 3.5", "rdna3.5", "gfx1151"],
        "performance": ["benchmark", "performance", "speed", "fast", "tokens"],
        "pricing": ["price", "cost", "$", "expensive", "cheap", "value", "msrp"],
        "build-quality": ["build quality", "build", "chassis", "design", "premium"],
        "thermals": ["thermal", "heat", "temperature", "fan", "cooling", "noise", "loud"],
        "form-factor": ["form factor", "compact", "small", "volume", "litre", "liter"],
        "strix-halo": ["strix halo", "ryzen ai max"],
        "white-label": ["white label", "no-name", "generic", "oem", "aliexpress"],
        "software": ["driver", "bios", "firmware", "software", "update"],
        "comparison": ["vs", "versus", "compare", "comparison", "better than"],
    }

    for tag, keywords in tag_keywords.items():
        if any(kw in text_lower for kw in keywords):
            tags.append(tag)

    return tags[:5]  # Max 5 tags


def generate_id(url, title):
    """Generate a unique ID for deduplication."""
    content = f"{url}{title}"
    return hashlib.md5(content.encode()).hexdigest()[:12]


def process_search_results(results, category):
    """Process Brave Search results into voice data entries."""
    entries = []
    if not results or "web" not in results or "results" not in results["web"]:
        return entries

    for item in results["web"]["results"]:
        url = item.get("url", "")
        title = item.get("title", "")
        description = item.get("description", "")
        text = f"{title}. {description}"

        # Skip irrelevant results
        if len(description) < 50:
            continue

        source_type, source_meta = detect_source(url, title)
        product = detect_product(text)
        sentiment = analyze_sentiment(text)
        tags = extract_tags(text, category)

        # Parse date
        page_age = item.get("page_age", "")
        if page_age:
            try:
                date = datetime.fromisoformat(page_age.replace("Z", "+00:00")).strftime("%Y-%m-%d")
            except (ValueError, TypeError):
                date = datetime.now().strftime("%Y-%m-%d")
        else:
            date = datetime.now().strftime("%Y-%m-%d")

        entry = {
            "id": generate_id(url, title),
            "source": source_type,
            "title": title,
            "text": description,
            "url": url,
            "date": date,
            "sentiment": sentiment,
            "product": product,
            "tags": tags,
        }
        entry.update(source_meta)

        # Add Halo category if applicable
        if category in HALO_CATEGORY_MAP:
            entry["halo_category"] = HALO_CATEGORY_MAP[category]

        entries.append(entry)

    return entries


def load_existing_data():
    """Load existing voice data for deduplication."""
    if OUTPUT_FILE.exists():
        with open(OUTPUT_FILE) as f:
            return json.load(f)
    return []


def merge_data(existing, new_entries):
    """Merge new entries with existing data, deduplicating by ID."""
    existing_ids = {e["id"] for e in existing}
    merged = list(existing)

    added = 0
    for entry in new_entries:
        if entry["id"] not in existing_ids:
            merged.append(entry)
            existing_ids.add(entry["id"])
            added += 1

    # Sort by date descending
    merged.sort(key=lambda x: x.get("date", ""), reverse=True)

    # Keep last 500 entries to prevent unbounded growth
    merged = merged[:500]

    return merged, added


def main():
    print("=" * 60)
    print("ASUS NUC PN70 Competitor Analysis — Brave Search Scraper")
    print(f"Run time: {datetime.now().isoformat()}")
    print("=" * 60)

    api_key = load_api_key()
    if not api_key:
        print("[ERROR] No Brave Search API key found.")
        print("Set BRAVE_SEARCH_API_KEY env var or fill config/secrets.json")
        sys.exit(1)

    # Ensure output directory exists
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    # Load existing data
    existing = load_existing_data()
    print(f"Existing entries: {len(existing)}")

    all_new = []
    total_queries = sum(len(q) for q in SEARCH_QUERIES.values())
    query_num = 0

    for category, queries in SEARCH_QUERIES.items():
        print(f"\n--- Category: {category} ---")
        for query in queries:
            query_num += 1
            print(f"  [{query_num}/{total_queries}] Searching: {query}")

            results = brave_search(query, api_key, count=10, freshness="pm")
            if results:
                entries = process_search_results(results, category)
                all_new.extend(entries)
                print(f"    Found {len(entries)} entries")
            else:
                print("    No results")

            # Rate limit: 1 request per second (Brave free tier)
            time.sleep(1.2)

    # Merge and save
    merged, added = merge_data(existing, all_new)
    with open(OUTPUT_FILE, "w") as f:
        json.dump(merged, f, indent=2, ensure_ascii=False)

    print(f"\n{'=' * 60}")
    print(f"Scraping complete!")
    print(f"  New entries found: {len(all_new)}")
    print(f"  New unique entries added: {added}")
    print(f"  Total entries: {len(merged)}")
    print(f"  Output: {OUTPUT_FILE}")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
