# OTC-trading-bot
#### [VIDEO-DEMO](https://drive.google.com/file/d/19NlzNRXUIQxrUdDXjKgW-eJh4rabk1yJ/view?usp=sharing)

### About The Project

**Voice-Operated OTC Trading Bot** – A voice-controlled bot that simulates Over-the-Counter cryptocurrency trading, assists users in digital asset trading with real time market data over different exchange Deribit, OKX, Binance, Bybit. (Bot doesnt place any actual trades)

## Folder Contents
- **index.html** : The frontend HTML file for the user interface.
- **main.js**: Javascript file that initializes the Bland.AI Web Client, fetches agent_id and session_token from the FastAPI backend, starts the voice conversation, and displays real-time transcripts and status updates in the UI.
- **app.py**: FastAPI backend interacts with the Bland.AI API to create a web agent using bland ai conversational pathway id.
- **.env**: This file stores Bland api keys
- **requirements.txt**: All python libraries used for this project are listed here.


## Run locally
1. Create a [Bland ai account](https://www.bland.ai/) , generate api key and copy it.
2. Clone this repo: run `git clone https://github.com/Unnati-60/OTC-trading-bot` or optionally download the zip file
3. Paste your bland api key in .env
4. Create virtual environment using this command ` python -m venv venv` and activate with `venv\Scripts\activate`
5. Install dependencies using `pip install -r requirements.txt`
6. Run backend with`uvicorn app:app --reload`
7. Open index.html in browser 
8. Click start conversation button to start the bot.

## Prerequisites
- Python 3.9+
