'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-client';

interface Quote {
  quote: string;
  author: string;
}

export function DailyQuote() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDailyQuote() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('daily_quotes')
          .select('quote, author')
          .eq('active_date', new Date().toISOString().split('T')[0])
          .single();

        if (error) {
          console.error('Error fetching quote:', error);
          setError(error.message);
          return;
        }

        setQuote(data);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to fetch quote');
      } finally {
        setLoading(false);
      }
    }

    fetchDailyQuote();
  }, []);

  if (loading) {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <p className="text-gray-500">No quote available for today.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quote-container">
      <p className="quote-text">{quote.quote}</p>
      <p className="quote-author">— {quote.author}</p>

      <style jsx>{`
        .quote-container {
          position: relative;
          z-index: 1;
        }

        .quote-text {
          position: relative;
          font-size: 2rem;
          font-weight: 600;
          line-height: 1.4;
          color: rgb(240, 240, 240);
          text-align: center;
          letter-spacing: -0.02em;
          margin-bottom: 1.5rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .quote-author {
          font-size: 1.125rem;
          color: rgb(160, 160, 160);
          text-align: center;
          font-weight: 500;
          letter-spacing: 0.05em;
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .quote-text {
            font-size: 1.5rem;
          }

          .quote-author {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
} 