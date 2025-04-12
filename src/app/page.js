import LandingPage from "@/app/landing/landing";
import User from "@/app/profile/page";
import { auth } from "auth";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    return <User />;
  } else {
    return <LandingPage />;
  }
}
