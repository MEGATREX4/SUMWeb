import json
import uuid

def add_ordered_ids(file_path):
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)

        # Check if the 'id' field is already present in the entries
        if 'id' not in data[0]:
            # If not, add the 'id' field and start numbering from 1
            for index, entry in enumerate(data):
                entry['id'] = f"{index + 1:06d}"
        else:
            # If 'id' is already present, continue numbering sequentially
            last_id = int(data[-1]['id'])
            for index, entry in enumerate(data):
                entry['id'] = f"{last_id + index + 1:06d}"

        with open(file_path, 'w') as file:
            json.dump(data, file, indent=2)

        print(f"Ordered IDs added to {file_path} successfully.")

    except FileNotFoundError:
        print(f"File {file_path} not found.")

# Add ordered IDs to other.json
add_ordered_ids('other.json')

# Add ordered IDs to mods.json
add_ordered_ids('mods.json')
