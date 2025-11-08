"use client";

import { useState } from "react";

export default function GroupsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-purple-400">Groups</h1>
      <p className="text-gray-300">
        Create or join peer coding groups and collaborate in real-time.
      </p>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg"
        >
          ➕ Create Group
        </button>
        <button
          onClick={() => setShowJoinModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
        >
          🔗 Join Group
        </button>
      </div>

      {/* Placeholder Groups List */}
      <div className="mt-8">
        <h2 className="text-xl text-gray-200 mb-2">Your Groups</h2>
        <div className="p-4 bg-white/5 rounded-lg border border-white/10 text-gray-400">
          No groups yet. Create or join one to get started.
        </div>
      </div>

      {/* Modal - Create Group */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold text-purple-400 mb-4">Create Group</h2>
            <input
              type="text"
              placeholder="Enter group name"
              className="w-full p-2 rounded bg-black/20 border border-gray-600"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="mr-2 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-500">
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal - Join Group */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold text-blue-400 mb-4">Join Group</h2>
            <input
              type="text"
              placeholder="Enter invite code"
              className="w-full p-2 rounded bg-black/20 border border-gray-600"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowJoinModal(false)}
                className="mr-2 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500">
                Join
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
