import re

with open('src/services/storage.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(len(lines)):
    if 'studyContent: `' in lines[i]:
        # Split by the first backtick
        prefix, content = lines[i].split('studyContent: `', 1)
        # Content ends with `,\n
        if content.endswith('`,\n'):
            inner = content[:-3]
            suffix = '`,\n'
        else:
            # Handle if there are other cases
            inner = content.rsplit('`,', 1)[0]
            suffix = '`,' + content.rsplit('`,', 1)[1]
            
        # replace any backticks inside inner with single quotes
        inner = inner.replace('`', "'")
        lines[i] = f"{prefix}studyContent: `{inner}{suffix}"

with open('src/services/storage.ts', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Fixed storage.ts")
