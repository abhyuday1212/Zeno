import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth.config";
import Navbar from "@/components/navbar";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  console.log("Session Data: ", session.user.name);

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
