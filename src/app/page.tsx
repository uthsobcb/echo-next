import LandingPage from "@/app/a-landing/page"
import { auth } from "@/app/lib/auth";
import GreetingsPage from "@/app/components/Greeting";



export default async function Home() {
  const session = await auth();
  const name = session?.user?.name;
  if (session?.user) {
    return <GreetingsPage name={name as string} />;
  } else {
    return <LandingPage />;
  }
}
