import Image from "next/image";
import logo from "../../public/logo-dashboard.png";
import { Button } from "@/components/ui/button";
import { UserButton, auth, clerkClient } from "@clerk/nextjs";
import Link from "next/link";
import { db } from "@/utils/db";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
const PlatformLayout = async ({ children }: { children: React.ReactNode }) => {
  const isUserRegistered = async () => {
    const { userId } = auth();
    const user = clerkClient.users.getUser(userId ?? "");
    const email = (await user).emailAddresses[0].emailAddress;
    const dbUser = await db.user.findFirst({
      where: {
        email: email,
      },
    });
    if (dbUser === null) {
      redirect("/onboarding");
    }
  };
  await isUserRegistered();
  return (
    <div className="h-screen flex">
      <div className="h-full flex flex-col w-1/6  justify-between border-2">
        <div>
          <Image
            src={logo}
            alt="logo-dashboard"
            className="h-16 w-auto mx-10 mb-10"
          />
          <Link href="/dashboard">
            <Button variant="outline" className="w-64 flex justify-start">
              Home
            </Button>
          </Link>
          <Link href="/bookings">
            <Button variant="outline" className="w-64 flex justify-start">
              My Bookings
            </Button>
          </Link>
          <Link href="/explore">
            <Button variant="outline" className="w-64 flex justify-start">
              Explore
            </Button>
          </Link>
        </div>
        <div className="flex mx-5 my-5">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
      {children}
      <Toaster />
    </div>
  );
};

export default PlatformLayout;
