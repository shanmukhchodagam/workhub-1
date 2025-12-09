'use client';

import { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '@/hooks/use-websocket';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, User, Bot, LogOut, Crown, Settings, ChevronDown, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/app/context/AuthContext';

export default function WorkerChat() {
    const { user, logout } = useAuth();
    const [input, setInput] = useState('');
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const wsUrl = user ? `ws://localhost:8000/ws/worker/${user.user_id}` : '';
    const { messages, sendMessage, isConnected } = useWebSocket(wsUrl);

    // Load chat history when component mounts
    useEffect(() => {
        const loadChatHistory = async () => {
            if (!user) return;
            
            setIsLoadingHistory(true);
            try {
                const token = localStorage.getItem('token');
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                const res = await fetch(`${apiUrl}/my-messages`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                
                if (res.ok) {
                    const history = await res.json();
                    setChatHistory(history);
                } else {
                    console.error('Failed to load chat history:', await res.text());
                }
            } catch (error) {
                console.error('Error loading chat history:', error);
            } finally {
                setIsLoadingHistory(false);
            }
        };

        loadChatHistory();
    }, [user]);

    const allMessages = [...chatHistory, ...messages];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [allMessages]);

    const handleSend = () => {
        if (input.trim()) {
            sendMessage(input);
            setInput('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <ProtectedRoute allowedRoles={['Worker', 'Employee']}>
            <div className="flex flex-col h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6 lg:py-4">
                    <div className="flex items-center justify-between">
                        {/* Left side - App title and status */}
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <MessageCircle className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
                                <div>
                                    <h1 className="text-lg lg:text-xl font-semibold text-gray-900">WorkHub Assistant</h1>
                                    <div className="flex items-center space-x-2">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            isConnected ? "bg-green-500" : "bg-red-500"
                                        )} />
                                        <span className="text-xs lg:text-sm text-gray-500">
                                            {isConnected ? 'Connected' : 'Disconnected'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right side - User profile */}
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center space-x-2 lg:space-x-3 p-2 lg:p-3 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-blue-600 flex items-center justify-center">
                                    <span className="text-white text-sm lg:text-base font-medium">
                                        {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                                    </span>
                                </div>
                                <div className="hidden lg:block text-left">
                                    <div className="text-sm font-medium text-gray-900">
                                        {user?.full_name || user?.email?.split('@')[0] || 'User'}
                                    </div>
                                    <div className="text-xs text-gray-500">{user?.email}</div>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>

                            {/* Profile dropdown */}
                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                    <div className="py-2">
                                        <div className="px-4 py-2 border-b border-gray-100 lg:hidden">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user?.full_name || user?.email?.split('@')[0] || 'User'}
                                            </div>
                                            <div className="text-xs text-gray-500">{user?.email}</div>
                                        </div>
                                        
                                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            <Settings className="w-4 h-4 mr-3" />
                                            Settings
                                        </button>
                                        
                                        <button 
                                            onClick={logout}
                                            className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                        >
                                            <LogOut className="w-4 h-4 mr-3" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Chat Messages */}
                <div className="flex-1 overflow-hidden">
                    <div className="h-full overflow-y-auto px-4 py-4 lg:px-6 lg:py-6 space-y-4">
                        {isLoadingHistory && (
                            <div className="flex items-center justify-center py-8">
                                <div className="flex items-center space-x-2 text-gray-500">
                                    <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                                    <span className="text-sm">Loading chat history...</span>
                                </div>
                            </div>
                        )}
                        
                        {allMessages.length === 0 && !isLoadingHistory && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <MessageCircle className="w-12 h-12 text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-600 mb-2">No messages yet</h3>
                                <p className="text-sm text-gray-400 max-w-md">
                                    Start a conversation! Ask questions, report issues, or get help from our AI assistant.
                                </p>
                            </div>
                        )}
                        
                        {allMessages.map((msg, idx) => {
                            let content = typeof msg === 'string' ? msg : msg.content;
                            let senderLabel = 'System';
                            let isFromUser = false;
                            let isFromAgent = false;
                            let isFromManager = false;

                            if (typeof msg === 'object' && msg.sender) {
                                switch (msg.sender) {
                                    case 'Worker':
                                        senderLabel = 'You';
                                        isFromUser = true;
                                        break;
                                    case 'Manager':
                                        senderLabel = 'Manager';
                                        isFromManager = true;
                                        break;
                                    default:
                                        senderLabel = msg.sender;
                                }
                            } else {
                                if (content?.startsWith('You:')) {
                                    content = content.replace(/^You:\s*/, '');
                                    senderLabel = 'You';
                                    isFromUser = true;
                                } else if (content?.startsWith('🤖 AI:')) {
                                    content = content.replace(/^🤖 AI:\s*/, '');
                                    senderLabel = 'AI Assistant';
                                    isFromAgent = true;
                                } else if (content?.startsWith('Manager:')) {
                                    content = content.replace(/^Manager:\s*/, '');
                                    senderLabel = 'Manager';
                                    isFromManager = true;
                                }
                            }

                            return (
                                <div key={idx} className={cn("flex", isFromUser ? "justify-end" : "justify-start")}>
                                    <div className={cn(
                                        "max-w-[85%] lg:max-w-[70%] rounded-2xl px-4 py-3 lg:px-5 lg:py-4 shadow-sm",
                                        isFromUser 
                                            ? "bg-blue-600 text-white" 
                                            : isFromAgent 
                                                ? "bg-green-50 text-green-800 border border-green-200"
                                                : isFromManager
                                                    ? "bg-purple-50 text-purple-800 border border-purple-200"
                                                    : "bg-white text-gray-800 border border-gray-200"
                                    )}>
                                        <div className="flex items-center gap-2 mb-1">
                                            {isFromUser && <User size={14} />}
                                            {isFromAgent && <Bot size={14} />}
                                            {isFromManager && <Crown size={14} />}
                                            <span className="text-xs font-medium opacity-80">{senderLabel}</span>
                                        </div>
                                        <div className="text-sm lg:text-base whitespace-pre-wrap leading-relaxed">{content}</div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
                
                {/* Message Input */}
                <div className="bg-white border-t border-gray-200 px-4 py-4 lg:px-6 lg:py-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-end space-x-3">
                            <div className="flex-1">
                                <textarea
                                    placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    disabled={!isConnected}
                                    rows={1}
                                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm lg:text-base placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    style={{ minHeight: '44px', maxHeight: '120px' }}
                                />
                            </div>
                            <Button 
                                onClick={handleSend} 
                                disabled={!isConnected || !input.trim()}
                                size="lg"
                                className="rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 h-11 px-6"
                            >
                                <Send size={18} />
                                <span className="ml-2 hidden lg:inline">Send</span>
                            </Button>
                        </div>
                        
                        {!isConnected && (
                            <div className="mt-2 text-center">
                                <span className="text-xs text-red-500 bg-red-50 px-3 py-1 rounded-full">
                                    Connection lost. Trying to reconnect...
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Click outside to close profile menu */}
            {showProfileMenu && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowProfileMenu(false)}
                />
            )}
        </ProtectedRoute>
    );
}
