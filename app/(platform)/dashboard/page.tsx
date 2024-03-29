"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ProfileCard from "./ProfileCard";
import { useUser } from "@clerk/nextjs";
import MentorTimings from "./MentorTimings";
import loadingImage from "../../../public/loading.gif";
import Image from "next/image";

type MentorObj = {
  id: string;
  country: string;
  description: string;
  email: string;
  gender: string;
  image: string;
  isMentor: boolean;
  name: string;
  university: string;
  rating: Number;
};

const Dashboard = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [mentors, setMentors] = useState<MentorObj[]>([]);
  const [isMentor, setIsMentor] = useState(false);

  const checkMentor = async () => {
    const currUser = await axios.post("/api/user/mentor/getbyemail", {
      email: user?.emailAddresses[0].emailAddress,
    });
    setIsMentor(currUser.data["isMentor"]);
    setIsLoading(false);
  };

  const getMentors = async () => {
    const users = await axios.get("/api/user/mentor");
    // console.log(users.data[0]);
    setMentors(users.data);
  };

  useEffect(() => {
    // setIsLoading(true);
    getMentors();
    checkMentor();
  }, [user]);

  if (isLoading === true) {
    return (
      <div className="h-screen w-screen flex items-center justify-center ">
        <Image className="h-10 w-auto" src={loadingImage} alt="loading" />
      </div>
    );
  } else if (isMentor === true) {
    return <MentorTimings />;
  } else
    return (
      <div className="flex flex-col h-screen w-10/12 overflow-y-auto p-10">
        <div className="text-3xl font-bold my-5">Available Mentors</div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          {mentors.map((mentor) => (
            <ProfileCard key={mentor.id} {...mentor} />
          ))}
        </div>
      </div>
    );
};

export default Dashboard;
