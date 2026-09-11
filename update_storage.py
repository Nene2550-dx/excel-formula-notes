import re

with open('full_user_input.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Extract units based on "บทที่" headers
import re
units_text = {}
for i in range(1, 6):
    pattern = rf"บทที่ {i}(.*?)(?=บทที่ {i+1}|\Z)"
    match = re.search(pattern, text, re.DOTALL)
    if match:
        content = match.group(1).strip()
        # Convert simple text to HTML
        html_lines = []
        for line in content.split('\n'):
            line = line.strip()
            if not line:
                continue
            if line.startswith('* '):
                html_lines.append(f"<ul><li>{line[2:]}</li></ul>")
            elif line.startswith('*'):
                html_lines.append(f"<ul><li>{line[1:]}</li></ul>")
            else:
                html_lines.append(f"<p>{line}</p>")
        html_content = "".join(html_lines)
        # Fix nested ul tags roughly for simplicity or just use simple p tags
        html_content = html_content.replace('</ul><ul>', '')
        units_text[f"unit-0{i}"] = html_content

with open('src/services/storage.ts', 'r', encoding='utf-8') as f:
    storage_ts = f.read()

for unit_id, html_content in units_text.items():
    # Find the unit block and add studyContent before updatedAt or similar
    pattern = rf"(id:\s*'{unit_id}'.*?)(updatedAt:\s*'[^']+',)"
    replacement = rf"\1studyContent: `{html_content}`,\n    \2"
    storage_ts = re.sub(pattern, replacement, storage_ts, flags=re.DOTALL)

with open('src/services/storage.ts', 'w', encoding='utf-8') as f:
    f.write(storage_ts)

print("Done updating storage.ts")
