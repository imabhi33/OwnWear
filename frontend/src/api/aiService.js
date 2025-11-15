import axios from 'axios';

const API_URL = 'http://localhost:5000/api/ai';

// Send a chat message to the support (no authentication required)
export const sendChatMessage = async (prompt) => {
  try {
    console.log('Sending chat message:', prompt);
    const response = await axios.post(
      `${API_URL}/chat`,
      { prompt },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Chat response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Chat API error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Error sending message';
    throw errorMessage;
  }
};