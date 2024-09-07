'use client';

import { useState } from 'react';
import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MuseumDetails } from '@/types/museum';

interface ChatInterfaceProps {
  museumId: string;
  museumDetails: MuseumDetails;
}

export default function ChatInterface({ museumId, museumDetails }: ChatInterfaceProps) {
  const [language, setLanguage] = useState('en');

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: `/api/chat/${museumId}`,
    initialMessages: [
      {
        id: 'system',
        role: 'system',
        content: `You are a helpful museum assistant chatbot for ${museumDetails.name}. Respond in ${language}. Only answer questions related to the museum or services mentioned in the problem statement. If a question is not relevant, politely ask the user to ask museum-related questions.`,
      },
    ],
  });

  return (
    <div className="flex flex-col h-[600px]">
      <ScrollArea className="flex-grow p-4 border rounded-md">
        {messages.map((message) => (
          <div key={message.id} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className="px-2 py-1 rounded-lg bg-gray-100 inline-block">
              {message.content}
            </span>
          </div>
        ))}
      </ScrollArea>
      <form onSubmit={handleSubmit} className="mt-4 flex">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message here..."
          className="flex-grow mr-2"
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}