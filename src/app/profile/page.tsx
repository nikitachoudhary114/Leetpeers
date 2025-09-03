// app/profile/page.tsx
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";
import { authOptions } from "@/lib/auth";



export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    redirect("/api/auth/signin");
  }
  console.log(session)




 const user = await prisma.user.findUnique({
   where: { id: session.user.id},
   select: {
     id: true,
     name: true,
     email: true,
     username: true,
     leetcodeProfile: true,
     bio: true,
     avatarUrl: true,
     githubProfile: true,
     linkedinProfile: true,
     country: true,
     streakCount: true,
     problemsSolved: true,
     createdAt: true,
     rooms: {
       select: {
         id: true,
         name: true,
         code: true,
         createdAt: true,
         ownerId: true,
       },
     },
     ownedRooms: {
       select: {
         id: true,
         name: true,
         code: true,
         createdAt: true,
       },
     },
   },
 });

  if (!user) {
    return <div className="p-6 text-red-500">User not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      {/* Pass both user and session for safe updates */}
      <ProfileForm user={user}  />
    </div>
  );
}
