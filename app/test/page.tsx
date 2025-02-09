import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  console.log("Frontend Me Load Hua", session);

  console.log("Frontend Me Load Hua ID: ", session.user.id);

  return <>Hello ji yee lo </>;
}
