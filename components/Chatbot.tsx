
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, Contact, VanBanPhapLy, WorkLogEntry } from '../types';
import Icon from './Icon';

interface ChatbotProps {
    isOpen: boolean;
    onClose: () => void;
    contacts: Contact[];
    documents: VanBanPhapLy[];
    workLog: WorkLogEntry[];
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose, contacts, documents, workLog }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                { id: 'welcome', sender: 'bot', text: 'Chào bạn, tôi là Trợ lý Tra cứu. Bạn cần tìm thông tin gì? Ví dụ: "sđt sở tttt", "tra cứu qđ 1603", hoặc "công việc hôm nay".' }
            ]);
        }
    }, [isOpen]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const processUserMessage = (text: string): string => {
        const lowerText = text.toLowerCase().trim();

        // 1. Tra cứu Danh bạ
        if (lowerText.includes('sđt') || lowerText.includes('số điện thoại') || lowerText.includes('liên hệ')) {
            const query = lowerText.replace('sđt', '').replace('số điện thoại', '').replace('liên hệ', '').trim();
            const results = contacts.filter(c => 
                c.name.toLowerCase().includes(query) || 
                c.organization.toLowerCase().includes(query)
            );
            if (results.length > 0) {
                return `Tìm thấy ${results.length} liên hệ:\n` + results.map(c => `- ${c.name} (${c.organization || 'Không rõ'}): ${c.phone}`).join('\n');
            }
            return `Không tìm thấy liên hệ nào cho "${query}".`;
        }

        // 2. Tra cứu Văn bản
        if (lowerText.startsWith('tra cứu') || lowerText.includes('văn bản') || lowerText.includes('quyết định') || lowerText.includes('nghị định')) {
             const query = lowerText.replace('tra cứu', '').replace('văn bản', '').replace('quyết định', '').replace('nghị định', '').trim();
             const results = documents.filter(d => 
                d.ten.toLowerCase().includes(query) || 
                d.moTa.toLowerCase().includes(query) ||
                (d.noiDung && d.noiDung.toLowerCase().includes(query))
             );
             if (results.length > 0) {
                return `Tìm thấy ${results.length} văn bản liên quan:\n` + results.map(d => `- ${d.ten}: ${d.moTa}`).join('\n');
             }
             return `Không tìm thấy văn bản nào cho "${query}".`;
        }
        
        // 3. Tra cứu Nhật ký Công việc
        if (lowerText.includes('nhật ký') || lowerText.includes('công việc')) {
            let results: WorkLogEntry[] = [];
            const dateMatch = lowerText.match(/\d{4}-\d{2}-\d{2}/);

            if (lowerText.includes('hôm nay')) {
                const today = new Date().toISOString().split('T')[0];
                results = workLog.filter(e => e.arrivalDate === today);
            } else if (dateMatch) {
                results = workLog.filter(e => e.arrivalDate === dateMatch[0]);
            } else {
                const query = lowerText.replace('nhật ký', '').replace('công việc', '').trim();
                if (query) {
                    results = workLog.filter(e => 
                        e.dailyStatus.toLowerCase().includes(query) ||
                        e.report.toLowerCase().includes(query) ||
                        e.personInCharge.toLowerCase().includes(query)
                    );
                }
            }
            if (results.length > 0) {
                return `Tìm thấy ${results.length} công việc:\n` + results.map(e => `- Ngày ${e.arrivalDate}: ${e.dailyStatus} (Người phụ trách: ${e.personInCharge})`).join('\n');
            }
            return `Không tìm thấy công việc nào phù hợp.`;
        }

        return 'Tôi chưa hiểu yêu cầu của bạn. Vui lòng thử lại với các từ khóa như "số điện thoại", "tra cứu văn bản", hoặc "nhật ký công việc".';
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMessage: ChatMessage = {
            id: `user_${Date.now()}`,
            text: inputValue,
            sender: 'user',
        };

        const botResponseText = processUserMessage(inputValue);
        const botMessage: ChatMessage = {
            id: `bot_${Date.now()}`,
            text: botResponseText,
            sender: 'bot'
        };

        setMessages(prev => [...prev, userMessage, botMessage]);
        setInputValue('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40 flex justify-center items-center animate-fade-in" onClick={onClose}>
            <div 
                className="fixed bottom-6 right-6 w-full max-w-md h-[70vh] bg-white rounded-2xl shadow-2xl flex flex-col transform transition-all"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex-shrink-0 p-4 border-b border-slate-200 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                            <Icon path="M8.625 12a.375.375 0 01.375-.375h6a.375.375 0 010 .75h-6a.375.375 0 01-.375-.375zm0 3a.375.375 0 01.375-.375h6a.375.375 0 010 .75h-6a.375.375 0 01-.375-.375zm0 3a.375.375 0 01.375-.375h6a.375.375 0 010 .75h-6a.375.375 0 01-.375-.375zM4.5 6.375c0-1.036.84-1.875 1.875-1.875h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 014.5 17.625V6.375z" className="w-5 h-5 text-blue-700" />
                        </div>
                        <h3 className="font-semibold text-slate-800">Trợ lý Tra cứu</h3>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-200">
                        <Icon path="M6 18L18 6M6 6l12 12" className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0"><Icon path="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15-3.75h1.5m15 0h1.5M8.25 21v-1.5M12 4.5V3m0 18v-1.5m3.75-15h-1.5m-3.75 0h1.5m-3.75 0h1.5m0 15h1.5m0 0h1.5" className="w-5 h-5 text-slate-500"/></div>}
                            <div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="flex-shrink-0 p-4 border-t border-slate-200">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            placeholder="Hỏi về văn bản..."
                            className="w-full px-4 py-2 border border-slate-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <button type="submit" className="p-3 bg-blue-600 text-white rounded-full shadow-sm hover:bg-blue-700 transition-colors flex-shrink-0">
                            <Icon path="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" className="w-5 h-5"/>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
