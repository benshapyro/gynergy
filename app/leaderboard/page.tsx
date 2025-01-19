"use client";

import { useState, useEffect } from "react";

type LeaderboardUser = {
  id: string;
  name: string;
  streak: number;
  points: number;
};

export default function LeaderboardPage() {
  const [tab, setTab] = useState<"streaks" | "points">("streaks");
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchLeaderboard() {
      setError("");
      try {
        const res = await fetch(`/api/leaderboard/${tab}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      }
    }
    fetchLeaderboard();
  }, [tab]);

  return (
    <main style={{ padding: 20 }}>
      <h1>Leaderboard</h1>
      <div>
        <button onClick={() => setTab("streaks")}>Streaks</button>
        <button onClick={() => setTab("points")}>Points</button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {users.map((u, index) => (
          <li key={u.id}>
            #{index + 1} {u.name || "Anon"} —{" "}
            {tab === "streaks"
              ? `Streak: ${u.streak}`
              : `Points: ${u.points}`}
          </li>
        ))}
      </ul>
    </main>
  );
}
