import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Bot, User, Zap, Sparkles } from 'lucide-react';
import { useChatStream } from '../../hooks/useChatStream';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import clsx from 'clsx';

interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  isCacheHit?: boolean;
}

export default function ChatWorkspace() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const { streamChat, loading } = useChatStream();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Add a placeholder message for assistant
    const assistantMsgId = Date.now().toString();
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '',
      id: assistantMsgId,
      isCacheHit: false
    }]);

    await streamChat(
      userMsg.content,
      (chunk) => {
        setMessages(prev => prev.map(msg =>
          msg.id === assistantMsgId
            ? { ...msg, content: msg.content + chunk }
            : msg
        ));
      },
      (_, isCacheHit) => {
        setMessages(prev => prev.map(msg =>
          msg.id === assistantMsgId
            ? { ...msg, isCacheHit }
            : msg
        ));
      }
    );
  };

  const isHome = messages.length === 0;

  return (
    <div className="h-[calc(100vh-6rem)] relative flex flex-col items-center">

      {/* Scrollable Content Area */}
      <div className={clsx(
        "flex-1 w-full max-w-4xl overflow-y-auto px-4 pb-32 transition-all duration-500 scroll-smooth",
        isHome ? "flex flex-col justify-center items-center" : "block"
      )}>

        {isHome ? (
          // Hero Section (Gemini Style)
          <div className="text-center space-y-8 animate-fade-in-up">
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
              <Sparkles size={64} className="text-blue-600 dark:text-blue-400 relative z-10" />
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
              {t('chat.startPrompt')}
            </h1>

            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              I can help you analyze data, generate code, or draft documents.
              <br />
              Everything is secure and optimized for your enterprise.
            </p>

            <div className="flex gap-4 justify-center mt-8">
              {['Summarize Report', 'Python Script', 'Audit Logs'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-105 transition-all shadow-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Chat History
          <div className="space-y-8 py-8">
            {messages.map((msg, idx) => (
              <div key={idx} className={clsx(
                "flex gap-6 animate-fade-in",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}>
                <div className={clsx(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-md",
                  msg.role === 'assistant'
                    ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                )}>
                  {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                </div>

                <div className={clsx(
                  "max-w-[85%] rounded-2xl p-6 shadow-sm border text-base leading-relaxed",
                  msg.role === 'assistant'
                    ? "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    : "bg-blue-600 text-white border-transparent"
                )}>
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                      {msg.isCacheHit && (
                        <div className="flex items-center gap-1.5 mt-4 text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 px-3 py-1.5 rounded-full border border-amber-100 dark:border-amber-800/50 w-fit shadow-sm">
                          <Zap size={14} fill="currentColor" />
                          <span>语义缓存命中 (Cache Hit) - 0 Tokens</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  )}
                </div>
              </div>
            ))}

            {loading && messages[messages.length - 1]?.role === 'user' && (
               <div className="flex gap-6 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Bot size={20} />
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 flex items-center shadow-sm border border-slate-100 dark:border-slate-700">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce mr-1.5"></span>
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce mr-1.5 delay-75"></span>
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></span>
                  </div>
               </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Input Area */}
      <div className="absolute bottom-6 left-0 right-0 px-4 flex justify-center z-10">
        <div className="w-full max-w-3xl relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('chat.inputPlaceholder')}
            className="w-full bg-white dark:bg-slate-800 border-0 rounded-full pl-8 pr-16 py-5 text-lg shadow-2xl shadow-blue-900/10 focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-400 dark:text-white relative z-10"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed transition-all shadow-lg z-20"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="absolute bottom-1 left-0 right-0 text-center text-xs text-slate-400 pointer-events-none">
        {t('chat.disclaimer')}
      </div>
    </div>
  );
}
