"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [name, setName] = useState("");

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session]);

  const handleSave = async () => {
    const res = await fetch("/api/profile/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      alert("✅ Profile Updated Successfully");
    } else {
      alert("❌ Error updating profile");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white/10 rounded-lg shadow-lg border border-white/10">
      <h2 className="text-3xl font-bold text-purple-400 mb-6">Your Profile</h2>

      <label className="block text-gray-300 mb-2">Name</label>
      <input
        className="w-full p-2 mb-4 bg-black/40 border border-gray-600 rounded-lg"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label className="block text-gray-300 mb-2">Email</label>
      <input
        className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded-lg"
        value={session?.user?.email || ""}
        disabled
      />

      <button
        onClick={handleSave}
        className="w-full bg-purple-600 hover:bg-purple-500 transition py-2 rounded-lg"
      >
        Save Changes
      </button>
    </div>
  );
}
