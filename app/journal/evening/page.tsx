'use client';

import { EveningJournal } from '@/components/journal/EveningJournal';

export default function EveningJournalPage() {
  return (
    <main className="page-container">
      <EveningJournal />

      <style jsx>{`
        .page-container {
          min-height: 100vh;
          background: linear-gradient(
            to bottom,
            rgb(8, 8, 12),
            rgb(16, 16, 24)
          );
          padding: 2rem 0;
        }

        @media (max-width: 768px) {
          .page-container {
            padding: 1rem 0;
          }
        }
      `}</style>
    </main>
  );
} 