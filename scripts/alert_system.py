#!/usr/bin/env python3
"""
Alert Detection Module for ASUS NUC PN70 Competitor Analysis

Detects high-impact competitive events and sends notifications.
Integrates with the Brave Search scraper pipeline.

Supported notification channels:
- Slack Webhook
- Email (SMTP)
- JSON file (always, for dashboard consumption)
"""

import json
import os
import re
from datetime import datetime
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
DATA_DIR = PROJECT_ROOT / "dashboard" / "data"
ALERTS_FILE = DATA_DIR / "alerts.json"
HISTORY_DIR = DATA_DIR / "history"

# Alert rule definitions
ALERT_RULES = [
    {
        "id": "new_product_launch",
        "name": "新產品發布",
        "description": "競爭者發布新產品或新型號",
        "keywords": ["launch", "announce", "unveil", "release", "new model", "new product",
                     "now available", "pre-order", "shipping now", "just released"],
        "impact": "high",
        "action": "評估對 PN70 上市時程與定位的影響",
    },
    {
        "id": "price_change",
        "name": "價格變動",
        "description": "競品價格調整超過 10% 或重大促銷",
        "keywords": ["price drop", "price cut", "price increase", "sale", "discount",
                     "promotion", "price reduced", "now $", "was $", "save $",
                     "cheaper", "price war", "msrp"],
        "impact": "high",
        "action": "納入 PN70 定價策略，評估是否需調整價格帶",
    },
    {
        "id": "major_review",
        "name": "重大評測",
        "description": "知名媒體或 KOL 發布詳細評測",
        "keywords": ["review", "benchmark", "tested", "hands-on", "deep dive",
                     "full review", "compared", "vs"],
        "sources": ["Tom's Hardware", "NotebookCheck", "ServeTheHome", "StorageReview",
                    "AnandTech", "Ars Technica", "The Verge", "LTT", "Gamers Nexus"],
        "impact": "medium",
        "action": "分析評測結論，更新競品比較資料",
    },
    {
        "id": "software_ecosystem",
        "name": "軟體生態重大更新",
        "description": "ROCm、驅動、BIOS 重大更新或問題",
        "keywords": ["rocm update", "rocm 6", "driver update", "bios update",
                     "firmware update", "critical bug", "security vulnerability",
                     "pytorch support", "rocm support"],
        "impact": "high",
        "action": "與 AMD 團隊確認相容性，更新技術文件",
    },
    {
        "id": "market_event",
        "name": "市場大事件",
        "description": "展會、產業事件（Computex、CES 等）",
        "keywords": ["computex", "ces 2026", "ces 2025", "trade show", "keynote",
                     "product showcase", "industry event"],
        "impact": "high",
        "action": "密切追蹤展會動態，準備應對策略",
    },
    {
        "id": "negative_asus",
        "name": "ASUS 負面輿情",
        "description": "針對 ASUS NUC 的負面報導或客訴",
        "keywords": ["asus nuc problem", "asus nuc issue", "asus nuc defect",
                     "asus nuc complaint", "asus nuc return", "asus nuc fail"],
        "impact": "high",
        "action": "立即評估輿情影響，啟動危機處理流程",
    },
]


def detect_alerts(voice_entries, existing_alerts=None):
    """
    Scan voice data entries for alert-worthy events.
    Returns list of new alerts.
    """
    existing_ids = set()
    if existing_alerts:
        existing_ids = {a["source_id"] for a in existing_alerts}

    new_alerts = []

    for entry in voice_entries:
        # Skip already-alerted entries
        if entry.get("id") in existing_ids:
            continue

        text = f"{entry.get('title', '')} {entry.get('text', '')}".lower()
        source_name = (entry.get('outlet') or entry.get('forum_name')
                       or entry.get('subreddit') or entry.get('platform') or '')

        for rule in ALERT_RULES:
            matched = False

            # Check keyword match
            keyword_hits = [kw for kw in rule["keywords"] if kw.lower() in text]
            if keyword_hits:
                matched = True

            # Check source-specific rules
            if "sources" in rule and not keyword_hits:
                if any(src.lower() in source_name.lower() for src in rule["sources"]):
                    # Only trigger if there are also some keyword hits
                    if keyword_hits:
                        matched = True

            if not matched:
                continue

            # Check for price-specific patterns
            if rule["id"] == "price_change":
                price_pattern = r'\$[\d,]+|\d+%\s*(off|discount|cheaper|drop)'
                if not re.search(price_pattern, text, re.IGNORECASE):
                    if not any(kw in text for kw in ["price drop", "price cut", "price war", "price reduced"]):
                        continue

            alert = {
                "id": f"alert_{entry['id']}_{rule['id']}",
                "source_id": entry["id"],
                "rule_id": rule["id"],
                "rule_name": rule["name"],
                "impact": rule["impact"],
                "title": entry.get("title", ""),
                "summary": entry.get("text", "")[:200],
                "product": entry.get("product", "other"),
                "source": entry.get("source", ""),
                "source_name": source_name,
                "url": entry.get("url", ""),
                "date": entry.get("date", ""),
                "detected_at": datetime.utcnow().isoformat() + "Z",
                "action": rule["action"],
                "read": False,
                "keyword_matches": keyword_hits[:3],
            }
            new_alerts.append(alert)
            break  # One alert per entry (highest priority rule first)

    return new_alerts


def load_existing_alerts():
    """Load existing alerts from JSON file."""
    if ALERTS_FILE.exists():
        with open(ALERTS_FILE) as f:
            return json.load(f)
    return []


def save_alerts(alerts):
    """Save alerts to both dashboard/data and docs/data."""
    # Keep last 100 alerts
    alerts = sorted(alerts, key=lambda a: a.get("detected_at", ""), reverse=True)[:100]

    for directory in [DATA_DIR, PROJECT_ROOT / "docs" / "data"]:
        directory.mkdir(parents=True, exist_ok=True)
        filepath = directory / "alerts.json"
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(alerts, f, ensure_ascii=False, indent=2)

    return alerts


def send_slack_notification(alerts, webhook_url):
    """Send alert notifications to Slack."""
    if not webhook_url or not alerts:
        return

    import requests

    high_alerts = [a for a in alerts if a["impact"] == "high"]
    if not high_alerts:
        return

    blocks = [
        {
            "type": "header",
            "text": {"type": "plain_text", "text": f"NUC Alert: {len(high_alerts)} High-Impact Events"}
        }
    ]

    for alert in high_alerts[:5]:  # Max 5 alerts per message
        impact_emoji = {"high": "🔴", "medium": "🟡", "low": "🟢"}.get(alert["impact"], "⚪")
        blocks.append({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": (
                    f"{impact_emoji} *{alert['rule_name']}*\n"
                    f"*{alert['title']}*\n"
                    f"{alert['summary'][:150]}...\n"
                    f"▸ 建議: {alert['action']}\n"
                    f"<{alert['url']}|查看原文>"
                )
            }
        })
        blocks.append({"type": "divider"})

    payload = {"blocks": blocks}

    try:
        resp = requests.post(webhook_url, json=payload, timeout=10)
        resp.raise_for_status()
        print(f"Slack notification sent: {len(high_alerts)} alerts")
    except Exception as e:
        print(f"Slack notification failed: {e}")


def save_daily_snapshot(voice_data, pricing_data=None):
    """Save a daily snapshot for historical tracking."""
    HISTORY_DIR.mkdir(parents=True, exist_ok=True)
    today = datetime.utcnow().strftime("%Y-%m-%d")
    snapshot_file = HISTORY_DIR / f"{today}.json"

    # Calculate aggregations
    sentiment_counts = {"positive": 0, "neutral": 0, "negative": 0}
    product_mentions = {}
    source_counts = {}

    for v in voice_data:
        sentiment_counts[v.get("sentiment", "neutral")] += 1
        product = v.get("product", "other")
        product_mentions[product] = product_mentions.get(product, 0) + 1
        source = v.get("source", "other")
        source_counts[source] = source_counts.get(source, 0) + 1

    snapshot = {
        "date": today,
        "total_entries": len(voice_data),
        "sentiment": sentiment_counts,
        "product_mentions": product_mentions,
        "source_counts": source_counts,
        "generated_at": datetime.utcnow().isoformat() + "Z",
    }

    # Include pricing if available
    if pricing_data:
        snapshot["pricing"] = pricing_data

    with open(snapshot_file, "w", encoding="utf-8") as f:
        json.dump(snapshot, f, ensure_ascii=False, indent=2)

    # Also generate/update the consolidated history index
    update_history_index()

    return snapshot


def update_history_index():
    """Consolidate all daily snapshots into a single history.json for the dashboard."""
    if not HISTORY_DIR.exists():
        return

    history = []
    for snapshot_file in sorted(HISTORY_DIR.glob("*.json")):
        if snapshot_file.name == "index.json":
            continue
        try:
            with open(snapshot_file) as f:
                data = json.load(f)
                history.append(data)
        except (json.JSONDecodeError, IOError):
            continue

    # Keep last 365 days
    history = sorted(history, key=lambda h: h.get("date", ""))[-365:]

    # Save to both dashboard and docs
    for directory in [DATA_DIR, PROJECT_ROOT / "docs" / "data"]:
        directory.mkdir(parents=True, exist_ok=True)
        filepath = directory / "history.json"
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(history, f, ensure_ascii=False, indent=2)

    print(f"History index updated: {len(history)} daily snapshots")
