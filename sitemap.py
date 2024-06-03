import json
from datetime import datetime

# Define the file paths
mods_file_path = 'mods.json'
other_file_path = 'other.json'
sitemap_file_path = 'itemsitemap.xml'

# Function to read JSON file and extract IDs
def extract_ids(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
        ids = [item['id'] for item in data]
    return ids

# Extract IDs from both JSON files
mods_ids = extract_ids(mods_file_path)
other_ids = extract_ids(other_file_path)

# Combine all IDs
all_ids = mods_ids + other_ids

# Base URL for sitemap
base_url = "https://sumtranslate.netlify.app/item.html?id="

# Current date and time
current_time = datetime.utcnow().isoformat() + 'Z'

# Generate the sitemap URLs
sitemap_entries = []
for item_id in all_ids:
    sitemap_entry = f"""<url>
        <loc>{base_url}{item_id}</loc>
        <lastmod>{current_time}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>"""
    sitemap_entries.append(sitemap_entry)

# Create the sitemap XML content
sitemap_xml = f"""<?xml version='1.0' encoding='UTF-8'?>
<urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'>
{''.join(sitemap_entries)}
</urlset>"""

# Write the sitemap to a file
with open(sitemap_file_path, 'w', encoding='utf-8') as file:
    file.write(sitemap_xml)

print(f"Sitemap generated successfully and saved to {sitemap_file_path}")
