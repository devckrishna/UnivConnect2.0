import { UserButton } from "@clerk/nextjs";

const Dashboard = () => {
  return (
    <div>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};

export default Dashboard;
