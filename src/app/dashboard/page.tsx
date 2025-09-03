import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";


export default async function Dashboard() {
  // Get session on the server
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">You are not logged in.</h2>
        <p>
          Please{" "}
          <a href="/auth/signin" className="text-blue-500">
            sign in
          </a>
          .
        </p>
      </div>
    );
  }

  // Fetch user directly from database
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return <p className="p-8 text-red-500">User not found</p>;
  }

  return (
    <div className="p-8 max-w-lg mx-auto bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-4 text-black">Dashboard</h1>
      <div className="flex flex-col gap-2 text-black">
        <p>
          <strong>ID:</strong> {user.id}
        </p>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Created At:</strong> {user.createdAt.toISOString()}
        </p>
        <p>
          <strong>Updated At:</strong> {user.updatedAt.toISOString()}
        </p>
      </div>
      <a
        href="/auth/signin"
        className="mt-6 inline-block bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </a>
    </div>
  );
}
