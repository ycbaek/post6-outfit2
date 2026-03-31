# Travel Outfit Recommender

AI-powered outfit recommendation app that suggests what to wear based on your photo, body info, and travel destination.

## How It Works

1. Upload your photo (JPG or PNG)
2. Enter your weight, height, destination city, and travel date
3. The app uses OpenAI's `gpt-image-1` image edit API to generate a recommended outfit
4. View your original photo side-by-side with the AI-generated outfit suggestion

The AI considers the destination's weather, culture, and typical activities when recommending outfits.

## Setup

1. Clone this repository
2. Open `index.html` in your browser
3. Enter your [OpenAI API key](https://platform.openai.com/api-keys)
4. Upload a photo and fill in your details

No server or build step required — runs entirely in the browser.

## Tech Stack

- HTML / CSS / JavaScript (vanilla)
- OpenAI Images Edit API (`gpt-image-1`)
