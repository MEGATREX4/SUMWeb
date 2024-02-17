import json

def add_ordered_ids(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)

        if 'id' not in data[0]:
            for index, entry in enumerate(data):
                entry['id'] = f"{index + 1:06d}"
        else:
            last_id = int(data[-1]['id'])
            for index, entry in enumerate(data):
                entry['id'] = f"{last_id + index + 1:06d}"

        with open(file_path, 'w', encoding='utf-8') as file:
            json.dump(data, file, indent=2, ensure_ascii=False)

        print(f"Ordered IDs added to {file_path} successfully.")

    except FileNotFoundError:
        print(f"File {file_path} not found.")

# Add ordered IDs to other.json
add_ordered_ids('other.json')

# Add ordered IDs to mods.json
add_ordered_ids('mods.json')
