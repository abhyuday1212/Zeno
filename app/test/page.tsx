import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log("Frontend Me Load Hua", session);

  console.log("Frontend Me Load Hua ID: ", session.user.id);

  return <>Hello ji yee lo </>;
}
