import LandingPage from "@/app/a-landing/page"
import { auth } from "@/app/lib/auth";
import GreetingsPage from "@/app/components/Greeting";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const session = await auth();
  const name = session?.user?.name;
  if (session?.user) {
    return <GreetingsPage name={name} />;
  } else {
    return <LandingPage />;
  }
}
