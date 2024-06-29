import Borrows from "@/components/Borrows";
import ProfileStats from "@/components/ProfileStats";
import Supplies from "@/components/Supplies";
import { NextPage } from "next";

const Dashboard: NextPage = () => {
  return (
    <div className="flex flex-col">
      <ProfileStats />
      <div className="grid grid-cols-2 gap-4 w-4/5 m-auto mt-4">
        <Supplies />
        <Borrows />
      </div>
    </div>
  );
};

export default Dashboard;
