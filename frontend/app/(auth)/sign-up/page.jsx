"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    await signIn("credentials", {
      email: form.email,
      password: form.password,
      callbackUrl: "/dashboard",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-stone-100 px-4">

      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg border border-stone-200 rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center text-stone-900 mb-2">
          Create Account 🚀
        </h1>

        <p className="text-center text-stone-500 mb-6">
          Start generating AI-powered recipes
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition"
            disabled={loading}
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

        </form>

        <p className="text-center text-sm text-stone-500 mt-6">
          Already have an account?{" "}
          <a href="/sign-in" className="text-orange-600 hover:underline">
            Sign in
          </a>
        </p>

      </div>
    </div>
  );
}