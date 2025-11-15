import React, { useState, useRef, useEffect } from 'react';
import { ChatBubbleLeftIcon, XMarkIcon, UserIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { sendChatMessage } from '../api/aiService';
import Toast from './Toast';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Clear messages when chat is closed
  const handleToggleChat = () => {
    if (isOpen) {
      // Closing the chat - clear all messages
      setMessages([]);
      setMessage('');
      setError(null);
    }
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    setError(null);

    try {
      setIsTyping(true);
      const response = await sendChatMessage(userMessage);
      console.log('Chat response:', response);
      setMessages(prev => [...prev, { role: 'assistant', content: response.message }]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg = typeof err === 'string' ? err : (err.message || 'Failed to get response');
      setError(errorMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      <button
        onClick={handleToggleChat}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full p-3 shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105"
        style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <ChatBubbleLeftIcon className="h-6 w-6" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center">
                <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                Customer Support
              </h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Online</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-800 border border-blue-200'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex items-center mb-2 pb-2 border-b border-blue-200">
                      <UserIcon className="h-4 w-4 text-blue-600 mr-1" />
                      <span className="text-xs font-medium text-blue-600">Support Agent</span>
                    </div>
                  )}
                  <div className="text-sm whitespace-pre-line">{msg.content}</div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 shadow-sm border border-blue-200">
                  <div className="flex items-center mb-2 pb-2 border-b border-blue-200">
                    <UserIcon className="h-4 w-4 text-blue-600 mr-1" />
                    <span className="text-xs font-medium text-blue-600">Support Agent</span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-75" />
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-150" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help you today?"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg px-4 py-2 hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500 text-center">
              We typically respond within a few seconds
            </div>
          </form>
        </div>
      )}

      {/* Error Toast */}
      {error && <Toast message={error} type="error" />}
    </div>
  );
};

export default ChatWidget;