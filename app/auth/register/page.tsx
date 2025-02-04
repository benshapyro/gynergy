"use client";

import { useState, FormEvent } from "react";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      // Create a Supabase client (browser version)
      const supabase = createClient();

      // Use signUp API from Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            // Initialize any desired fields in user_metadata
            streak_count: 0,
            total_points: 0,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      // If sign-up is successful:
      setMessage("Registration successful. Please check your email to confirm.");
      // Optionally navigate away or show a "Check your email" screen
      setTimeout(() => router.push("/auth/login"), 1500);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>Register</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", width: 200 }}
      >
        <label>Name</label>
        <input
          name="name"
          onChange={handleChange}
          value={formData.name}
          required
        />
        <label>Email</label>
        <input
          name="email"
          type="email"
          onChange={handleChange}
          value={formData.email}
          required
        />
        <label>Password</label>
        <input
          name="password"
          type="password"
          onChange={handleChange}
          value={formData.password}
          required
        />
        <br />
        <button type="submit">Sign Up</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}
      </form>
    </main>
  );
}
