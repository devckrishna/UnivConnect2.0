import Image from "next/image";
import localFont from "@next/font/local";
import logo from "../public/logo-dashboard.png";
import LandingVector from "../public/LandingBack.jpg";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const lemon = localFont({
  src: [
    {
      path: "../public/fonts/Lemon-Regular.ttf",
      weight: "400",
    },
  ],
});
export default function Home() {
  const checkAuth = () => {
    const { userId }: { userId: string | null } = auth();
    if (userId !== null) {
      redirect("/dashboard");
    }
  };
  checkAuth();

  return (
    <div className="h-full">
      <div className="h-20  flex items-center justify-between shadow-md">
        <Image src={logo} alt={"logo"} className="h-16 w-auto mx-10" />

        <Link href="/sign-in">
          <Button
            variant="default"
            className="bg-purple-800 hover:bg-purple-600 mx-10"
          >
            Login
          </Button>
        </Link>
      </div>
      <div className="flex">
        <Image
          src={LandingVector}
          alt="landingvector"
          height="500"
          className="mx-5 my-20"
        />
        <div className=" flex flex-col justify-center items-center">
          <div className="my-8">
            <div
              className={cn(
                "text-4xl font-bold tracking-wide text-center py-2",
                lemon.className
              )}
            >
              Best platform to connect with alumni of Universities all over the
              world
            </div>
            <div className={"text-xl font-light tracking-wide text-center"}>
              Start you journey with UnivConnect
            </div>
          </div>
          <Link href="/sign-up">
            <Button className="w-40 bg-purple-800 hover:bg-purple-600 font-bold">
              Join Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
