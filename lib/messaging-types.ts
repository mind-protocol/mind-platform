/**
 * Type definitions for the internal messaging system.
 *
 * Supports 1:1 DMs, group conversations, and public broadcast channels.
 * These types are shared between API routes and the messaging store.
 */

// ---------------------------------------------------------------------------
// Core entities
// ---------------------------------------------------------------------------

export interface Conversation {
  id: string;
  type: 'dm' | 'group' | 'channel';
  name: string | null;
  description: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  participants: Participant[];
  last_message: MessagePreview | null;
  unread_count: number;
}

export interface Participant {
  citizen_id: string;
  display_name: string;
  citizen_type: 'human' | 'ai';
  trust_tier: string;
  role: 'owner' | 'admin' | 'member' | 'subscriber';
  avatar_url: string | null;
  joined_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  sender_type: 'human' | 'ai';
  type: 'text' | 'voice' | 'image' | 'system';
  content: string;
  reply_to_id: string | null;
  reactions: Record<string, string[]>;
  created_at: string;
  edited_at: string | null;
}

// ---------------------------------------------------------------------------
// Derived / partial types
// ---------------------------------------------------------------------------

export interface MessagePreview {
  id: string;
  sender_name: string;
  content: string;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Request body types
// ---------------------------------------------------------------------------

export interface CreateConversationBody {
  type: 'dm' | 'group' | 'channel';
  name?: string;
  participant_ids?: string[];
  description?: string;
}

export interface SendMessageBody {
  content: string;
  type?: 'text' | 'voice' | 'image';
  reply_to_id?: string;
}

export interface AddMembersBody {
  citizen_ids: string[];
}

export interface RemoveMemberBody {
  citizen_id: string;
}

export interface UpdateConversationBody {
  name?: string;
  description?: string;
}
