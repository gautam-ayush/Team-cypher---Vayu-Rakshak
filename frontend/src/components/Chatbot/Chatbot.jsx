import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Loader2, Sparkles, User, RefreshCw, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sendChatMessage } from '../../services/geminiChatService';

const quickPrompts = [
  '🏃 Is it safe to exercise outdoors right now?',
  '🫁 What precautions should I take for current AQI?',
  '😷 Do I need an N95 mask today?',
  '👶 Any advice for children or seniors today?',
];

export default function Chatbot() {
  const { location, aqi, weather, profile } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: `Hello ${profile?.name || 'there'}! 👋 I am your Vayu Rakshak AI Assistant. I monitor real-time air quality in ${location?.city || 'your area'} (AQI: ${aqi?.aqi || 'N/A'}) and provide tailored environmental health advice. How can I help you today?`
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input.trim();
    if (!query || loading) return;

    const userMessage = { role: 'user', text: query };
    const updatedHistory = [...messages, userMessage];

    setMessages(updatedHistory);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const context = { location, aqi, weather, profile };
      // Filter out system greetings for API history
      const apiHistory = updatedHistory.slice(1);
      const reply = await sendChatMessage(apiHistory, context);

      setMessages(prev => [...prev, { role: 'model', text: reply }]);
    } catch (err) {
      console.error('Chat error:', err);
      setError(err.message || 'Failed to connect to Gemini AI.');
      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          text: '⚠️ I had trouble connecting to the Gemini AI server. Please verify your internet connection or try again in a moment.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow-[0_0_25px_rgba(34,211,238,0.5)] border border-cyan-400/40 hover:shadow-[0_0_35px_rgba(34,211,238,0.7)] transition-all"
        aria-label="Open Vayu AI Health Chatbot"
      >
        <div className="relative flex items-center justify-center">
          <Bot className="w-6 h-6 text-white animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
        </div>
        <span className="text-xs font-bold tracking-wide hidden sm:inline">Vayu AI Assistant</span>
        <Sparkles className="w-4 h-4 text-cyan-200" />
      </motion.button>

      {/* Expandable Chat Modal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[550px] max-h-[80vh] flex flex-col bg-atmos-surface/95 backdrop-blur-2xl border-2 border-atmos-cyan/40 rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.7)] overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-atmos-surface/90 border-b border-atmos-border/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <img src="/logo.png" alt="Vayu Logo" className="w-9 h-9 object-contain rounded-lg drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                </div>
                <div>
                  <h3 className="text-sm font-display font-bold text-white flex items-center gap-1.5">
                    Vayu Rakshak AI
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      Gemini 3.6
                    </span>
                  </h3>
                  <p className="text-[10px] text-atmos-text-muted">
                    Environmental Health Assistant • {location?.city || 'Live Context'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-atmos-text-muted hover:text-white transition-colors"
                title="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Context Summary Pill */}
            <div className="px-4 py-2 bg-white/[0.02] border-b border-atmos-border/30 flex items-center justify-between text-[11px] text-atmos-text-muted">
              <span>📍 {location?.city || 'Location'} (AQI: <strong className="text-cyan-400">{aqi?.aqi ?? 'N/A'}</strong>)</span>
              <span>👤 {profile?.condition !== 'none' ? profile.condition : 'Standard'}</span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    msg.role === 'user' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                  }`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <div className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-tr-none shadow-md'
                      : 'bg-white/5 border border-white/10 text-atmos-text/90 rounded-tl-none backdrop-blur-md'
                  }`}>
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-atmos-text-muted flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                    Analyzing environmental data with Gemini AI...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length < 5 && !loading && (
              <div className="px-3 py-2 bg-black/20 border-t border-atmos-border/30 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 text-[10px] text-atmos-text-muted hover:text-cyan-400 transition-all whitespace-nowrap"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3 bg-atmos-surface/90 border-t border-atmos-border/40">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Vayu AI about air quality & health..."
                  className="flex-1 bg-white/5 border border-white/10 focus:border-cyan-400/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-atmos-text-muted focus:outline-none transition-all"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white disabled:opacity-40 disabled:pointer-events-none hover:shadow-glow-cyan transition-all"
                  title="Send Message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
