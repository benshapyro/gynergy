"use client";

import { useEffect, useState } from "react";

type JournalEntry = {
  id: number;
  user_id: string;
  date: string;
  text: string;
};

export default function HistoryListPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selected, setSelected] = useState<JournalEntry | null>(null);
  const [newText, setNewText] = useState("");

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    const res = await fetch("/api/history"); 
    // you'd need an /api/history route to fetch all entries
    if (res.ok) {
      const data = await res.json();
      setEntries(data);
    }
  }

  // For demonstration, we can create or re-use /api/journal route to fetch entries
  // or we can store them in SSR. This is placeholder logic.

  const handleEdit = (entry: JournalEntry) => {
    setSelected(entry);
    setNewText(entry.text);
  };

  const handleSave = async () => {
    if (!selected) return;
    // you'd call an update route:
    try {
      const res = await fetch("/api/journal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryId: selected.id, text: newText }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Refresh
      setSelected(null);
      setNewText("");
      fetchEntries();
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>Journal History (List View)</h1>
      <ul>
        {entries.map((entry) => (
          <li key={entry.id} style={{ margin: "10px 0" }}>
            <div>
              <strong>{new Date(entry.date).toDateString()}:</strong> {entry.text.slice(0, 50)}...
            </div>
            <button onClick={() => handleEdit(entry)}>Edit</button>
          </li>
        ))}
      </ul>

      {selected && (
        <div style={{ marginTop: 20 }}>
          <h3>Edit Entry from {new Date(selected.date).toDateString()}</h3>
          <textarea
            rows={5}
            cols={50}
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
          <br />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setSelected(null)}>Cancel</button>
        </div>
      )}
    </main>
  );
}
