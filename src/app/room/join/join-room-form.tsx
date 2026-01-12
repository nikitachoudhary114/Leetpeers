"use client";

import { useState } from "react";

export default function JoinRoomForm() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/room/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessage(`✅ Joined room "${data.name}" successfully`);
      setCode("");
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Enter room code"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Joining..." : "Join Room"}
      </button>

      {message && <p className="text-center text-sm mt-2">{message}</p>}
    </form>
  );
}