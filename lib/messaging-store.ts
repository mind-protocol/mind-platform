/**
 * Temporary in-memory + file-backed store for the messaging system.
 *
 * Persists conversations and messages to `.data/messaging/` as JSON files.
 * This is an MVP implementation — will be replaced by a proper database.
 *
 * Structure:
 *   .data/messaging/conversations.json   — all conversations
 *   .data/messaging/messages/{id}.json   — messages per conversation
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import type {
  Conversation,
  Message,
  MessagePreview,
  Participant,
} from './messaging-types';

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const DATA_ROOT = path.join(process.cwd(), '.data', 'messaging');
const CONVERSATIONS_FILE = path.join(DATA_ROOT, 'conversations.json');
const MESSAGES_DIR = path.join(DATA_ROOT, 'messages');

function ensureDirs(): void {
  if (!existsSync(DATA_ROOT)) mkdirSync(DATA_ROOT, { recursive: true });
  if (!existsSync(MESSAGES_DIR)) mkdirSync(MESSAGES_DIR, { recursive: true });
}

// ---------------------------------------------------------------------------
// In-memory caches (loaded once from disk)
// ---------------------------------------------------------------------------

let conversations: Map<string, Conversation> = new Map();
let messages: Map<string, Message[]> = new Map(); // conversation_id → messages
let loaded = false;

// ---------------------------------------------------------------------------
// Persistence helpers
// ---------------------------------------------------------------------------

function loadFromDisk(): void {
  if (loaded) return;
  ensureDirs();

  if (existsSync(CONVERSATIONS_FILE)) {
    try {
      const raw = readFileSync(CONVERSATIONS_FILE, 'utf-8');
      const arr: Conversation[] = JSON.parse(raw);
      for (const c of arr) {
        conversations.set(c.id, c);
      }
    } catch {
      // Corrupt file — start fresh
      conversations = new Map();
    }
  }

  if (existsSync(MESSAGES_DIR)) {
    try {
      const { readdirSync } = require('fs') as typeof import('fs');
      const files = readdirSync(MESSAGES_DIR);
      for (const file of files) {
        if (!file.endsWith('.json')) continue;
        const convId = file.replace('.json', '');
        const raw = readFileSync(path.join(MESSAGES_DIR, file), 'utf-8');
        const msgs: Message[] = JSON.parse(raw);
        messages.set(convId, msgs);
      }
    } catch {
      // Corrupt — start fresh for messages
      messages = new Map();
    }
  }

  loaded = true;
}

function persistConversations(): void {
  ensureDirs();
  const arr = Array.from(conversations.values());
  writeFileSync(CONVERSATIONS_FILE, JSON.stringify(arr, null, 2), 'utf-8');
}

function persistMessages(conversationId: string): void {
  ensureDirs();
  const msgs = messages.get(conversationId) ?? [];
  const filePath = path.join(MESSAGES_DIR, `${conversationId}.json`);
  writeFileSync(filePath, JSON.stringify(msgs, null, 2), 'utf-8');
}

// ---------------------------------------------------------------------------
// Conversation operations
// ---------------------------------------------------------------------------

export function listConversations(
  userId: string,
  typeFilter?: 'dm' | 'group' | 'channel',
): Conversation[] {
  loadFromDisk();

  let result: Conversation[] = [];

  for (const conv of conversations.values()) {
    const isParticipant = conv.participants.some(
      (p) => p.citizen_id === userId,
    );
    if (!isParticipant) continue;
    if (typeFilter && conv.type !== typeFilter) continue;
    result.push(conv);
  }

  // Sort by last activity (updated_at DESC)
  result.sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );

  return result;
}

export function getConversation(id: string): Conversation | null {
  loadFromDisk();
  return conversations.get(id) ?? null;
}

export function createConversation(conv: Conversation): Conversation {
  loadFromDisk();
  conversations.set(conv.id, conv);
  messages.set(conv.id, []);
  persistConversations();
  persistMessages(conv.id);
  return conv;
}

export function updateConversation(
  id: string,
  updates: { name?: string; description?: string },
): Conversation | null {
  loadFromDisk();
  const conv = conversations.get(id);
  if (!conv) return null;

  if (updates.name !== undefined) conv.name = updates.name;
  if (updates.description !== undefined) conv.description = updates.description;
  conv.updated_at = new Date().toISOString();

  conversations.set(id, conv);
  persistConversations();
  return conv;
}

export function deleteConversation(id: string): boolean {
  loadFromDisk();
  const deleted = conversations.delete(id);
  messages.delete(id);
  if (deleted) {
    persistConversations();
    // Remove messages file
    const filePath = path.join(MESSAGES_DIR, `${id}.json`);
    try {
      const { unlinkSync } = require('fs') as typeof import('fs');
      if (existsSync(filePath)) unlinkSync(filePath);
    } catch {
      // Ignore cleanup errors
    }
  }
  return deleted;
}

export function removeParticipant(
  conversationId: string,
  citizenId: string,
): Conversation | null {
  loadFromDisk();
  const conv = conversations.get(conversationId);
  if (!conv) return null;

  conv.participants = conv.participants.filter(
    (p) => p.citizen_id !== citizenId,
  );
  conv.updated_at = new Date().toISOString();
  conversations.set(conversationId, conv);
  persistConversations();
  return conv;
}

export function addParticipants(
  conversationId: string,
  newParticipants: Participant[],
): Conversation | null {
  loadFromDisk();
  const conv = conversations.get(conversationId);
  if (!conv) return null;

  const existingIds = new Set(conv.participants.map((p) => p.citizen_id));
  for (const p of newParticipants) {
    if (!existingIds.has(p.citizen_id)) {
      conv.participants.push(p);
    }
  }

  conv.updated_at = new Date().toISOString();
  conversations.set(conversationId, conv);
  persistConversations();
  return conv;
}

// ---------------------------------------------------------------------------
// Message operations
// ---------------------------------------------------------------------------

export function getMessages(
  conversationId: string,
  options?: { before?: string; limit?: number },
): Message[] {
  loadFromDisk();
  let msgs = messages.get(conversationId) ?? [];

  if (options?.before) {
    const beforeTime = new Date(options.before).getTime();
    msgs = msgs.filter(
      (m) => new Date(m.created_at).getTime() < beforeTime,
    );
  }

  // Sort DESC by created_at
  msgs.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const limit = options?.limit ?? 50;
  return msgs.slice(0, limit);
}

export function addMessage(msg: Message): Message {
  loadFromDisk();

  const convMsgs = messages.get(msg.conversation_id) ?? [];
  convMsgs.push(msg);
  messages.set(msg.conversation_id, convMsgs);
  persistMessages(msg.conversation_id);

  // Update conversation's last_message and updated_at
  const conv = conversations.get(msg.conversation_id);
  if (conv) {
    const preview: MessagePreview = {
      id: msg.id,
      sender_name: msg.sender_name,
      content:
        msg.content.length > 100
          ? msg.content.slice(0, 100) + '…'
          : msg.content,
      created_at: msg.created_at,
    };
    conv.last_message = preview;
    conv.updated_at = msg.created_at;
    conversations.set(conv.id, conv);
    persistConversations();
  }

  return msg;
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export function searchMessages(
  userId: string,
  query: string,
  conversationId?: string,
): Array<Message & { conversation_name: string | null }> {
  loadFromDisk();

  const lowerQuery = query.toLowerCase();
  const results: Array<Message & { conversation_name: string | null }> = [];

  const conversationIds = conversationId
    ? [conversationId]
    : Array.from(conversations.entries())
        .filter(([, conv]) =>
          conv.participants.some((p) => p.citizen_id === userId),
        )
        .map(([id]) => id);

  for (const cId of conversationIds) {
    const conv = conversations.get(cId);
    if (!conv) continue;

    // Verify user is a participant (even if conversationId was given directly)
    const isParticipant = conv.participants.some(
      (p) => p.citizen_id === userId,
    );
    if (!isParticipant) continue;

    const msgs = messages.get(cId) ?? [];
    for (const msg of msgs) {
      if (msg.content.toLowerCase().includes(lowerQuery)) {
        results.push({ ...msg, conversation_name: conv.name });
      }
    }
  }

  // Sort by recency
  results.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return results.slice(0, 50);
}
