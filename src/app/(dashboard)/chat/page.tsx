"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, Search, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface ChatPreview {
  id: string;
  other_user_id: string;
  other_user_name: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  avatar_url?: string;
}

export default function ChatPage() {
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // This is a simplified version - you'd need proper message tables
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          *,
          sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url),
          receiver:profiles!messages_receiver_id_fkey(id, full_name, avatar_url)
        `,
        )
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false })
        .limit(50);

      // Group messages by conversation
      const chatMap = new Map<string, ChatPreview>();

      data?.forEach((message: any) => {
        const otherId =
          message.sender_id === user.id
            ? message.receiver_id
            : message.sender_id;
        const otherUser =
          message.sender_id === user.id ? message.receiver : message.sender;

        if (!chatMap.has(otherId)) {
          chatMap.set(otherId, {
            id: otherId,
            other_user_id: otherId,
            other_user_name: otherUser.full_name,
            last_message: message.content,
            last_message_time: message.created_at,
            unread_count:
              message.receiver_id === user.id && !message.read ? 1 : 0,
            avatar_url: otherUser.avatar_url,
          });
        }
      });

      setChats(Array.from(chatMap.values()));
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChats = chats.filter((chat) =>
    chat.other_user_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Chat List */}
        <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
          {filteredChats.length === 0 ? (
            <div className="p-12 text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No conversations yet
              </h3>
              <p className="text-gray-600 mb-4">
                Start connecting with matches to begin chatting
              </p>
              <Link
                href="/matches"
                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Find Matches
              </Link>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <Link
                key={chat.id}
                href={`/chat/${chat.other_user_id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold">
                    {chat.avatar_url ? (
                      <img
                        src={chat.avatar_url}
                        alt={chat.other_user_name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      chat.other_user_name.charAt(0)
                    )}
                  </div>
                  {chat.unread_count > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {chat.unread_count}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {chat.other_user_name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(chat.last_message_time), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {chat.last_message}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
