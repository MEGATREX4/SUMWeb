# SUMWeb



webpage - https://sumtranslate.netlify.app/

We are a group of amateurs who are passionate about Minecraft and, of course, other games. Our mission is to make these games available to the Ukrainian audience by translating various mods or games, programs.<br>
We believe that the Ukrainian language should be accessible to all players, so we devote a lot of time and effort to translation to make this possible.<br>
You can follow our process in the community's social media, where we post links to Crowdin.<br>
And most importantly, you can join the translation process with us! Join our community!<br>

Used tools, libraries and languages:<br>
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white)
![JSQ](https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white)
![HTML](https://img.shields.io/badge/HTML-239120?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-239120?&style=for-the-badge&logo=css3&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
<br>
Hosted by Netlify <br> [![Netlify Status](https://api.netlify.com/api/v1/badges/f6a068e4-aeef-4a28-a9ac-350b4e1e03ba/deploy-status)](https://app.netlify.com/sites/sumtranslate/deploys)

### our social media
* [![Mono - Bank](https://img.shields.io/static/v1?label=Mono&message=Bank&color=2ea44f)](https://send.monobank.ua/jar/3eoWaEfxde)
* [<img src="https://img.shields.io/badge/chainlink-375BD2?style=for-the-badge&logo=chainlink&logoColor=white">](https://donatello.to/MEGATREX4)
* [mastadon](https://mastodon.social/@SUMTranslate)
* [<img src="https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white">](https://t.me/SUMTranslate)
* [blue sky](https://bsky.app/profile/sumtranslate.bsky.social)
* [<img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white">](https://twitter.com/SUMTranslate)
* [<img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white">](https://www.instagram.com/sumtranslate/)
* [<img src="https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white">](https://www.youtube.com/@sumtranslate)
* [<img src="https://img.shields.io/badge/TikTok-000000?style=for-the-badge&logo=tiktok&logoColor=white">]([https://link-to-your-URL/](https://www.tiktok.com/@sumtranslate))

**SUM is not commercial**
**work exclusively at the expense of donors**

## Contributing

Contributions to enhance the functionality or improve the code structure are welcome. Please follow the standard GitHub workflow:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make changes and commit them (`git commit -am 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a new Pull Request.

## License

This project is licensed under the CC0-1.0 license.

## Contact

For any questions or suggestions, feel free to contact the author:

[SUM email](mailto:sumtranslate@outlook.com) - [My GitHub Profile](https://github.com/SKZGx)

# Display Translations Function

## Description

This JavaScript function, `displayTranslations`, is designed to display translation items on a web page. It takes data, the current page number, and the number of items per page as input parameters, and dynamically creates HTML elements to represent each translation item.


## Usage

To use the `displayTranslations` function:

1. Include the JavaScript code in your project.
2. Call the function with the appropriate parameters:
   ```javascript
   displayTranslations(data, currentPage, itemsPerPage);
   ```
   - `data`: An array containing the translation items.
   - `currentPage`: The current page number for pagination.
   - `itemsPerPage`: The number of items to display per page.

## Features

- Dynamically creates HTML elements for each translation item.
- Supports pagination to display a specified number of items per page.
- Handles different properties of translation items such as title, description, author, image, status, and more.

## Example

```javascript
// Sample usage of the displayTranslations function
const translationData = [
    { id: 1, title: 'Translation 1', description: 'Description of Translation 1', author: 'Author 1', image: 'image1.jpg', status: { progress: 'in-progress', verified: true } },
    { id: 2, title: 'Translation 2', description: 'Description of Translation 2', author: 'Author 2', image: 'image2.jpg', status: { completed: 'completed', verified: false } },
    // Add more translation items as needed
];

// Display translations with 5 items per page on page 1
displayTranslations(translationData, 1, 5);
```


### Function: showAllTranslations()

This function is called to display all translations by default when the page loads.

### Function: loadAndDisplayData(tab)

- This function loads and displays data based on the specified tab.
- It sets the number of items to display per page (`itemsPerPage`) to 15.
- Depending on the `tab` parameter, it assigns data to be displayed from different sources such as `gamesData`, `minecraftData`, etc.
- It determines the start and end index for pagination.
- It adjusts the visibility of the "Show More" button based on the number of items to display.
- Finally, it calls the `displayTranslations()` function to display the selected portion of data.

### Async Function: countElementsInJSONFile(filePath)

- This asynchronous function counts the number of elements in a JSON file specified by `filePath`.
- It uses `fetch()` to get the JSON file and `response.json()` to parse it.
- It returns the length of the array in the JSON file or 0 if there's an error.

### Async Function: countTotalTranslations()

- This function counts the total number of translations by summing counts from different JSON files (`mods.json` and `other.json`).
- It calls `countElementsInJSONFile()` for each JSON file, awaits their results, and then calculates the total translations.
- It updates the total count in the specified element on the webpage.

### Function: loadOfficialData()

- This function loads official data from specified JSON files.
- It fetches data from each official data file, merges them, and filters out items that are verified.
- It updates the visibility of the "Show More" button and displays official translations.

### Function: loadAndDisplayNotCompletedData()

- This function loads and displays translations that are not completed.
- It fetches data from specified JSON files, merges them, and filters out items that are not completed.
- It updates the visibility of the "Show More" button and displays not completed translations.

### Function: loadAndDisplayFromMembersTranslations()

- This function loads and displays translations contributed by members.
- It fetches data from specified JSON files, merges them, and filters out items contributed by the community.
- It updates the visibility of the "Show More" button and displays translations from members.
- It sets the active tab to "frommembers" and updates the URL with the tab parameter.






