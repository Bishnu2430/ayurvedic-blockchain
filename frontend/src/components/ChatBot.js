// src/components/ChatBot.js
import React, { useState } from "react";
import { Send, MessageCircle, X } from "lucide-react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I’m your Ayurvedic Assistant. Ask me about herbs, products, or wellness tips.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages([...messages, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/gemini/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await response.json();

      const botMessage = {
        sender: "bot",
        text: data.response || "Sorry, I couldn’t get an answer.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition z-50"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-sage-200 flex flex-col z-50">
          {/* Header */}
          <div className="bg-green-600 text-white p-4 rounded-t-xl flex justify-between items-center">
            <h2 className="text-lg font-semibold">Ayurvedic Assistant</h2>
            <button onClick={toggleChat} className="hover:text-gray-200">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 max-h-80 scrollbar-thin scrollbar-thumb-sage-300 scrollbar-track-sage-100">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg text-sm whitespace-pre-line ${
                  msg.sender === "user"
                    ? "bg-green-100 self-end text-right"
                    : "bg-gray-100 text-left"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="text-gray-500 text-sm">💭 Thinking...</div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-sage-200 flex items-center">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me about herbs, remedies..."
              rows={1}
              className="flex-1 p-2 border border-sage-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="ml-2 bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
