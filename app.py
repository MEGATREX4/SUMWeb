from flask import Flask, render_template, request, jsonify, redirect, url_for
import json
import os

app = Flask(__name__, static_url_path='/static')

# Load data from JSON files
def load_data(filename):
    try:
        with open(filename, 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        return []

def get_max_id():
    # Load data from mods.json
    with open('mods.json', 'r', encoding='utf-8') as mods_file:
        mods_data = json.load(mods_file)

    # Load data from other.json
    with open('other.json', 'r', encoding='utf-8') as other_file:
        other_data = json.load(other_file)

    # Combine data from both files
    all_data = mods_data + other_data

    # Extract IDs and find the maximum
    ids = [int(record.get('id', 0)) for record in all_data]
    max_id = max(ids) if ids else 0

    # Increment the maximum ID by 1 and format with leading zeros
    new_id = '{:06d}'.format(max_id + 1)

    return new_id

def save_record(data):
    # Determine the filename based on the source
    filename = 'mods.json' if data.get('source') == 'mods' else 'other.json'

    # Remove the 'source' key from the data
    data_without_source = data.copy()
    data_without_source.pop('source', None)

    # Load existing records from the file
    try:
        with open(filename, 'r', encoding='utf-8') as file:
            records = json.load(file)
    except FileNotFoundError:
        records = []

    # Append the new record to the existing records
    records.append(data_without_source)

    # Write the updated records back to the file
    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(records, file, indent=4, ensure_ascii=False)

@app.route('/')
def home():
    # Load all data from mods.json and other.json
    mods_data = load_data('mods.json')
    other_data = load_data('other.json')
    all_data = mods_data + other_data
    return render_template('index.html', alldata=all_data)

@app.route('/create', methods=['GET', 'POST'])
def create_record():
    if request.method == 'POST':
        print("Form data:", request.form)  # Debug message to check form data

        # Extract the source from the form data
        source = request.form.get('source', None)

        

        if source is not None:
            categories_from_form = request.form.getlist('categories[]')
            # Extract additional categories from the other categories field
            other_categories = request.form.get('additional_categories').split(',')
            # Remove spaces before and after each category, and filter out empty strings
            categories_from_form = [category.strip() for category in categories_from_form if category.strip()]
            other_categories = [category.strip() for category in other_categories if category.strip()]


            
            # Create the new record without the 'source' key
            new_record = {
                "title": request.form['title'],
                "gameversion": request.form['gameversion'],
                "engine": request.form['engine'],
                "categories": request.form.getlist('categories'),
                "description": request.form['description'],
                "image": request.form['image'],
                "verified": True if request.form.get('verified') == 'on' else False,
                "author": request.form['author'],
                "completed": True if request.form.get('completed') == 'on' else False,
                "translation": request.form['translation'],
                "link": [link for link in request.form.getlist('link[]') if link.strip() != ''],  # Extract all link values from form
                "id": get_max_id(),
                "source": source  # Add the extracted source to the new record
            }
            updated_categories = categories_from_form + other_categories
    
            # Update the record with the combined categories
            new_record['categories'] = updated_categories

            print("New Record:", new_record)  # Debug message to check new record
            save_record(new_record)  # Save the new record with the correct source
            return redirect(url_for('home'))  # Redirect to the home page after creating the record
        else:
            print("Error: Source not found in form data")

    return render_template('index.html')





# Route to fetch categories for a specific item
@app.route('/fetch_item_categories/<item_id>')
def fetch_item_categories(item_id):
    # Load data from mods.json and other.json
    mods_data = load_data('mods.json')
    other_data = load_data('other.json')
    all_data = mods_data + other_data
    
    # Find the item with the matching ID
    for item in all_data:
        if item.get('id') == item_id:
            # Return the categories associated with the item as JSON response
            return jsonify(item.get('categories', []))
    
    # If item with the specified ID is not found, return an empty list
    return jsonify([])

# Route to fetch all categories from categories.json
@app.route('/fetch_all_categories')
def fetch_all_categories():
    try:
        # Load categories from the categories.json file
        with open('static/categories.json', 'r', encoding='utf-8') as categories_file:
            categories = json.load(categories_file)
        return jsonify(categories)
    except FileNotFoundError:
        return jsonify([])  # Return an empty list if categories.json file is not found






@app.route('/fetch_items')
def fetch_items():
    mods_data = load_data('mods.json')
    other_data = load_data('other.json')
    all_data = mods_data + other_data
    
    # Format data as JSON
    formatted_data = []
    for item in all_data:
        # Truncate the description if it's longer than 100 characters
        description = item.get('description', '')
        truncated_description = description[:100] + '...' if len(description) > 100 else description

        formatted_item = {
            'title': item.get('title', ''),
            'image': item.get('image', ''),
            'gameversion': item.get('gameversion', ''),
            'engine': item.get('engine', ''),
            'categories': item.get('categories', []),
            'author': item.get('author', ''),
            'description': truncated_description,
            'id': item.get('id', '')
        }
        formatted_data.append(formatted_item)
    
    return jsonify(formatted_data)


# Route to fetch an item by its ID
@app.route('/fetch_item_by_id/<item_id>')
def fetch_item_by_id(item_id):
    # Load data from mods.json and other.json
    mods_data = load_data('mods.json')
    other_data = load_data('other.json')
    all_data = mods_data + other_data
    
    # Search for the item with the matching ID
    for item in all_data:
        if item.get('id') == item_id:
            # Return the item data as JSON response, including all fields
            return jsonify(item)
    
    # If item with the specified ID is not found, return an error response
    return jsonify({'error': 'Item not found'}), 404


# Route to handle editing an item
@app.route('/edit', methods=['POST'])
def edit_record():
    if request.method == 'POST':
        # Print received data to the terminal
        print('Received data:', request.form)

        edit_id = request.form.get('editItemId')
        # Retrieve data from mods.json and other.json
        mods_data = load_data('mods.json')
        other_data = load_data('other.json')
        all_data = mods_data + other_data
        
        # Find the record with the matching id
        for record in all_data:
            if record.get('id') == edit_id:
                # Extract categories from the form
                categories_from_form = request.form.getlist('editCategories[]')
                # Extract additional categories from the other categories field
                other_categories = request.form.get('editOtherCategories').split(',')

                # Remove spaces before and after each category, and filter out empty strings
                categories_from_form = [category.strip() for category in categories_from_form if category.strip()]
                other_categories = [category.strip() for category in other_categories if category.strip()]

                # Update the record with the edited values
                updated_record = {
                    'title': request.form.get('editTitle'),
                    'gameversion': request.form.get('editGameVersion'),
                    'description': request.form.get('editDescription'),
                    'image': request.form.get('editImage'),
                    'author': request.form.get('editAuthor'),
                    'verified': True if request.form.get('editVerified') == 'on' else False,
                    'completed': True if request.form.get('editCompleted') == 'on' else False,
                    'link': [link for link in request.form.getlist('editLink[]') if link.strip() != '']
                }

                # Include translation and engine fields if they are not empty
                if request.form.get('editTranslation'):
                    updated_record['translation'] = request.form.get('editTranslation')
                if request.form.get('editEngine'):
                    updated_record['engine'] = request.form.get('editEngine')
                
                # Combine categories
                updated_categories = categories_from_form + other_categories

                # Update the record with the combined categories
                updated_record['categories'] = updated_categories

                # Update the record
                record.update(updated_record)
                break
        
        # Save the updated data back to the JSON file
        with open('mods.json', 'w', encoding='utf-8') as mods_file:
            json.dump(mods_data, mods_file, indent=4, ensure_ascii=False)

        with open('other.json', 'w', encoding='utf-8') as other_file:
            json.dump(other_data, other_file, indent=4, ensure_ascii=False)
        
        return redirect(url_for('home'))


# Function to update the item in the JSON file
def update_item_in_json_file(updated_item):
    filename = 'mods.json' if updated_item.get('source') == 'mods' else 'other.json'

    # Load existing records from the file
    try:
        with open(filename, 'r', encoding='utf-8') as file:
            records = json.load(file)
    except FileNotFoundError:
        return jsonify({'error': 'File not found'})

    # Update the corresponding item in the records list
    for record in records:
        if record['id'] == updated_item['id']:
            record.update(updated_item)
            break

    # Write the updated records back to the file
    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(records, file, indent=4, ensure_ascii=False)


# Route to handle the update item request
@app.route('/update_item', methods=['POST'])
def update_item():
    updated_item = request.json

    # Update the item in the JSON file
    update_item_in_json_file(updated_item)

    return jsonify({'message': 'Item updated successfully'}) 


if __name__ == '__main__':
    app.run(debug=True)
