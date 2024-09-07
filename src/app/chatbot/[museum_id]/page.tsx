import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import ChatInterface from '@/components/ChatInterface';
import { fetchMuseumDetails } from '@/actions/museum.actions';

export default async function ChatbotPage({ params }: { params: { museum_id: string } }) {
  const museumDetails = await fetchMuseumDetails(params.museum_id);

  if (!museumDetails) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{museumDetails.name} Chatbot</h1>
      <Suspense fallback={<div>Loading chatbot...</div>}>
        <ChatInterface museumId={params.museum_id} museumDetails={museumDetails} />
      </Suspense>
    </div>
  );
}