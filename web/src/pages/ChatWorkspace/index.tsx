import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Bot, User, Plus, Zap } from 'lucide-react';
import { useChatStream } from '../../hooks/useChatStream';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

  return (
    <div className="h-[calc(100vh-6rem)] flex gap-4">
      {/* Sidebar - Sessions */}
      <div className="w-64 bg-white rounded-xl shadow border border-slate-100 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-slate-100">
          <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
            <Plus size={18} /> {t('chat.newChat')}
          </button>
        </div>
        <div className="flex-1 overflow-auto p-2">
          <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium mb-2 cursor-pointer">
            {t('chat.currentSession')}
          </div>
          <div className="p-3 hover:bg-slate-50 text-slate-600 rounded-lg text-sm cursor-pointer transition-colors">
            {t('chat.previousChat')}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-white rounded-xl shadow border border-slate-100 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {messages.length === 0 && (
             <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Bot size={48} className="mb-4 text-slate-300" />
                <p>{t('chat.startPrompt')}</p>
             </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'assistant' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
              }`}>
                {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'assistant'
                  ? 'bg-slate-50 text-slate-800'
                  : 'bg-blue-600 text-white'
              }`}>
                {msg.role === 'assistant' ? (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                    {msg.isCacheHit && (
                      <div className="flex items-center gap-1 mt-3 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100 w-fit">
                        <Zap size={12} fill="currentColor" />
                        语义缓存命中 (Cache Hit) - 0 Tokens
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
             <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Bot size={20} />
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 flex items-center">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce mr-1"></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce mr-1 delay-75"></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                </div>
             </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('chat.inputPlaceholder')}
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="text-center mt-2 text-xs text-slate-400">
            {t('chat.disclaimer')}
          </div>
        </div>
      </div>

      {/* Right Config Panel (Placeholder) */}
      <div className="w-72 bg-white rounded-xl shadow border border-slate-100 hidden xl:block p-4">
        <h3 className="font-bold text-slate-700 mb-4">{t('chat.config')}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">{t('chat.model')}</label>
            <select className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50">
              <option>GPT-4 Turbo</option>
              <option>Claude 3 Opus</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">{t('chat.temperature')}</label>
            <input type="range" className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
