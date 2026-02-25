import { create } from 'zustand';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  message_id: string;
  sender?: string;
  sender_id?: string;
  page_url?: string;
  wallet?: string;
  /** Read status: sending → sent → responded */
  status?: 'sending' | 'sent' | 'responded';
}

interface ChatState {
  isOpen: boolean;
  threadId: string;
  messages: ChatMessage[];
  isSending: boolean;
  inputText: string;
  unreadCount: number;
  walletAddress: string | null;
  connectionStatus: 'connected' | 'disconnected' | 'error';
  /** Timestamp of last received message — used for incremental polling */
  lastPollTimestamp: string | null;
}

interface ChatActions {
  toggleChat: () => void;
  setOpen: (open: boolean) => void;
  setInputText: (text: string) => void;
  setWalletAddress: (addr: string | null) => void;
  initThread: () => void;
  sendMessage: (content: string, pageUrl?: string, screenshot?: string) => Promise<void>;
  pollMessages: () => Promise<void>;
  clearUnread: () => void;
}

type ChatStore = ChatState & ChatActions;

const THREAD_KEY = 'mind_chat_thread_id';

function getOrCreateThreadId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem(THREAD_KEY);
  if (!id) {
    id = 'web_' + Math.random().toString(36).slice(2, 14);
    localStorage.setItem(THREAD_KEY, id);
  }
  return id;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  // State
  isOpen: true,
  threadId: '',
  messages: [],
  isSending: false,
  inputText: '',
  unreadCount: 0,
  walletAddress: null,
  connectionStatus: 'connected',
  lastPollTimestamp: null,

  // Actions
  toggleChat: () => {
    const wasOpen = get().isOpen;
    set({ isOpen: !wasOpen });
    if (!wasOpen) {
      set({ unreadCount: 0 });
    }
  },

  setOpen: (open) => {
    set({ isOpen: open });
    if (open) set({ unreadCount: 0 });
  },

  setInputText: (text) => set({ inputText: text }),

  setWalletAddress: (addr) => set({ walletAddress: addr }),

  initThread: () => {
    const threadId = getOrCreateThreadId();
    set({ threadId });
  },

  sendMessage: async (content, pageUrl, screenshot) => {
    const { threadId, walletAddress, messages } = get();
    if (!content.trim() || !threadId) return;

    const optimisticMsg: ChatMessage = {
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      message_id: `local_${Date.now()}`,
      page_url: pageUrl,
      status: 'sending',
    };

    set({ isSending: true, messages: [...messages, optimisticMsg], inputText: '' });

    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          thread_id: threadId,
          content,
          sender_id: walletAddress || threadId,
          wallet: walletAddress || undefined,
          page_url: pageUrl,
          screenshot: screenshot || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update optimistic message with server message_id and mark as sent
        set((state) => ({
          isSending: false,
          messages: state.messages.map((m) =>
            m.message_id === optimisticMsg.message_id
              ? { ...m, message_id: data.message_id || m.message_id, status: 'sent' as const }
              : m
          ),
        }));
      } else {
        set({ isSending: false });
      }
    } catch {
      set((state) => ({
        isSending: false,
        connectionStatus: 'error',
        messages: state.messages.map((m) =>
          m.message_id === optimisticMsg.message_id
            ? { ...m, status: 'sent' as const }
            : m
        ),
      }));
    }
  },

  pollMessages: async () => {
    const { threadId, lastPollTimestamp, isOpen } = get();
    if (!threadId) return;

    try {
      const params = new URLSearchParams({ thread_id: threadId });
      if (lastPollTimestamp) params.set('since', lastPollTimestamp);

      const res = await fetch(`/api/chat/messages?${params}`);
      if (!res.ok) {
        set({ connectionStatus: 'error' });
        return;
      }

      const data = await res.json();
      const serverMsgs: ChatMessage[] = data.messages || [];

      if (serverMsgs.length === 0) {
        set({ connectionStatus: 'connected' });
        return;
      }

      set((state) => {
        // Build a set of existing message_ids for dedup
        const existingIds = new Set(state.messages.map((m) => m.message_id));
        // Also match local optimistic messages by role+content
        const localContents = new Set(
          state.messages.filter((m) => m.message_id.startsWith('local_')).map((m) => `${m.role}:${m.content}`)
        );

        const newMsgs: ChatMessage[] = [];
        let newAssistant = 0;

        for (const sm of serverMsgs) {
          if (existingIds.has(sm.message_id)) continue;
          // Skip if it matches an optimistic message
          if (sm.role === 'user' && localContents.has(`user:${sm.content}`)) {
            // Replace the optimistic message with server version
            const idx = state.messages.findIndex(
              (m) => m.message_id.startsWith('local_') && m.content === sm.content
            );
            if (idx !== -1) {
              state.messages[idx] = { ...sm, status: 'sent' };
              existingIds.add(sm.message_id);
              continue;
            }
          }
          newMsgs.push(sm);
          if (sm.role === 'assistant') newAssistant++;
        }

        // Mark user messages as 'responded' if we got an assistant reply
        let updatedMessages = [...state.messages];
        if (newAssistant > 0) {
          updatedMessages = updatedMessages.map((m) =>
            m.role === 'user' && m.status === 'sent' ? { ...m, status: 'responded' as const } : m
          );
        }

        const allMessages = [...updatedMessages, ...newMsgs];
        const latestTs = serverMsgs[serverMsgs.length - 1]?.timestamp || state.lastPollTimestamp;

        return {
          messages: allMessages,
          lastPollTimestamp: latestTs,
          connectionStatus: 'connected' as const,
          unreadCount: isOpen ? 0 : state.unreadCount + newAssistant,
        };
      });
    } catch {
      set({ connectionStatus: 'error' });
    }
  },

  clearUnread: () => set({ unreadCount: 0 }),
}));
