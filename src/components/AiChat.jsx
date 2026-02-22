import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Send, MessageCircle, X } from 'lucide-react';
import { aiService } from '../services/aiService';

export default function AiChat({ userStats }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'coach', content: 'Ready to check in on your discipline? What questions do you have?' }
    ]);
    const [inputMsg, setInputMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!inputMsg.trim()) return;

        const newMsg = { role: 'user', content: inputMsg.trim() };
        setMessages(prev => [...prev, newMsg]);
        setInputMsg('');
        setIsLoading(true);

        const reply = await aiService.chatWithCoach(messages, newMsg.content, userStats);
        
        setMessages(prev => [...prev, { role: 'coach', content: reply }]);
        setIsLoading(false);
    };

    return (
        <div className="relative">
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="w-full p-5 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group text-left transition-all hover:bg-white/10"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 transition-transform group-hover:scale-110 group-hover:rotate-12 duration-500">
                        <MessageCircle size={64} />
                    </div>
                    <h3 className="text-lg font-display font-bold mb-2 flex items-center gap-2">
                        <span className="bg-primary-500/20 text-primary-400 p-1 rounded-md text-xs">AI</span> Chat with Coach
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        Have a question about your macros or need some motivation? Tap here to chat with your AI discipline coach.
                    </p>
                </button>
            )}

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-card/80 border border-primary-500/30 rounded-3xl overflow-hidden backdrop-blur-xl flex flex-col"
                    >
                        {/* Chat Header */}
                        <div className="flex justify-between items-center bg-primary-950/50 p-4 border-b border-white/10">
                            <h3 className="text-md font-display font-bold flex items-center gap-2 text-primary-400">
                                <Zap size={18} /> Coach Chat
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="p-4 flex flex-col gap-3 max-h-[300px] overflow-y-auto" ref={scrollRef}>
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`p-3 max-w-[85%] rounded-2xl text-sm leading-relaxed ${
                                        msg.role === 'user' 
                                            ? 'bg-primary-500 text-white rounded-br-sm' 
                                            : 'bg-white/10 text-gray-200 border border-white/5 rounded-bl-sm'
                                    }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="p-3 bg-white/10 rounded-2xl rounded-bl-sm border border-white/5 text-gray-400 text-xs flex gap-1 items-center">
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-3 border-t border-white/10 bg-black/20 flex gap-2">
                            <input 
                                type="text"
                                value={inputMsg}
                                onChange={e => setInputMsg(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about your diet..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-primary-500/50 transition-all text-sm font-medium"
                            />
                            <button 
                                onClick={handleSend}
                                disabled={!inputMsg.trim() || isLoading}
                                className="p-3 bg-primary-500 rounded-xl text-white disabled:opacity-50 transition-all btn-pop"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
