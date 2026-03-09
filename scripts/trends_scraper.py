"""
Google Trends Scraper for NUC Competitor Analysis
Uses pytrends (unofficial Google Trends API) to fetch search interest data.

Data is saved as JSON and visualized in the dashboard.
Verification: Each data point can be verified at trends.google.com

Usage:
    python scripts/trends_scraper.py

Output:
    dashboard/data/trends_data.json
    docs/data/trends_data.json
"""

import json
import os
import time
from datetime import datetime

try:
    from pytrends.request import TrendReq
except ImportError:
    print("pytrends not installed. Run: pip install pytrends")
    print("Generating empty trends_data.json placeholder.")
    TrendReq = None

# Keyword presets matching dashboard TREND_PRESETS
PRESETS = [
    {
        "label": "Mini PC 品牌",
        "keywords": ["ASUS NUC", "HP Z2 Mini", "Beelink Mini PC", "GMKtec", "Minisforum"]
    },
    {
        "label": "Strix Halo",
        "keywords": ["AMD Strix Halo", "Ryzen AI Max", "RDNA 3.5", "ROCm"]
    },
    {
        "label": "AI PC",
        "keywords": ["AI PC", "Local LLM", "NPU laptop", "Copilot PC", "DGX Spark"]
    }
]

TIMEFRAMES = {
    "past_12m": "today 12-m",
    "past_3m": "today 3-m",
    "past_30d": "today 1-m",
    "past_7d": "now 7-d"
}


def fetch_trends_data():
    """Fetch Google Trends data for all presets and timeframes."""
    if TrendReq is None:
        return {"presets": [], "fetched_at": datetime.utcnow().isoformat() + "Z"}

    pytrends = TrendReq(hl='zh-TW', tz=480)
    result = {"presets": [], "fetched_at": datetime.utcnow().isoformat() + "Z"}

    for preset in PRESETS:
        preset_data = {
            "label": preset["label"],
            "keywords": preset["keywords"],
            "timeframes": {}
        }

        for tf_key, tf_value in TIMEFRAMES.items():
            try:
                pytrends.build_payload(preset["keywords"], timeframe=tf_value, geo='')
                interest_df = pytrends.interest_over_time()

                if interest_df.empty:
                    continue

                # Extract dates and values
                dates = [d.strftime('%m/%d') for d in interest_df.index]
                values = []
                for kw in preset["keywords"]:
                    if kw in interest_df.columns:
                        values.append(interest_df[kw].tolist())
                    else:
                        values.append([0] * len(dates))

                # Get related queries for the 12-month timeframe
                related = None
                if tf_key == "past_12m":
                    try:
                        related_queries = pytrends.related_queries()
                        related = []
                        for kw in preset["keywords"]:
                            if kw in related_queries and related_queries[kw].get('top') is not None:
                                top_df = related_queries[kw]['top'].head(5)
                                for _, row in top_df.iterrows():
                                    related.append({
                                        "term": row['query'],
                                        "value": str(row['value'])
                                    })
                        # Deduplicate
                        seen = set()
                        unique_related = []
                        for r in related:
                            if r['term'] not in seen:
                                seen.add(r['term'])
                                unique_related.append(r)
                        related = unique_related[:15]
                    except Exception:
                        related = None

                preset_data["timeframes"][tf_key] = {
                    "dates": dates,
                    "values": values,
                    "related": related,
                    "fetched_at": datetime.utcnow().isoformat() + "Z"
                }

                # Rate limiting to avoid Google blocking
                time.sleep(2)

            except Exception as e:
                print(f"Error fetching {preset['label']} / {tf_key}: {e}")
                continue

        result["presets"].append(preset_data)

    return result


def save_trends_data(data):
    """Save trends data to both dashboard/data and docs/data."""
    for directory in ['dashboard/data', 'docs/data']:
        os.makedirs(directory, exist_ok=True)
        filepath = os.path.join(directory, 'trends_data.json')
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Saved: {filepath}")


def main():
    print("Fetching Google Trends data...")
    data = fetch_trends_data()
    save_trends_data(data)
    print(f"Done. {len(data['presets'])} presets processed.")


if __name__ == '__main__':
    main()
