import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Send } from 'lucide-react';
import ReactMarkdown from "react-markdown";

interface ChatProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
}

interface ChatMessage {
  sender: 'user' | 'bot';
  message: string;
}

export function Chat({
  inputMessage,
  setInputMessage,
  isChatOpen,
  setIsChatOpen
}: ChatProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const userMessage: ChatMessage = { sender: 'user', message: inputMessage };
      setChatMessages([...chatMessages, userMessage]);

      try {
        const response = await fetch('http://127.0.0.1:5000/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: inputMessage }),
        });

        if (response.ok) {
          const data = await response.json();
          const botMessage: ChatMessage = { sender: 'bot', message: data.response };
          setChatMessages((prevMessages) => [...prevMessages, botMessage]);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
      setInputMessage('');
    }
  };

  return (
    <div className="fixed inset-x-0 top-5 bottom-5 md:right-10 md:left-auto md:w-96 bg-background z-50 shadow-xl rounded-lg overflow-hidden">
      <Card className="w-full h-full flex flex-col">
        <CardHeader className="flex flex-row justify-between items-center p-4">
          <CardTitle className="text-xl">Chat</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => setIsChatOpen(false)}>
            <X className="h-6 w-6" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4">
          {chatMessages.map((chatMessage, index) => (
            <div
              key={index}
              className={`mb-3 p-3 rounded-lg text-sm ${chatMessage.sender === 'user' ? 'bg-primary text-right ml-auto' : 'bg-muted text-left'}`}
              style={{ maxWidth: 'max-content', wordWrap: 'break-word' }}
            >
              <p className="font-bold">{chatMessage.sender}</p>
              <ReactMarkdown>{chatMessage.message}</ReactMarkdown>
            </div>
          ))}
        </CardContent>
        <div className="p-4 flex border-t">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 mr-3 p-2"
          />
          <Button onClick={handleSendMessage} size="lg">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </Card>
    </div>
  );
}

