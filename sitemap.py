import json
from datetime import datetime, timezone

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

# Combine all IDs and sort them
all_ids = sorted(mods_ids + other_ids, key=lambda x: int(x))

# Base URL for sitemap
base_url = "https://sumtranslate.netlify.app/item.html?id="

# Current date and time in UTC
current_time = datetime.now(timezone.utc).isoformat()

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

# Create the sitemap XML content with additional namespaces
sitemap_xml = f"""<?xml version='1.0' encoding='UTF-8'?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml" 
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" 
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
{''.join(sitemap_entries)}
</urlset>"""

# Write the sitemap to a file
with open(sitemap_file_path, 'w', encoding='utf-8') as file:
    file.write(sitemap_xml)

print(f"Sitemap generated successfully and saved to {sitemap_file_path}")
