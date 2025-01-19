"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      if (data.error) {
        setMessage(data.error);
      } else {
        setProfile(data.user);
        setName(data.user.name || "");
        setEmail(data.user.email || "");
        setProfilePicture(data.user.profile_picture || "");
      }
    } catch (err: any) {
      setMessage(err.message);
    }
  }

  async function saveProfile() {
    setMessage("");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, profilePicture }),
      });
      const data = await res.json();
      if (data.error) {
        setMessage(data.error);
      } else {
        setProfile(data.user);
        setMessage("Profile updated!");
      }
    } catch (err: any) {
      setMessage(err.message);
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Profile</h1>
      <div>
        <label>Name</label><br />
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Email</label><br />
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Profile Picture URL</label><br />
        <input
          value={profilePicture}
          onChange={(e) => setProfilePicture(e.target.value)}
        />
      </div>
      <br />
      <button onClick={saveProfile}>Save</button>
      <p>{message}</p>
      {profile?.streak !== undefined && (
        <p>Streak: {profile.streak} | Points: {profile.points}</p>
      )}
    </main>
  );
}
