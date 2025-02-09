import { auth } from "@/auth";
import Navbar from "@/components/navbar";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  console.log("Session Data: ", session.user.name);

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
