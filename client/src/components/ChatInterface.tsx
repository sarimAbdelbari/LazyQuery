import { useState, useRef, useEffect } from 'react';
import { sendChatQuery, checkChatStatus, type ChatMessage } from '../services/api';
import { Copy, Check, AlertCircle, Loader2, Database } from 'lucide-react';

interface ChatInterfaceProps {
  schemaContent: string;
  moduleName: string;
  onBack: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sqlQuery?: string;
  explanation?: string;
  error?: boolean;
}

export const ChatInterface = ({ schemaContent, moduleName, onBack }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [ollamaStatus, setOllamaStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check Ollama status on mount
  useEffect(() => {
    checkOllamaConnection();
  }, []);

  const checkOllamaConnection = async () => {
    const status = await checkChatStatus();
    if (status.success && status.connected) {
      setOllamaStatus('connected');
      if (!status.hasMistral) {
        setMessages([{
          role: 'assistant',
          content: 'Warning: Mistral model not found. Available models: ' + (status.models?.join(', ') || 'none'),
          error: true,
        }]);
      }
    } else {
      setOllamaStatus('error');
      setMessages([{
        role: 'assistant',
        content: 'Cannot connect to Ollama. Please ensure Ollama is running with: ollama serve',
        error: true,
      }]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Build conversation history
      const conversationHistory: ChatMessage[] = messages
        .filter(m => m.role === 'user' || (m.role === 'assistant' && m.sqlQuery))
        .slice(-6) // Last 3 exchanges
        .reduce((acc, msg, i, arr) => {
          if (msg.role === 'user' && arr[i + 1]?.role === 'assistant') {
            acc.push({
              user: msg.content,
              assistant: arr[i + 1].sqlQuery || arr[i + 1].content,
            });
          }
          return acc;
        }, [] as ChatMessage[]);

      // Send query to backend
      const response = await sendChatQuery({
        schemaContent,
        userQuery: userMessage,
        conversationHistory,
      });

      if (response.success && response.sqlQuery) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response.sqlQuery || '',
          sqlQuery: response.sqlQuery,
          explanation: response.explanation,
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response.error || 'Failed to generate SQL query',
          error: true,
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'An error occurred while generating the query',
        error: true,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-blue-400" />
                <div>
                  <h1 className="text-lg font-semibold">Chat with {moduleName}</h1>
                  <p className="text-xs text-gray-400">Ask questions in natural language</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {ollamaStatus === 'checking' && (
                <span className="text-xs text-gray-400">Checking Ollama...</span>
              )}
              {ollamaStatus === 'connected' && (
                <span className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Connected
                </span>
              )}
              {ollamaStatus === 'error' && (
                <span className="text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Offline
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {messages.length === 0 && ollamaStatus === 'connected' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-2xl font-bold mb-2">Start a Conversation</h2>
              <p className="text-gray-400 mb-6">Ask questions about your database in natural language</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                <button
                  onClick={() => setInput('Show me all products with their categories')}
                  className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-left text-sm transition-colors"
                >
                  Show me all products with their categories
                </button>
                <button
                  onClick={() => setInput('List all suppliers with their contact information')}
                  className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-left text-sm transition-colors"
                >
                  List all suppliers with their contact information
                </button>
                <button
                  onClick={() => setInput('Get the total quantity of each product in stock')}
                  className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-left text-sm transition-colors"
                >
                  Get the total quantity of each product in stock
                </button>
                <button
                  onClick={() => setInput('Find all purchase orders from the last 30 days')}
                  className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-left text-sm transition-colors"
                >
                  Find all purchase orders from the last 30 days
                </button>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : message.error
                      ? 'bg-red-900/30 border border-red-800'
                      : 'bg-gray-800'
                  } rounded-lg p-4`}
                >
                  {message.role === 'user' ? (
                    <p className="text-sm">{message.content}</p>
                  ) : message.error ? (
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-200">{message.content}</p>
                    </div>
                  ) : (
                    <div>
                      {message.sqlQuery && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-400 font-semibold">SQL QUERY</span>
                            <button
                              onClick={() => copyToClipboard(message.sqlQuery!, index)}
                              className="text-gray-400 hover:text-white transition-colors p-1"
                              title="Copy SQL"
                            >
                              {copiedIndex === index ? (
                                <Check className="w-4 h-4 text-green-400" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                          <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
                            <code className="text-blue-300">{message.sqlQuery}</code>
                          </pre>
                        </div>
                      )}
                      {message.explanation && (
                        <div className="text-sm text-gray-300">
                          <span className="text-xs text-gray-400 font-semibold">EXPLANATION</span>
                          <p className="mt-1">{message.explanation}</p>
                        </div>
                      )}
                      {!message.sqlQuery && !message.explanation && (
                        <p className="text-sm">{message.content}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 rounded-lg p-4">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-800 bg-gray-900/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about your database..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 resize-none"
              rows={1}
              disabled={ollamaStatus !== 'connected' || isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading || ollamaStatus !== 'connected'}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg font-medium transition-colors"
            >
              {isLoading ? 'Generating...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

