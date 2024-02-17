from flask import Flask, render_template, request, jsonify
import json
import urllib.parse
from jinja2 import Environment
from colorama import Fore, Style  # Додайте імпорт кольорових стилів
import sys
sys.stdout.reconfigure(encoding='utf-8')


app = Flask(__name__)
app.debug = True

# Зчитування даних з JSON файлу
data_file = "mods.json"  # Шлях до вашого JSON-файлу

def generate_formatted_id():
    data = read_data_from_file()  # Make sure data is defined or passed as an argument
    return f"{len(data) + 1:06d}"

def read_data_from_file():
    try:
        with open(data_file, 'r', encoding='utf-8') as file:
            data = json.load(file)
        return data
    except FileNotFoundError:
        return []

def save_data_to_file(data):
    with open(data_file, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

# Додавання фільтра urlparse до Jinja2
def urlparse(url):
    from urllib.parse import urlparse
    netloc = urlparse(url).netloc
    if netloc.startswith(b"www."):  # Convert the prefix to bytes
        netloc = netloc[4:]  # Видаляємо "www." з початку
    if netloc.endswith(b".com"):  # Convert the suffix to bytes
        netloc = netloc[:-4]  # Видаляємо ".com" з кінця
    return netloc.decode('utf-8')  # Decode the bytes back to a string


app.jinja_env.filters['urlparse'] = urlparse

@app.route('/')
def editor():
    data = read_data_from_file()
    return render_template('editor.html', data=data)

@app.route('/delete_card', methods=['POST'])
def delete_card_handler():
    data = request.get_json()
    card_id = data.get('id')  # Change 'title' to 'id'

    if card_id is not None:
        print(f'{Fore.YELLOW}Trying to delete card with id: {card_id}{Style.RESET_ALL}')
        data = read_data_from_file()
        for card in data:
            if 'id' in card and card['id'] == card_id:  # Check against 'id' instead of 'title'
                data.remove(card)
                save_data_to_file(data)
                print(f'{Fore.GREEN}Deleted card with id: {card_id}{Style.RESET_ALL}')
                return '', 204  # Successful response without a body

    return f'{Fore.RED}Card not found{Style.RESET_ALL}', 404

@app.route('/add_card', methods=['POST'])
def add_card():
    data = request.get_json()  # Отримання даних з POST-запиту у форматі JSON
    new_title = data.get('title')
    new_description = data.get('description')
    new_image = data.get('image')
    new_author = data.get('author')
    new_verified = data.get('verified')
    new_completed = data.get('completed')
    new_Link = data.get('Link')
    
    print(f'{Fore.GREEN}Додано нову картку: {new_title} з даними {data}{Style.RESET_ALL}')  # Повідомлення про додану картку у консоль

    if not new_title:
        return f'{Fore.RED}Помилка: Запис не має заголовку.{Style.RESET_ALL}', 400

    data = read_data_from_file()

    # Перевірка, чи не існує картки з таким же title
    for card in data:
        if card['title'] == new_title:
            return f'{Fore.RED}Картка з таким заголовком вже існує{Style.RESET_ALL}', 400

    # Генерування нового унікального 'id'
    new_id = generate_formatted_id()

    new_card = {
        'id': new_id,
        'title': new_title,
        'description': new_description,
        'image': new_image,
        'verified': new_verified,
        'author': new_author,
        'completed': new_completed,
        'Link': new_Link
    }

    data.append(new_card)
    save_data_to_file(data)
    return jsonify(new_card)

@app.route('/edit_card', methods=['POST'])
def edit_card():
    if request.content_type != 'application/json':
        return f'{Fore.RED}Непідтримуваний тип медіа{Style.RESET_ALL}', 415

    data = request.get_json()
    card_id = data.get('id')  # Change 'title' to 'id'

    if card_id is not None:
        print(f'{Fore.YELLOW}Стараємось оновити: {card_id}{Style.RESET_ALL}')
        
        print('Received data:', data)  # Print received data for debugging

        new_title = urllib.parse.unquote(data.get('newTitle', ''))
        new_description = urllib.parse.unquote(data.get('newDescription', ''))
        new_image = urllib.parse.unquote(data.get('newImage', ''))
        new_author = urllib.parse.unquote(data.get('newAuthor', ''))
        new_verified = data.get('newVerified', False)
        new_completed = data.get('newCompleted', False)
        new_Link = urllib.parse.unquote(data.get('newLink', ''))

        data = read_data_from_file()

        updated = False
        updated_card = None

        for card in data:
            if 'id' in card and card['id'] == card_id:
                card['title'] = new_title
                card['description'] = new_description
                card['image'] = new_image
                card['author'] = new_author
                card['verified'] = new_verified
                card['completed'] = new_completed
                card['Link'] = new_Link
                updated = True
                updated_card = card
                break

        if updated:
            save_data_to_file(data)
            print(f'{Fore.GREEN}Оновлено картку: {card_id} {new_title} {new_description} {new_image} {new_author} {new_verified} {new_completed} {new_Link}')
            return jsonify(updated_card)  # Повернення зміненої картки у відповіді
        else:
            return f'{Fore.RED}Картку не знайдено{Style.RESET_ALL}', 404
    else:
        return f'{Fore.RED}Некоректні дані{Style.RESET_ALL}', 400


if __name__ == '__main__':
    app.run(debug=True)
