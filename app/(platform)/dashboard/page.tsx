import { db } from "@/utils/db";
import { UserButton } from "@clerk/nextjs";
import { clerkClient, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
const Dashboard = async () => {
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
    <div>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};

export default Dashboard;
