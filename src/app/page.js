// import LandingPage from "@/app/landing/landing";
import BLandingPage from "@/app/b-landing/page"
import { auth } from "auth";
import GreetingsPage from "@/app/components/Greeting";
export default async function Home() {
  const session = await auth();
  const name = session?.user?.name;
  if (session?.user) {
    return <GreetingsPage name={name} />;
  } else {
    return <BLandingPage />;
  }
}
