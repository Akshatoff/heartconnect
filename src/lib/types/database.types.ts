// src/lib/types/database.types.ts

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      messages: {
        Row: Message;
        Insert: MessageInsert;
        Update: MessageUpdate;
      };
      likes: {
        Row: Like;
        Insert: LikeInsert;
        Update: LikeUpdate;
      };
      matches: {
        Row: Match;
        Insert: MatchInsert;
        Update: MatchUpdate;
      };
      notifications: {
        Row: Notification;
        Insert: NotificationInsert;
        Update: NotificationUpdate;
      };
      profile_views: {
        Row: ProfileView;
        Insert: ProfileViewInsert;
        Update: ProfileViewUpdate;
      };
      admin_actions: {
        Row: AdminAction;
        Insert: AdminActionInsert;
        Update: AdminActionUpdate;
      };
      blocked_users: {
        Row: BlockedUser;
        Insert: BlockedUserInsert;
        Update: BlockedUserUpdate;
      };
      reports: {
        Row: Report;
        Insert: ReportInsert;
        Update: ReportUpdate;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_compatibility_score: {
        Args: {
          user1_id: string;
          user2_id: string;
        };
        Returns: number;
      };
      create_notification: {
        Args: {
          p_user_id: string;
          p_type: string;
          p_title: string;
          p_content: string;
          p_related_user_id?: string;
        };
        Returns: string;
      };
    };
    Enums: {
      gender_type: "male" | "female" | "other" | "prefer_not_to_say";
      message_type: "text" | "image";
      notification_type:
        | "match"
        | "message"
        | "like"
        | "profile_view"
        | "system";
      admin_action_type: "approve" | "reject" | "suspend" | "verify";
      report_status: "pending" | "reviewed" | "resolved" | "dismissed";
    };
  };
}

// Profile Types
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  gender: string | null;
  date_of_birth: string | null;
  location: string | null;
  city: string | null;
  state: string | null;
  avatar_url: string | null;
  about: string | null;
  interests: string[] | null;
  disability_type: string | null;
  disability_description: string | null;
  has_caregiver: boolean;
  caregiver_name: string | null;
  caregiver_contact: string | null;
  caregiver_relationship: string | null;
  is_approved: boolean;
  is_verified: boolean;
  is_active: boolean;
  is_online: boolean;
  last_seen: string | null;
  created_at: string;
  updated_at: string;
}

export type ProfileInsert = Omit<Profile, "created_at" | "updated_at">;
export type ProfileUpdate = Partial<ProfileInsert>;

// Message Types
export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: "text" | "image";
  read: boolean;
  created_at: string;
}

export type MessageInsert = Omit<Message, "id" | "created_at">;
export type MessageUpdate = Partial<Pick<Message, "read">>;

// Like Types
export interface Like {
  id: string;
  from_user_id: string;
  to_user_id: string;
  created_at: string;
}

export type LikeInsert = Omit<Like, "id" | "created_at">;
export type LikeUpdate = never;

// Match Types
export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
}

export type MatchInsert = Omit<Match, "id" | "created_at">;
export type MatchUpdate = never;

// Notification Types
export interface Notification {
  id: string;
  user_id: string;
  type: "match" | "message" | "like" | "profile_view" | "system";
  title: string;
  content: string;
  related_user_id: string | null;
  read: boolean;
  created_at: string;
}

export type NotificationInsert = Omit<Notification, "id" | "created_at">;
export type NotificationUpdate = Partial<Pick<Notification, "read">>;

// Profile View Types
export interface ProfileView {
  id: string;
  viewer_id: string;
  viewed_id: string;
  created_at: string;
}

export type ProfileViewInsert = Omit<ProfileView, "id" | "created_at">;
export type ProfileViewUpdate = never;

// Admin Action Types
export interface AdminAction {
  id: string;
  admin_id: string;
  action_type: "approve" | "reject" | "suspend" | "verify";
  target_user_id: string;
  reason: string | null;
  created_at: string;
}

export type AdminActionInsert = Omit<AdminAction, "id" | "created_at">;
export type AdminActionUpdate = never;

// Blocked User Types
export interface BlockedUser {
  id: string;
  blocker_id: string;
  blocked_id: string;
  reason: string | null;
  created_at: string;
}

export type BlockedUserInsert = Omit<BlockedUser, "id" | "created_at">;
export type BlockedUserUpdate = never;

// Report Types
export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  reason: string;
  description: string | null;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export type ReportInsert = Omit<
  Report,
  "id" | "created_at" | "reviewed_at" | "reviewed_by"
>;
export type ReportUpdate = Partial<
  Pick<Report, "status" | "reviewed_at" | "reviewed_by">
>;

// Helper Types
export interface ChatPreview {
  id: string;
  other_user_id: string;
  other_user_name: string;
  other_user_avatar: string | null;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export interface MatchWithProfile extends Match {
  profile: Profile;
  compatibility_score: number;
}

export interface MessageWithProfiles extends Message {
  sender: Profile;
  receiver: Profile;
}
