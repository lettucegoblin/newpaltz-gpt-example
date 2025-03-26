const axios = require('axios');
const readline = require('readline');

require('dotenv').config();

const API_KEY =  process.env.API_KEY || 'APIKEYHERE'; 

const API_URL = 'https://gpt.hydra.newpaltz.edu/api/chat/completions';

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Initialize conversation history
const conversationHistory = [
  {
    role: 'system',
    content: 'You are an educational AI tutor. Provide clear, concise explanations of concepts.'
  }
];

// Function to make the API request
async function getChatCompletion(messages) {
  try {
    const response = await axios({
      method: 'post',
      url: API_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      data: {
        model: 'gemma3:4b',
        messages: messages,
        stream: true,
        options: {
          temperature: 1.0
        }
      },
      responseType: 'stream'
    });

    let fullResponse = '';
    
    response.data.on('data', (chunk) => {
      try {
        const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.substring(6); // Remove "data: " prefix
            
            if (jsonStr.trim() === '[DONE]') {
              return;
            }
            
            try {
              const json = JSON.parse(jsonStr);
              if (json.choices && json.choices[0].delta && json.choices[0].delta.content) {
                const content = json.choices[0].delta.content;
                process.stdout.write(content);
                fullResponse += content;
              }
            } catch (parseError) {
              // Skip invalid JSON
            }
          }
        }
      } catch (error) {
        console.error('Error processing chunk:', error.message);
      }
    });

    return new Promise((resolve) => {
      response.data.on('end', () => {
        console.log('\n');
        resolve(fullResponse);
      });

      response.data.on('error', (err) => {
        console.error('\nStream error:', err);
        resolve(fullResponse);
      });
    });
  } catch (error) {
    console.error('Error making request:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
    }
    return '';
  }
}

// Main conversation loop
async function startConversation() {
  console.log("Chat with llm (type 'exit' to quit)");
  console.log("--------------------------------------");
  
  askQuestion();
  
  function askQuestion() {
    rl.question('\nYou: ', async (input) => {
      if (input.toLowerCase() === 'exit') {
        console.log('Goodbye!');
        rl.close();
        return;
      }
      
      // Add user message to history
      conversationHistory.push({ role: 'user', content: input });
      
      console.log('\nAI: ');
      
      // Get response from LLM
      const aiResponse = await getChatCompletion(conversationHistory);
      
      // Add AI response to history
      conversationHistory.push({ role: 'assistant', content: aiResponse });
      
      // Continue the conversation
      askQuestion();
    });
  }
}

// Start the conversation
startConversation();