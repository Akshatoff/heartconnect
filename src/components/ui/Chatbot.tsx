"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Bot,
  User,
  Volume2,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AccessibilityChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm your HeartConnect assistant. I can help you with:\n\n• Finding matches\n• Setting up your profile\n• Understanding features\n• Accessibility options\n• Safety tips\n\nHow can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const getResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Match finding
    if (lowerMessage.includes("match") || lowerMessage.includes("find")) {
      return "To find matches:\n\n1. Go to the 'Find Matches' section\n2. Browse through profiles\n3. Like profiles you're interested in\n4. When both users like each other, it's a match!\n5. You can then start chatting\n\nYour matches are based on location, interests, and compatibility. You can also use filters to refine your search.";
    }

    // Profile help
    if (
      lowerMessage.includes("profile") ||
      lowerMessage.includes("edit") ||
      lowerMessage.includes("complete")
    ) {
      return "To complete your profile:\n\n1. Click 'Profile' in the menu\n2. Click 'Edit Profile'\n3. Fill in all sections:\n   • Personal information\n   • Location\n   • About yourself\n   • Interests & hobbies\n   • Caregiver info (optional)\n\nA complete profile gets more views and better matches! Aim for at least 80% completion.";
    }

    // Messaging
    if (lowerMessage.includes("message") || lowerMessage.includes("chat")) {
      return "To send messages:\n\n1. You can only message people you've matched with\n2. Go to the 'Messages' section\n3. Click on a conversation or start a new one\n4. Type your message and press Send\n\nTip: Be respectful and genuine in your conversations. Take time to get to know each other!";
    }

    // Safety
    if (
      lowerMessage.includes("safe") ||
      lowerMessage.includes("security") ||
      lowerMessage.includes("report")
    ) {
      return "Your safety is our priority:\n\n• All profiles are manually reviewed\n• You can report inappropriate behavior\n• Block users who make you uncomfortable\n• Never share personal info too quickly\n• Meet in public places for first meetings\n• Tell someone where you're going\n\nTo report a profile, click the flag icon on their profile page.";
    }

    // Accessibility
    if (
      lowerMessage.includes("accessibility") ||
      lowerMessage.includes("font") ||
      lowerMessage.includes("voice")
    ) {
      return "We offer several accessibility features:\n\n• Font size adjustment (A, A+, A++)\n• High contrast mode\n• Reduced motion\n• Voice input for typing\n• Screen reader support\n\nClick the lightning bolt icon (⚡) in the bottom right corner to access these features.";
    }

    // Caregiver
    if (
      lowerMessage.includes("caregiver") ||
      lowerMessage.includes("support")
    ) {
      return "Caregiver features:\n\n• Caregivers can monitor activity\n• View matches and conversations\n• Receive notifications\n• Help manage the profile\n\nTo add a caregiver, go to Profile → Edit Profile → Caregiver Information section.";
    }

    // Approval
    if (
      lowerMessage.includes("approval") ||
      lowerMessage.includes("pending") ||
      lowerMessage.includes("verify")
    ) {
      return "Profile approval process:\n\n1. Submit your complete profile\n2. Our team reviews it (usually 24-48 hours)\n3. You'll receive an email notification\n4. Once approved, you can start matching\n\nWe review profiles to ensure everyone's safety and authenticity.";
    }

    // Default response
    return "I can help you with:\n\n• Finding and browsing matches\n• Setting up and completing your profile\n• Sending messages and chatting\n• Understanding safety features\n• Using accessibility options\n• Adding caregiver support\n• Profile approval process\n\nPlease ask me about any of these topics, or let me know how else I can help!";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = getResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setLoading(false);
    }, 800);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 z-40 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all"
          aria-label="Open chat assistant"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">HeartConnect Assistant</h3>
                <p className="text-xs text-blue-100">Here to help 24/7</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-blue-500 rounded-lg transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-blue-600" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-white text-gray-900 shadow-sm rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line leading-relaxed">
                    {message.content}
                  </p>
                  {message.role === "assistant" && (
                    <button
                      onClick={() => speak(message.content)}
                      className="mt-2 p-1 hover:bg-gray-100 rounded transition-colors"
                      aria-label="Read aloud"
                      title="Read aloud"
                    >
                      <Volume2 className="w-4 h-4 text-gray-600" />
                    </button>
                  )}
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 bg-white border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setInput("How do I find matches?")}
                className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
              >
                Find Matches
              </button>
              <button
                onClick={() => setInput("How do I complete my profile?")}
                className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
              >
                Edit Profile
              </button>
              <button
                onClick={() => setInput("Safety tips")}
                className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
              >
                Safety Tips
              </button>
            </div>
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-4 bg-white border-t border-gray-200"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
