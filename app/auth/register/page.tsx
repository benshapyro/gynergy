"use client";

import { useState, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Example: Insert user record in Supabase "User" table. 
    // NOTE: You might do a real sign-up in NextAuth or via Supabase Auth.
    
    try {
      const { data, error } = await supabase
        .from("User")
        .insert({
          name: formData.name,
          email: formData.email,
          password: formData.password, // Not recommended to store plain text in real code
          streak: 0,
          points: 0,
        })
        .select()
        .single();

      if (error) {
        setError(error.message);
      } else {
        setMessage("Registration successful. Please login.");
        setTimeout(() => router.push("/(auth)/login"), 1500);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: 200 }}>
        <label>Name</label>
        <input name="name" onChange={handleChange} value={formData.name} />
        <label>Email</label>
        <input name="email" onChange={handleChange} value={formData.email} />
        <label>Password</label>
        <input name="password" type="password" onChange={handleChange} value={formData.password} />
        <br />
        <button type="submit">Sign Up</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}
      </form>
    </main>
  );
}
