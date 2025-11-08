import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import "../globals.css";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-black/30 backdrop-blur-lg border-r border-white/10 p-6 space-y-6">
        <h2 className="text-2xl font-bold text-purple-400">Leetpeers</h2>
        <nav className="flex flex-col space-y-4">
          <Link href="/dashboard" className="hover:text-purple-400">
            🏠 Dashboard
          </Link>
          <Link href="/dashboard/groups" className="hover:text-purple-400">
            👥 Groups
          </Link>
          <Link href="/dashboard/profile" className="hover:text-purple-400">
            👤 Profile
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <div className="w-full bg-black/30 backdrop-blur-lg border-b border-white/10 p-4 flex justify-between">
          <span>Welcome, {session?.user?.name || session?.user?.email}</span>
          {/* ✅ Logout Button */}
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="text-red-400 hover:text-red-300"
            >
              Logout
            </button>
          </form>
        </div>

        {/* Page Content */}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
