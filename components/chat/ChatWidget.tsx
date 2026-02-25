'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useChatStore, type ChatMessage } from '@/lib/chat/store';
import { usePathname } from 'next/navigation';

// ─── Typing Indicator ───────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-2">
      <div className="flex items-center gap-1 rounded-2xl bubble-metal-typing px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-amber-500/60 animate-bounce [animation-delay:0ms]" />
        <span className="h-2 w-2 rounded-full bg-amber-500/60 animate-bounce [animation-delay:150ms]" />
        <span className="h-2 w-2 rounded-full bg-amber-500/60 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}

// ─── Read Indicator ─────────────────────────────────────────────────────────
function ReadIndicator({ status }: { status?: ChatMessage['status'] }) {
  if (!status) return null;
  if (status === 'sending') {
    return <span className="text-[10px] text-zinc-500 ml-1">Sending...</span>;
  }
  if (status === 'sent') {
    return <span className="text-[10px] text-zinc-400 ml-1">&#10003;</span>;
  }
  if (status === 'responded') {
    return <span className="text-[10px] text-amber-500 ml-1">&#10003;&#10003;</span>;
  }
  return null;
}

// ─── Message Bubble ─────────────────────────────────────────────────────────
function MessageBubble({ msg, onTTS }: { msg: ChatMessage; onTTS?: (text: string) => void }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} px-3 py-1`}>
      <div
        className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
          isUser
            ? 'bubble-metal-user text-zinc-950'
            : 'bubble-metal-assistant text-zinc-100'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
        <div className="flex items-center justify-end gap-1 mt-0.5">
          <span className="text-[10px] opacity-50">
            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isUser && <ReadIndicator status={msg.status} />}
          {!isUser && onTTS && (
            <button
              onClick={() => onTTS(msg.content)}
              className="ml-1 opacity-40 hover:opacity-80 transition-opacity"
              title="Play audio"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M10 3.75a.75.75 0 0 0-1.264-.546L5.203 6H3.667a.75.75 0 0 0-.7.48A6.985 6.985 0 0 0 2.5 9c0 .887.165 1.737.468 2.52.111.29.39.48.7.48h1.535l3.533 2.796A.75.75 0 0 0 10 14.25V3.75ZM15.95 5.05a.75.75 0 0 0-1.06 1.061 5.5 5.5 0 0 1 0 7.778.75.75 0 0 0 1.06 1.06 7 7 0 0 0 0-9.899Z" />
                <path d="M13.829 7.172a.75.75 0 0 0-1.061 1.06 2.5 2.5 0 0 1 0 3.536.75.75 0 0 0 1.06 1.06 4 4 0 0 0 0-5.656Z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── STT Button ─────────────────────────────────────────────────────────────
function MicButton({ onTranscript }: { onTranscript: (text: string) => void }) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const toggle = useCallback(() => {
    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = navigator.language || 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const last = event.results[event.results.length - 1];
      if (last.isFinal) {
        onTranscript(last[0].transcript);
        setListening(false);
      }
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [listening, onTranscript]);

  // Check support
  const supported = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
  if (!supported) return null;

  return (
    <button
      onClick={toggle}
      className={`p-1.5 rounded-full transition-colors ${
        listening ? 'bg-red-500/20 text-red-400' : 'text-zinc-400 hover:text-zinc-200'
      }`}
      title={listening ? 'Stop recording' : 'Voice input'}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path d="M7 4a3 3 0 0 1 6 0v6a3 3 0 1 1-6 0V4Z" />
        <path d="M5.5 9.643a.75.75 0 0 0-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-1.5v-1.546A6.001 6.001 0 0 0 16 10v-.357a.75.75 0 0 0-1.5 0V10a4.5 4.5 0 0 1-9 0v-.357Z" />
      </svg>
    </button>
  );
}

// ─── Chat Input ─────────────────────────────────────────────────────────────
function ChatInput() {
  const { inputText, setInputText, sendMessage, isSending } = useChatStore();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = useCallback(() => {
    if (!inputText.trim() || isSending) return;
    const pageUrl = typeof window !== 'undefined' ? window.location.href : pathname;
    sendMessage(inputText.trim(), pageUrl);
  }, [inputText, isSending, sendMessage, pathname]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleTranscript = useCallback(
    (text: string) => {
      const pageUrl = typeof window !== 'undefined' ? window.location.href : pathname;
      sendMessage(text, pageUrl);
    },
    [sendMessage, pathname]
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex items-center gap-1.5 border-t border-zinc-700/50 px-3 py-2">
      <MicButton onTranscript={handleTranscript} />
      <input
        ref={inputRef}
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Message MIND..."
        className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 outline-none"
        disabled={isSending}
      />
      <button
        onClick={handleSend}
        disabled={!inputText.trim() || isSending}
        className="p-1.5 rounded-full text-amber-500 hover:bg-amber-500/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path d="M3.105 3.342a.75.75 0 0 1 .826-.14l13.5 6.75a.75.75 0 0 1 0 1.342l-13.5 6.75a.75.75 0 0 1-1.053-.869l1.672-5.357a.75.75 0 0 1 .573-.524L9.75 10l-4.627-1.294a.75.75 0 0 1-.573-.524L2.878 2.825a.75.75 0 0 1 .227-.483Z" />
        </svg>
      </button>
    </div>
  );
}

// ─── Main Widget ────────────────────────────────────────────────────────────
export default function ChatWidget() {
  const {
    isOpen,
    toggleChat,
    messages,
    isSending,
    unreadCount,
    connectionStatus,
    initThread,
    pollMessages,
    threadId,
  } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Init thread on mount
  useEffect(() => {
    initThread();
  }, [initThread]);

  // Detect if waiting for response (any user message in 'sent' state)
  const isWaiting = messages.some((m) => m.role === 'user' && m.status === 'sent');

  // Polling
  useEffect(() => {
    if (!threadId) return;

    // Initial poll
    pollMessages();

    // Poll faster when actively waiting for a response
    const interval = isWaiting ? 1500 : isOpen ? 3000 : 15000;
    pollRef.current = setInterval(pollMessages, interval);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [threadId, isOpen, isWaiting, pollMessages]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // TTS handler
  const handleTTS = useCallback(async (text: string) => {
    try {
      const res = await fetch('/api/chat/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.audio_url) {
          const audio = new Audio(data.audio_url);
          audio.play().catch(() => {});
        }
      }
    } catch {
      // TTS failed silently
    }
  }, []);

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-[60] flex items-center justify-center w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95"
          aria-label="Open chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.29 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.68-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97Z" clipRule="evenodd" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 rounded-full bg-red-500 text-white text-[11px] font-bold px-1">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-[60] w-[22rem] sm:w-96 h-[32rem] flex flex-col rounded-2xl border border-zinc-700/50 bg-zinc-900/95 backdrop-blur-xl shadow-2xl shadow-black/40">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700/50">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected'
                    ? 'bg-emerald-400'
                    : connectionStatus === 'error'
                    ? 'bg-red-400'
                    : 'bg-zinc-500'
                }`}
              />
              <span className="text-sm font-medium text-zinc-100">MIND</span>
              <span className="text-[11px] text-zinc-500">Mind Protocol</span>
            </div>
            <button
              onClick={toggleChat}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
              aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-zinc-700">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-amber-500">
                    <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.29 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.68-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97Z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-zinc-300 font-medium">Talk to MIND</p>
                <p className="text-xs text-zinc-500 mt-1">
                  Ask anything. I can see which page you&apos;re on.
                </p>
              </div>
            )}
            {messages.map((msg) => (
              <MessageBubble
                key={msg.message_id}
                msg={msg}
                onTTS={msg.role === 'assistant' ? handleTTS : undefined}
              />
            ))}
            {(isSending || messages.some((m) => m.role === 'user' && m.status === 'sent')) && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <ChatInput />
        </div>
      )}
    </>
  );
}
