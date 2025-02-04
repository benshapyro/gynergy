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

  useEffect(() => {
    async function fetchDailyQuote() {
      try {
        const supabase = createClient();
        const today = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from('daily_quotes')
          .select('quote, author')
          .eq('active_date', today)
          .limit(1);

        if (error) throw error;

        if (!data || data.length === 0) {
          const { data: randomQuote, error: randomError } = await supabase
            .from('daily_quotes')
            .select('quote, author')
            .limit(1);

          if (randomError) throw randomError;
          if (!randomQuote || randomQuote.length === 0) {
            setQuote({
              quote: "Every moment is a fresh beginning.",
              author: "T.S. Eliot"
            });
            return;
          }
          
          setQuote(randomQuote[0]);
          return;
        }

        setQuote(data[0]);
      } catch (err) {
        console.error('Error:', err);
        setQuote({
          quote: "Every moment is a fresh beginning.",
          author: "T.S. Eliot"
        });
      } finally {
        setLoading(false);
      }
    }

    fetchDailyQuote();
  }, []);

  return (
    <div className="quote-wrapper">
      <div className="quote-section">
        {loading ? (
          <p className="quote-text loading">Loading your daily inspiration...</p>
        ) : (
          <>
            <p className="quote-text">{quote?.quote || "Every moment is a fresh beginning."}</p>
            <p className="quote-author">{quote?.author || "T.S. Eliot"}</p>
          </>
        )}
      </div>

      <style jsx>{`
        .quote-wrapper {
          position: relative;
          width: 100%;
          padding-bottom: 1.5rem;
        }

        .quote-wrapper::before,
        .quote-wrapper::after {
          content: '';
          position: absolute;
          left: 8px;
          right: 8px;
          height: 100%;
          background: rgb(28, 28, 36);
          border-radius: 20px;
          z-index: -1;
        }

        .quote-wrapper::before {
          bottom: -8px;
          opacity: 0.6;
        }

        .quote-wrapper::after {
          bottom: -16px;
          opacity: 0.3;
        }

        .quote-section {
          position: relative;
          width: 100%;
          padding: 3.5rem 3rem;
          background: rgb(16, 16, 24);
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .quote-text {
          font-size: 2.25rem;
          font-weight: 600;
          line-height: 1.3;
          color: rgb(255, 255, 255);
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .quote-text.loading {
          opacity: 0.5;
        }

        .quote-author {
          font-size: 1.125rem;
          color: rgb(255, 200, 120);
          font-weight: 500;
          letter-spacing: 0.02em;
          opacity: 0.9;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .quote-author::before {
          content: "—";
          color: rgb(255, 200, 120);
          opacity: 0.7;
        }

        @media (max-width: 768px) {
          .quote-section {
            padding: 3rem 2rem;
          }

          .quote-text {
            font-size: 1.75rem;
          }

          .quote-author {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .quote-wrapper::before {
            bottom: -6px;
          }

          .quote-wrapper::after {
            bottom: -12px;
          }

          .quote-section {
            padding: 2.5rem 1.5rem;
          }
          
          .quote-text {
            font-size: 1.5rem;
            margin-bottom: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
} 