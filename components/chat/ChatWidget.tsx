'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useChatStore, type ChatMessage } from '@/lib/chat/store';
import { usePathname } from 'next/navigation';
import { useSession } from '@/lib/useSession';
import { capturePageScreenshot, fileToBase64 } from '@/lib/page-context';
import { useToast } from '@/components/Toast';

// ─── Preferences persistence ─────────────────────────────────────────────────
const PREFS_KEY = 'chat-prefs';
const SIZE_KEY = 'chat-panel-size';

type VoiceMode = 'ptt' | 'always' | 'none';

interface ChatPrefs {
  autoReadAloud: boolean;
  voiceMode: VoiceMode;
  theme: string;
}

const DEFAULT_PREFS: ChatPrefs = { autoReadAloud: false, voiceMode: 'ptt', theme: 'zinc' };

function loadPrefs(): ChatPrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch { /* noop */ }
  return DEFAULT_PREFS;
}
function savePrefs(p: ChatPrefs) {
  try { localStorage.setItem(PREFS_KEY, JSON.stringify(p)); } catch { /* noop */ }
}

// ─── Color themes ────────────────────────────────────────────────────────────
type Theme = {
  key: string; name: string; swatch: string;
  bubbleBg: string; bubbleText: string;
  shineFrom: string; shineMid: string; shineTo: string;
  userBg: string; userText: string;
};

const THEMES: Theme[] = [
  {
    key: 'zinc', name: 'Zinc', swatch: '#3f3f46',
    bubbleBg: 'rgba(39,39,42,0.95)', bubbleText: '#f4f4f5',
    shineFrom: 'rgba(255,255,255,0)', shineMid: 'rgba(255,255,255,0.06)', shineTo: 'rgba(255,255,255,0)',
    userBg: 'rgba(245,158,11,0.9)', userText: '#18181b',
  },
  {
    key: 'amber', name: 'Amber', swatch: '#d97706',
    bubbleBg: 'rgba(55,40,20,0.95)', bubbleText: '#fef3c7',
    shineFrom: 'rgba(255,200,50,0)', shineMid: 'rgba(255,200,50,0.10)', shineTo: 'rgba(255,200,50,0)',
    userBg: 'rgba(245,158,11,0.9)', userText: '#18181b',
  },
  {
    key: 'sapphire', name: 'Sapphire', swatch: '#2563eb',
    bubbleBg: 'rgba(20,30,60,0.95)', bubbleText: '#dbeafe',
    shineFrom: 'rgba(100,160,255,0)', shineMid: 'rgba(100,160,255,0.10)', shineTo: 'rgba(100,160,255,0)',
    userBg: 'rgba(59,130,246,0.9)', userText: '#ffffff',
  },
  {
    key: 'emerald', name: 'Emerald', swatch: '#059669',
    bubbleBg: 'rgba(15,40,30,0.95)', bubbleText: '#d1fae5',
    shineFrom: 'rgba(52,211,153,0)', shineMid: 'rgba(52,211,153,0.10)', shineTo: 'rgba(52,211,153,0)',
    userBg: 'rgba(16,185,129,0.9)', userText: '#18181b',
  },
  {
    key: 'rose', name: 'Rose', swatch: '#e11d48',
    bubbleBg: 'rgba(50,15,25,0.95)', bubbleText: '#ffe4e6',
    shineFrom: 'rgba(255,100,130,0)', shineMid: 'rgba(255,100,130,0.10)', shineTo: 'rgba(255,100,130,0)',
    userBg: 'rgba(244,63,94,0.9)', userText: '#ffffff',
  },
  {
    key: 'violet', name: 'Violet', swatch: '#7c3aed',
    bubbleBg: 'rgba(35,15,60,0.95)', bubbleText: '#ede9fe',
    shineFrom: 'rgba(167,139,250,0)', shineMid: 'rgba(167,139,250,0.10)', shineTo: 'rgba(167,139,250,0)',
    userBg: 'rgba(139,92,246,0.9)', userText: '#ffffff',
  },
  {
    key: 'aurora', name: 'Aurora', swatch: 'linear-gradient(135deg, #34d399, #818cf8)',
    bubbleBg: 'rgba(15,25,40,0.95)', bubbleText: '#e0f2fe',
    shineFrom: 'rgba(52,211,153,0)', shineMid: 'rgba(129,140,248,0.10)', shineTo: 'rgba(52,211,153,0)',
    userBg: 'linear-gradient(135deg, rgba(52,211,153,0.9), rgba(129,140,248,0.9))', userText: '#ffffff',
  },
];

const THEME_MAP = new Map(THEMES.map(t => [t.key, t]));

// ─── Browser TTS ─────────────────────────────────────────────────────────────
// Pre-load voices (browsers load them asynchronously)
let _voicesLoaded = false;
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.getVoices(); // Trigger initial load
  window.speechSynthesis.onvoiceschanged = () => { _voicesLoaded = true; };
}

function speakText(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  // Detect language from text heuristic
  const frPattern = /[àâéèêëîïôùûüçœæ]|(?:^|\s)(?:je|tu|il|elle|nous|vous|ils|elles|les|des|une|est|pas|que|pour|dans|avec|sur|mais|ou|donc|car|ni)\b/i;
  utter.lang = frPattern.test(text) ? 'fr-FR' : 'en-US';
  // Pick a natural voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => v.lang.startsWith(utter.lang.slice(0, 2)) && v.name.toLowerCase().includes('natural'))
    || voices.find(v => v.lang.startsWith(utter.lang.slice(0, 2)));
  if (preferred) utter.voice = preferred;
  utter.rate = 1.0;
  utter.pitch = 1.0;
  // Chrome requires user gesture and may silently fail — force with a small delay
  setTimeout(() => window.speechSynthesis.speak(utter), 50);
}

// ─── Typing Indicator ───────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-2">
      <div className="flex items-center gap-1 rounded-2xl bg-zinc-800 px-3 py-2">
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
  if (status === 'sending') return <span className="text-[10px] text-zinc-500 ml-1">Sending...</span>;
  if (status === 'sent') return <span className="text-[10px] text-zinc-400 ml-1">&#10003;</span>;
  if (status === 'responded') return <span className="text-[10px] text-amber-500 ml-1">&#10003;&#10003;</span>;
  return null;
}

// ─── Metallic shine keyframes (injected once) ────────────────────────────────
const SHINE_STYLE_ID = 'chat-metallic-shine';
function ensureShineStyle() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(SHINE_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = SHINE_STYLE_ID;
  style.textContent = `
    @keyframes metallic-shine {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `;
  document.head.appendChild(style);
}

// ─── Message Bubble ─────────────────────────────────────────────────────────
function MessageBubble({
  msg, onTTS, theme,
}: {
  msg: ChatMessage;
  onTTS?: (text: string) => void;
  theme: Theme;
}) {
  const isUser = msg.role === 'user';

  useEffect(() => { if (!isUser) ensureShineStyle(); }, [isUser]);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} px-3 py-1`}>
      <div
        className="max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed"
        style={isUser ? {
          background: theme.userBg,
          color: theme.userText,
        } : {
          background: `${theme.bubbleBg}`,
          color: theme.bubbleText,
          backgroundImage: `linear-gradient(120deg, ${theme.shineFrom} 0%, ${theme.shineMid} 50%, ${theme.shineTo} 100%), none`,
          backgroundSize: '200% 100%',
          animation: 'metallic-shine 4s ease-in-out infinite',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Image attachment (user messages only) */}
        {isUser && msg.image && (
          <div className="mb-1.5">
            <img
              src={msg.image}
              alt="Attached image"
              className="max-w-full max-h-48 rounded-lg object-contain"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>
        )}
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
              aria-label="Play audio"
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
function MicButton({
  onTranscript, mode, onListeningChange,
}: {
  onTranscript: (text: string) => void;
  mode: VoiceMode;
  onListeningChange?: (l: boolean) => void;
}) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
    onListeningChange?.(false);
  }, [onListeningChange]);

  const startListening = useCallback(() => {
    const SR = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
    if (!SR) return;

    const recognition = new SR();
    recognition.continuous = mode === 'always';
    recognition.interimResults = true;
    // Empty string = auto-detect language
    recognition.lang = '';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const last = event.results[event.results.length - 1];
      if (last.isFinal) {
        onTranscript(last[0].transcript);
        if (mode === 'ptt') {
          setListening(false);
          onListeningChange?.(false);
        }
      }
    };

    recognition.onerror = () => { setListening(false); onListeningChange?.(false); };
    recognition.onend = () => {
      if (mode === 'always' && listening) {
        // Re-start for continuous mode
        try { recognition.start(); } catch { setListening(false); onListeningChange?.(false); }
      } else {
        setListening(false);
        onListeningChange?.(false);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
    onListeningChange?.(true);
  }, [mode, onTranscript, onListeningChange, listening]);

  const toggle = useCallback(() => {
    if (listening) stopListening();
    else startListening();
  }, [listening, stopListening, startListening]);

  // Auto-start for always-on mode
  useEffect(() => {
    if (mode === 'always' && !listening) startListening();
    if (mode === 'none' && listening) stopListening();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  if (mode === 'none') return null;

  const supported = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
  if (!supported) return null;

  return (
    <button
      onClick={toggle}
      className={`p-1.5 rounded-full transition-colors ${
        listening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'text-zinc-400 hover:text-zinc-200'
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

// ─── Options menu ────────────────────────────────────────────────────────────
function OptionsMenu({
  prefs, onChange, onClose,
}: {
  prefs: ChatPrefs;
  onChange: (p: ChatPrefs) => void;
  onClose: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute bottom-full right-0 mb-2 w-64 rounded-xl p-3 z-50"
      style={{
        background: 'rgba(15,15,20,0.97)',
        border: '1px solid rgba(120,130,155,0.25)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 12px 40px rgba(0,0,0,.6)',
      }}
    >
      {/* Auto read aloud */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-zinc-300">Auto read aloud</span>
        <button
          onClick={() => onChange({ ...prefs, autoReadAloud: !prefs.autoReadAloud })}
          className={`w-9 h-5 rounded-full transition-colors relative ${
            prefs.autoReadAloud ? 'bg-amber-500' : 'bg-zinc-700'
          }`}
        >
          <span
            className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
            style={{ left: prefs.autoReadAloud ? 18 : 2 }}
          />
        </button>
      </div>

      {/* Voice mode */}
      <div className="mb-3">
        <span className="text-xs text-zinc-500 block mb-1.5">Voice input</span>
        <div className="flex gap-1">
          {([
            { key: 'ptt', label: 'Push-to-talk' },
            { key: 'always', label: 'Always on' },
            { key: 'none', label: 'Off' },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onChange({ ...prefs, voiceMode: key })}
              className={`flex-1 px-2 py-1 rounded text-[10px] font-medium border transition ${
                prefs.voiceMode === key
                  ? 'border-amber-500/50 text-amber-400 bg-amber-500/10'
                  : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div>
        <span className="text-xs text-zinc-500 block mb-1.5">Theme</span>
        <div className="grid grid-cols-7 gap-1.5">
          {THEMES.map(t => (
            <button
              key={t.key}
              onClick={() => onChange({ ...prefs, theme: t.key })}
              title={t.name}
              style={{
                width: 28, height: 28, borderRadius: 8,
                background: t.swatch,
                border: prefs.theme === t.key ? '2px solid rgba(255,255,255,0.9)' : '1px solid rgba(255,255,255,0.12)',
                cursor: 'pointer',
                transition: 'transform 100ms',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.15)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Image Preview ──────────────────────────────────────────────────────────
function ImagePreview({ src, onRemove }: { src: string; onRemove: () => void }) {
  return (
    <div className="relative inline-block mx-3 mt-2 mb-1">
      <img
        src={src}
        alt="Attachment preview"
        className="max-h-24 max-w-[200px] rounded-lg object-contain"
        style={{ border: '1px solid rgba(255,255,255,0.1)' }}
      />
      <button
        onClick={onRemove}
        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-zinc-700 hover:bg-red-500 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
        title="Remove image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
          <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
        </svg>
      </button>
    </div>
  );
}

// ─── Chat Input ─────────────────────────────────────────────────────────────
function ChatInput({ prefs, onPrefsChange }: { prefs: ChatPrefs; onPrefsChange: (p: ChatPrefs) => void }) {
  const { inputText, setInputText, sendMessage, isSending, pendingImage, setPendingImage } = useChatStore();
  const { toast } = useToast();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const attachMenuRef = useRef<HTMLDivElement>(null);

  // Close attach menu on outside click or Escape
  useEffect(() => {
    if (!showAttachMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(e.target as Node)) {
        setShowAttachMenu(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowAttachMenu(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [showAttachMenu]);

  const handleSend = useCallback(() => {
    if ((!inputText.trim() && !pendingImage) || isSending) return;
    const pageUrl = typeof window !== 'undefined' ? window.location.href : pathname;
    sendMessage(inputText.trim() || '(image)', pageUrl);
  }, [inputText, isSending, sendMessage, pathname, pendingImage]);

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

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Validate: images only, max 5MB
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) {
      toast('Image must be under 5MB', 'error');
      return;
    }
    try {
      const base64 = await fileToBase64(file);
      setPendingImage(base64);
    } catch {
      console.warn('Failed to read image file');
    }
    // Reset file input so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
    setShowAttachMenu(false);
  }, [setPendingImage]);

  const handleScreenshot = useCallback(async () => {
    setIsCapturing(true);
    setShowAttachMenu(false);
    try {
      const dataUrl = await capturePageScreenshot();
      if (dataUrl) {
        setPendingImage(dataUrl);
      }
    } catch {
      console.warn('Screenshot capture failed');
    }
    setIsCapturing(false);
  }, [setPendingImage]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <div className="border-t border-zinc-700/50">
      {/* Image preview row */}
      {pendingImage && (
        <ImagePreview src={pendingImage} onRemove={() => setPendingImage(null)} />
      )}

      {/* Input row */}
      <div className="relative flex items-center gap-1.5 px-3 py-2">
        <MicButton onTranscript={handleTranscript} mode={prefs.voiceMode} />

        {/* Attachment button (camera/image) */}
        <div className="relative">
          <button
            onClick={() => setShowAttachMenu(v => !v)}
            disabled={isCapturing}
            className={`p-1.5 rounded-full transition-colors ${
              pendingImage
                ? 'text-amber-400 hover:text-amber-300'
                : isCapturing
                ? 'text-amber-500 animate-pulse'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Attach image or screenshot"
          >
            {/* Camera icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M1 8a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 8.07 3h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 16.07 6H17a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8Zm13.5 3a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM10 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Attachment dropdown menu */}
          {showAttachMenu && (
            <div
              ref={attachMenuRef}
              className="absolute bottom-full left-0 mb-2 w-48 rounded-xl p-1 z-50"
              style={{
                background: 'rgba(15,15,20,0.97)',
                border: '1px solid rgba(120,130,155,0.25)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 12px 40px rgba(0,0,0,.6)',
              }}
            >
              {/* Upload image */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                {/* Photo icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-zinc-400">
                  <path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17H3.25A2.25 2.25 0 0 1 1 14.75v-9.5Zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-2.69l-2.22-2.219a.75.75 0 0 0-1.06 0l-1.91 1.909-4.97-4.969a.75.75 0 0 0-1.06 0L2.5 11.06ZM12.75 7a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z" clipRule="evenodd" />
                </svg>
                Upload image
              </button>
              {/* Capture screenshot */}
              <button
                onClick={handleScreenshot}
                disabled={isCapturing}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-zinc-300 hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                {/* Screen capture icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-zinc-400">
                  <path d="M15.993 1.385a1.87 1.87 0 0 1 2.622 2.622l-4.03 5.31a2.333 2.333 0 0 1-.396.406 1.14 1.14 0 0 1-.104.071l-1.746.872.376-1.903a1.12 1.12 0 0 1 .033-.118c.04-.122.1-.24.178-.345l3.067-6.915Z" />
                  <path d="M2.5 4A1.5 1.5 0 0 0 1 5.5v9A1.5 1.5 0 0 0 2.5 16h15a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 17.5 4h-3.563l-.468 1.054A3 3 0 0 0 17.5 5h0a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-15a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8.585l.468-1.054A3 3 0 0 0 2.5 4Z" />
                </svg>
                {isCapturing ? 'Capturing...' : 'Capture visible area'}
              </button>
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

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
          disabled={(!inputText.trim() && !pendingImage) || isSending}
          className="p-1.5 rounded-full text-amber-500 hover:bg-amber-500/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M3.105 3.342a.75.75 0 0 1 .826-.14l13.5 6.75a.75.75 0 0 1 0 1.342l-13.5 6.75a.75.75 0 0 1-1.053-.869l1.672-5.357a.75.75 0 0 1 .573-.524L9.75 10l-4.627-1.294a.75.75 0 0 1-.573-.524L2.878 2.825a.75.75 0 0 1 .227-.483Z" />
          </svg>
        </button>
        {/* Options "..." button */}
        <button
          onClick={() => setShowOptions(v => !v)}
          className="p-1.5 rounded-full text-zinc-500 hover:text-zinc-200 transition-colors"
          title="Options"
          aria-label="Options"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M3 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM8.5 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM15.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
          </svg>
        </button>
        {showOptions && (
          <OptionsMenu
            prefs={prefs}
            onChange={(p) => { onPrefsChange(p); }}
            onClose={() => setShowOptions(false)}
          />
        )}
      </div>
    </div>
  );
}

// ─── Size persistence ────────────────────────────────────────────────────────
const DEFAULT_W = 420;
const DEFAULT_H_PCT = 90;
const MIN_W = 300;
const MAX_W = 800;
const MIN_H = 300;

function loadSize(): { w: number; h: number } {
  try {
    const raw = localStorage.getItem(SIZE_KEY);
    if (raw) {
      const { w, h } = JSON.parse(raw);
      return { w: Math.max(MIN_W, Math.min(MAX_W, w)), h: Math.max(MIN_H, h) };
    }
  } catch { /* noop */ }
  return { w: DEFAULT_W, h: 0 };
}

function saveSize(w: number, h: number) {
  try { localStorage.setItem(SIZE_KEY, JSON.stringify({ w, h })); } catch { /* noop */ }
}

// ─── Main Widget ────────────────────────────────────────────────────────────
export default function ChatWidget() {
  const {
    isOpen, toggleChat, messages, isSending, unreadCount,
    connectionStatus, initThread, pollMessages, threadId,
  } = useChatStore();
  const { session } = useSession();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastMsgCountRef = useRef(0);

  // Preferences
  const [prefs, setPrefs] = useState<ChatPrefs>(DEFAULT_PREFS);
  const prefsRef = useRef(prefs);

  const updatePrefs = useCallback((p: ChatPrefs) => {
    setPrefs(p);
    prefsRef.current = p;
    savePrefs(p);
  }, []);

  const theme = THEME_MAP.get(prefs.theme) || THEMES[0];

  // Resize state
  const [size, setSize] = useState<{ w: number; h: number }>({ w: DEFAULT_W, h: 0 });
  const resizing = useRef(false);
  const resizeStart = useRef({ mx: 0, my: 0, w: 0, h: 0 });

  useEffect(() => {
    setSize(loadSize());
    setPrefs(loadPrefs());
    prefsRef.current = loadPrefs();
  }, []);

  useEffect(() => { initThread(); }, [initThread]);

  const isWaiting = messages.some((m) => m.role === 'user' && m.status === 'sent');

  // Polling — only when authenticated (avoids 401 console noise)
  useEffect(() => {
    if (!threadId || !session) return;
    pollMessages();
    const interval = isWaiting ? 1500 : isOpen ? 3000 : 15000;
    pollRef.current = setInterval(pollMessages, interval);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [threadId, session, isOpen, isWaiting, pollMessages]);

  // Auto-scroll on new messages and on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, 50);
    }
  }, [messages, isOpen]);

  // Auto read aloud: speak new assistant messages
  useEffect(() => {
    if (!prefsRef.current.autoReadAloud) { lastMsgCountRef.current = messages.length; return; }
    const prevCount = lastMsgCountRef.current;
    lastMsgCountRef.current = messages.length;
    if (messages.length > prevCount) {
      const newMsgs = messages.slice(prevCount);
      for (const m of newMsgs) {
        if (m.role === 'assistant') speakText(m.content);
      }
    }
  }, [messages]);

  // TTS handler (browser speech synthesis — works offline, no API needed)
  const handleTTS = useCallback((text: string) => { speakText(text); }, []);

  // Resize handlers
  const onResizeStart = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resizing.current = true;
    const panel = (e.currentTarget as HTMLElement).closest('[data-chat-panel]') as HTMLElement;
    resizeStart.current = { mx: e.clientX, my: e.clientY, w: panel?.offsetWidth || size.w, h: panel?.offsetHeight || size.h };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [size]);

  const onResizeMove = useCallback((e: React.PointerEvent) => {
    if (!resizing.current) return;
    const dw = resizeStart.current.mx - e.clientX;
    const dh = resizeStart.current.my - e.clientY;
    setSize({ w: Math.max(MIN_W, Math.min(MAX_W, resizeStart.current.w + dw)), h: Math.max(MIN_H, Math.min(window.innerHeight - 24, resizeStart.current.h + dh)) });
  }, []);

  const onResizeEnd = useCallback(() => {
    if (resizing.current) { resizing.current = false; setSize(prev => { saveSize(prev.w, prev.h); return prev; }); }
  }, []);

  const panelH = size.h > 0 ? `${size.h}px` : `${DEFAULT_H_PCT}vh`;

  return (
    <>
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

      {isOpen && (
        <div
          data-chat-panel
          className="fixed bottom-3 right-3 z-[60] flex flex-col rounded-2xl border border-zinc-700/50 bg-zinc-900/95 backdrop-blur-xl shadow-2xl shadow-black/40"
          style={{ width: `min(${size.w}px, calc(100vw - 12px))`, height: `min(${panelH}, calc(100vh - 12px))` }}
        >
          {/* Resize handle */}
          <div
            onPointerDown={onResizeStart} onPointerMove={onResizeMove} onPointerUp={onResizeEnd}
            className="absolute -top-1 -left-1 w-6 h-6 cursor-nwse-resize z-10 flex items-end justify-end pr-1 pb-1"
            style={{ touchAction: 'none' }}
            title="Drag to resize"
          >
            <svg width="8" height="8" viewBox="0 0 8 8" className="text-zinc-500 opacity-40 hover:opacity-100 transition-opacity">
              <path d="M0 8 L8 0" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M0 5 L5 0" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M0 2 L2 0" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700/50">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-emerald-400' : connectionStatus === 'error' ? 'bg-red-400' : 'bg-zinc-500'}`} />
              <span className="text-sm font-medium text-zinc-100">MIND</span>
              <span className="text-[11px] text-zinc-500">Mind Protocol</span>
            </div>
            <button onClick={toggleChat} className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors" aria-label="Close chat">
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
                <p className="text-xs text-zinc-500 mt-1">Ask anything. I can see which page you&apos;re on.</p>
              </div>
            )}
            {messages.map((msg) => (
              <MessageBubble key={msg.message_id} msg={msg} onTTS={msg.role === 'assistant' ? handleTTS : undefined} theme={theme} />
            ))}
            {(isSending || messages.some((m) => m.role === 'user' && m.status === 'sent')) && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <ChatInput prefs={prefs} onPrefsChange={updatePrefs} />
        </div>
      )}
    </>
  );
}
