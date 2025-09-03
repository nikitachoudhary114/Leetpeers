"use client";

import { useState } from "react";
import axios from "axios";

export default function ProfileForm({ user }: { user: any }) {
  const [form, setForm] = useState(user);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.put("/api/profile", form);
      setEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl p-6 shadow space-y-4">
      {/* Editable fields */}
      {[
        "name",
        "username",
        "bio",
        "leetcodeProfile",
        "githubProfile",
        "linkedinProfile",
        "country",
        "avatarUrl",
      ].map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium mb-1 capitalize">
            {field}
          </label>
          {editing ? (
            <input
              type="text"
              name={field}
              value={form[field] || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          ) : (
            <p className="text-gray-700">{form[field] || "-"}</p>
          )}
        </div>
      ))}

      {/* Read-only fields */}
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <p className="text-gray-700">{form.email}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Streak Count</label>
          <p className="text-gray-700">{form.streakCount}</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Problems Solved
          </label>
          <p className="text-gray-700">{form.problemsSolved}</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Joined</label>
        <p className="text-gray-700">
          {new Date(form.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Rooms */}
      <div>
        <label className="block text-sm font-medium mb-2">Joined Rooms</label>
        <ul className="list-disc ml-6 space-y-1">
          {form.rooms?.length > 0 ? (
            form.rooms.map((room: any) => (
              <li key={room.id}>
                {room.name} ({room.code})
              </li>
            ))
          ) : (
            <p className="text-gray-500">No joined rooms</p>
          )}
        </ul>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Owned Rooms</label>
        <ul className="list-disc ml-6 space-y-1">
          {form.ownedRooms?.length > 0 ? (
            form.ownedRooms.map((room: any) => (
              <li key={room.id}>
                {room.name} ({room.code})
              </li>
            ))
          ) : (
            <p className="text-gray-500">No owned rooms</p>
          )}
        </ul>
      </div>

      {/* Action buttons */}
      {editing ? (
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => setEditing(false)}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Edit Profile
        </button>
      )}
    </div>
  );
}
