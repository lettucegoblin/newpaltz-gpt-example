# LLM Chat Example

A simple command-line application that lets you have a conversation with an LLM (Large Language Model) via an API.

## Project Overview

This application creates an interactive chat interface in your terminal where you can ask questions and get responses from an AI model. The application uses the Gemma 3 4B model by default.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- npm (comes with Node.js)
- API key for the LLM service

## Installation

1. Clone the repository or download the source code:

```bash
git clone <repository-url>
cd llmchatexample
```

2. Install the dependencies:

```bash
npm install
```

## Environment Variables Setup

This project uses a .env file to store sensitive information like API keys.

1. Create a .env file in the project root (a sample file is already included):

```
API_KEY=your_api_key_here
```

2. (Optional) Replace `your_api_key_here` with your actual API key.

### About .env Files

- The .env file is used to store environment variables that your application needs
- These variables are loaded into `process.env` using the `dotenv` package
- The .env file is included in .gitignore to prevent sensitive information from being committed to version control
- If you're sharing this code, others will need to create their own .env file with their own API key

## Running the Application

Start the chat application with:

```bash
node app.js
```

## Usage

1. After starting the application, you'll see a prompt where you can type your messages
2. Type your question or message and press Enter
3. The AI will respond in the terminal
4. Continue the conversation as long as you want
5. Type `exit` to quit the application

## Configuration

The application is configured to use:
- API URL: `https://gpt.hydra.newpaltz.edu/api/chat/completions`
- Model: `gemma3:4b`
- Temperature: 1.0 (controls randomness of responses), 0 is deterministic, 1 is more creative

You can modify these settings in the app.js file if needed.

## Notes

- The conversation history is maintained during the session
- The system is initialized with the role of an "educational AI tutor"

## License

ISC
