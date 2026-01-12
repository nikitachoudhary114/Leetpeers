import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import RoomForm from "./room-form";


export default async function RoomsPage() {
  const session = await getServerSession(authOptions as any);

  if (!session) {
    redirect("/api/auth/signin"); // if not logged in, go to signin
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Create a Room</h1>
        <RoomForm />
      </div>
    </div>
  );
}