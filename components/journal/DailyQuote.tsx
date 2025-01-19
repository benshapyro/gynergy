'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-client';

interface Quote {
  quote: string;
  author: string;
}

export function DailyQuote() {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    async function fetchDailyQuote() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('daily_quotes')
        .select('quote, author')
        .eq('active_date', new Date().toISOString().split('T')[0])
        .single();

      if (error) {
        console.error('Error fetching quote:', error);
        return;
      }

      setQuote(data);
    }

    fetchDailyQuote();
  }, []);

  if (!quote) return null;

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <blockquote className="text-xl italic font-semibold text-gray-900">
          <p>"{quote.quote}"</p>
          {quote.author && (
            <footer className="mt-3 text-gray-500">— {quote.author}</footer>
          )}
        </blockquote>
      </div>
    </div>
  );
} 