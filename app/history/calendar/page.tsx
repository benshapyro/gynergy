"use client";

import { useEffect, useState } from "react";

export default function HistoryCalendarPage() {
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    // We'll reuse the same /api/history. Adjust accordingly
    const res = await fetch("/api/history");
    if (res.ok) {
      const data = await res.json();
      setEntries(data);
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Journal History (Calendar View)</h1>
      <p>In real usage, integrate a React calendar library to highlight days with entries.</p>
      <ul>
        {entries.map((entry) => (
          <li key={entry.id}>
            {new Date(entry.date).toDateString()}: {entry.text.slice(0, 50)}...
          </li>
        ))}
      </ul>
    </main>
  );
}
