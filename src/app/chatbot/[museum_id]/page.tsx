'use client'

import { Suspense, useEffect, useState } from 'react';
import { notFound, useParams, usePathname } from 'next/navigation';
import ChatInterface from '@/components/ChatInterface';
import { fetchMuseumDetails } from '@/actions/museum.actions';
import { MuseumDetails } from '@/types/museum';
import NotFound from '@/app/not-found';

export default function ChatbotPage() {
  const [museumDetails, setMuseumDetails] = useState<MuseumDetails | null>(null);
  const pathName = usePathname();
  const id = pathName?.split('/').pop() || '';

  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    async function getMuseumDetails() {
      if (typeof id !== 'string') {
        return <NotFound />
      }
      try {
        const results = await fetchMuseumDetails(id);
        console.log(results);
        setMuseumDetails(results);
      } catch (error) {
        console.error('Error fetching museum details:', error);
        setError(true);
      }
    }

    getMuseumDetails();
  }, [id]);

  console.log(museumDetails);

  if (!museumDetails) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <NotFound />
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{museumDetails.name} Chatbot</h1>
      <ChatInterface museumId={id as string} museumDetails={museumDetails} />
    </div>
  );
}