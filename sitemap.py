# sitemap.py
import json
from datetime import datetime, timezone

# File paths
mods_file_path = 'mods.json'
other_file_path = 'other.json'
sitemap_file_path = 'itemsitemap.xml'

def update_sitemap(item_id=None):
    """ Updates the sitemap for a specific item or regenerates the full sitemap if item_id is None. """

    def extract_ids(file_path):
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
            return [item['id'] for item in data]

    # Extract IDs from JSON files
    mods_ids = extract_ids(mods_file_path)
    other_ids = extract_ids(other_file_path)
    all_ids = sorted(mods_ids + other_ids, key=lambda x: int(x))

    # Base URL
    base_url = "https://sumtranslate.netlify.app/item.html?id="

    # Get current time
    current_time = datetime.now(timezone.utc).isoformat()

    # Read existing sitemap
    try:
        with open(sitemap_file_path, 'r', encoding='utf-8') as file:
            existing_sitemap = file.read()
    except FileNotFoundError:
        existing_sitemap = ""

    # If an item_id is provided, update only that entry
    if item_id:
        new_entry = f"""<url>
            <loc>{base_url}{item_id}</loc>
            <lastmod>{current_time}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
        </url>"""

        if f"<loc>{base_url}{item_id}</loc>" in existing_sitemap:
            # Replace the existing entry
            updated_sitemap = existing_sitemap.replace(
                f"<loc>{base_url}{item_id}</loc>", new_entry
            )
        else:
            # Append new entry
            updated_sitemap = existing_sitemap.replace(
                "</urlset>", f"{new_entry}\n</urlset>"
            )

    else:
        # Regenerate the whole sitemap
        sitemap_entries = [
            f"""<url>
            <loc>{base_url}{item}</loc>
            <lastmod>{current_time}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
        </url>"""
            for item in all_ids
        ]

        updated_sitemap = f"""<?xml version='1.0' encoding='UTF-8'?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{''.join(sitemap_entries)}
</urlset>"""

    # Write back to file
    with open(sitemap_file_path, 'w', encoding='utf-8') as file:
        file.write(updated_sitemap)

    print(f"Sitemap {'updated' if item_id else 'regenerated'} successfully!")

