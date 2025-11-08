export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-purple-400">Dashboard</h1>
      <p className="text-gray-300">
        Start collaborating, solving coding problems, and connecting with peers!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-white/10 p-6 rounded-xl border border-white/10 shadow-lg hover:bg-white/20 transition">
          <h2 className="text-xl font-semibold mb-2">👥 Peer Groups</h2>
          <p className="text-gray-400">Create or join a coding group.</p>
        </div>

        <div className="bg-white/10 p-6 rounded-xl border border-white/10 shadow-lg hover:bg-white/20 transition">
          <h2 className="text-xl font-semibold mb-2">📝 Real-time Collaboration</h2>
          <p className="text-gray-400">Solve coding problems with peers.</p>
        </div>

        <div className="bg-white/10 p-6 rounded-xl border border-white/10 shadow-lg hover:bg-white/20 transition">
          <h2 className="text-xl font-semibold mb-2">🏆 Your Stats</h2>
          <p className="text-gray-400">Track your progress & achievements.</p>
        </div>
      </div>
    </div>
  );
}
