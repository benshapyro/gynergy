"use client";

import { useState } from "react";

export default function JournalEditor() {
  const [text, setText] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState("");

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!photoFile) {
      setFeedback("No file selected.");
      return;
    }
    setFeedback("Uploading & processing OCR...");

    try {
      const formData = new FormData();
      formData.append("file", photoFile);

      const res = await fetch("/api/journal/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Insert the recognized text
      setText(data.text);
      setFeedback("OCR successful! Text inserted.");
    } catch (err: any) {
      setFeedback(err.message);
    }
  };

  const handleSave = async () => {
    setFeedback("Saving your journal entry...");
    try {
      const date = new Date().toISOString().split('T')[0];
      const payload = {
        date,
        morning_completed: true,
        morning_mood_score: 5,
        morning_mood_factors: [],
        morning_reflection: text,
        morning_points: 5,
        evening_completed: false,
        evening_mood_score: null,
        evening_mood_factors: [],
        evening_reflection: "",
        evening_points: 0,
        gratitude_action_completed: false,
        gratitude_action_points: 0,
        total_points: 5
      };

      const res = await fetch("/api/journal/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setFeedback(`Saved! Streak: ${data.streak}, Points: ${data.points}`);
    } catch (err: any) {
      setFeedback(err.message);
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Write Today's Journal</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        cols={50}
      />
      <br />
      <button onClick={handleSave}>Save Entry</button>

      <hr />
      <h3>Or Upload a Photo for OCR</h3>
      <input type="file" accept="image/*" onChange={handlePhotoChange} />
      <button onClick={handleUpload}>Upload & OCR</button>

      <p>{feedback}</p>
    </div>
  );
}
