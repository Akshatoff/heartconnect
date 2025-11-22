// src/app/messages/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import {
  ArrowLeft,
  Send,
  Search,
  MoreVertical,
  Loader,
  MessageCircle,
  User,
  Check,
  CheckCheck,
  Image as ImageIcon,
  Smile,
  Paperclip,
} from "lucide-react";

type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
};

type Conversation = {
  id: string;
  user1Id: string;
  user2Id: string;
  user1: {
    id: string;
    profile: {
      firstName: string;
      lastName: string;
      age: number;
      city: string;
    };
  };
  user2: {
    id: string;
    profile: {
      firstName: string;
      lastName: string;
      age: number;
      city: string;
    };
  };
  messages: Message[];
  createdAt: string;
};

type ConversationWithLastMessage = Conversation & {
  otherUser: {
    id: string;
    profile: {
      firstName: string;
      lastName: string;
      age: number;
      city: string;
    };
  };
  lastMessage?: Message;
  unreadCount: number;
};

export default function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [conversations, setConversations] = useState<ConversationWithLastMessage[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationWithLastMessage | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [showMobileList, setShowMobileList] = useState(true);

  useEffect(() => {
    loadConversations();

    // Setup real-time subscription
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
        },
        (payload) => {
          handleNewMessage(payload.new as Message);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    // Check if there's a userId in search params (from matches page)
    const userId = searchParams.get("userId");
    if (userId && conversations.length > 0) {
      const conversation = conversations.find(
        (conv) => conv.otherUser.id === userId
      );
      if (conversation) {
        selectConversation(conversation);
      }
    }
  }, [searchParams, conversations]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/login");
        return;
      }

      setCurrentUserId(user.id);

      const response = await fetch(`/api/conversations?supabaseId=${user.id}`);

      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = async (conversation: ConversationWithLastMessage) => {
    setSelectedConversation(conversation);
    setShowMobileList(false);
    await loadMessages(conversation.id);
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const response = await fetch(
        `/api/messages/list?conversationId=${conversationId}&supabaseId=${user.id}`
      );

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageInput.trim() || !selectedConversation || sendingMessage) return;

    setSendingMessage(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supabaseId: user.id,
          conversationId: selectedConversation.id,
          receiverId: selectedConversation.otherUser.id,
          content: messageInput.trim(),
        }),
      });

      if (response.ok) {
        setMessageInput("");
        messageInputRef.current?.focus();
        // Message will be added via real-time subscription
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleNewMessage = (newMessage: Message) => {
    // Update messages if the conversation is selected
    if (selectedConversation?.id === newMessage.conversationId) {
      setMessages((prev) => [...prev, newMessage]);
    }

    // Update last message in conversations list
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === newMessage.conversationId
          ? {
              ...conv,
              lastMessage: newMessage,
              unreadCount:
                selectedConversation?.id === newMessage.conversationId
                  ? conv.unreadCount
                  : conv.unreadCount + 1,
            }
          : conv
      )
    );
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      conv.otherUser.profile.firstName.toLowerCase().includes(searchLower) ||
      conv.otherUser.profile.lastName.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center pt-20">
          <div className="text-center">
            <Loader className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading messages...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden" style={{ height: "calc(100vh - 150px)" }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
              {/* Conversations List */}
              <div
                className={`lg:col-span-1 border-r border-gray-200 flex flex-col ${
                  showMobileList ? "block" : "hidden lg:block"
                }`}
              >
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Conversations */}
                <div className="flex-1 overflow-y-auto">
                  {filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                      <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No conversations yet
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Start matching with people to begin conversations
                      </p>
                      <button
                        onClick={() => router.push("/matches/discover")}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Find Matches
                      </button>
                    </div>
                  ) : (
                    <div>
                      {filteredConversations.map((conversation) => (
                        <button
                          key={conversation.id}
                          onClick={() => selectConversation(conversation)}
                          className={`w-full p-4 border-b border-gray-100 hover:bg-purple-50 transition-colors text-left ${
                            selectedConversation?.id === conversation.id
                              ? "bg-purple-50"
                              : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Avatar */}
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                              {conversation.otherUser.profile.firstName[0]}
                              {conversation.otherUser.profile.lastName[0]}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold text-gray-900 truncate">
                                  {conversation.otherUser.profile.firstName}{" "}
                                  {conversation.otherUser.profile.lastName}
                                </h3>
                                {conversation.lastMessage && (
                                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                    {formatTime(conversation.lastMessage.createdAt)}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600 truncate">
                                  {conversation.lastMessage?.content ||
                                    "Start a conversation"}
                                </p>
                                {conversation.unreadCount > 0 && (
                                  <span className="ml-2 bg-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                                    {conversation.unreadCount}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Area */}
              <div
                className={`lg:col-span-2 flex flex-col ${
                  showMobileList ? "hidden lg:flex" : "flex"
                }`}
              >
                {selectedConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setShowMobileList(true)}
                          className="lg:hidden text-gray-600 hover:text-purple-600"
                        >
                          <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                          {selectedConversation.otherUser.profile.firstName[0]}
                          {selectedConversation.otherUser.profile.lastName[0]}
                        </div>
                        <div>
                          <h2 className="font-semibold text-gray-900">
                            {selectedConversation.otherUser.profile.firstName}{" "}
                            {selectedConversation.otherUser.profile.lastName}
                          </h2>
                          <p className="text-sm text-gray-600">
                            {selectedConversation.otherUser.profile.city}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          router.push(`/profile/${selectedConversation.otherUser.id}`)
                        }
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <User className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                      {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-600">
                              No messages yet. Say hello! 👋
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          {messages.map((message, index) => {
                            const isOwn = message.senderId === currentUserId;
                            const showDate =
                              index === 0 ||
                              new Date(messages[index - 1].createdAt).toDateString() !==
                                new Date(message.createdAt).toDateString();

                            return (
                              <div key={message.id}>
                                {showDate && (
                                  <div className="flex justify-center my-4">
                                    <span className="bg-white px-4 py-1 rounded-full text-xs text-gray-600 shadow-sm">
                                      {new Date(message.createdAt).toLocaleDateString(
                                        "en-US",
                                        {
                                          month: "long",
                                          day: "numeric",
                                          year: "numeric",
                                        }
                                      )}
                                    </span>
                                  </div>
                                )}
                                <div
                                  className={`flex ${
                                    isOwn ? "justify-end" : "justify-start"
                                  }`}
                                >
                                  <div
                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                      isOwn
                                        ? "bg-purple-600 text-white rounded-br-sm"
                                        : "bg-white text-gray-900 rounded-bl-sm shadow-sm"
                                    }`}
                                  >
                                    <p className="break-words">{message.content}</p>
                                    <div
                                      className={`flex items-center gap-1 mt-1 ${
                                        isOwn ? "justify-end" : "justify-start"
                                      }`}
                                    >
                                      <span
                                        className={`text-xs ${
                                          isOwn
                                            ? "text-purple-200"
                                            : "text-gray-500"
                                        }`}
                                      >
                                        {new Date(
                                          message.createdAt
                                        ).toLocaleTimeString("en-US", {
                                          hour: "numeric",
                                          minute: "2-digit",
                                        })}
                                      </span>
                                      {isOwn && (
                                        <CheckCheck className="w-3 h-3 text-purple-200" />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          <div ref={messagesEndRef} />
                        </>
                      )}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-200 bg-white">
                      <form onSubmit={sendMessage} className="flex gap-2">
                        <input
                          ref={messageInputRef}
                          type="text"
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          disabled={sendingMessage}
                        />
                        <button
                          type="submit"
                          disabled={!messageInput.trim() || sendingMessage}
                          className="bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {sendingMessage ? (
                            <Loader className="w-6 h-6 animate-spin" />
                          ) : (
                            <Send className="w-6 h-6" />
                          )}
                        </button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-50">
                    <div className="text-center">
                      <MessageCircle className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Select a conversation
                      </h3>
                      <p className="text-gray-600">
                        Choose a conversation from the list to start messaging
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
