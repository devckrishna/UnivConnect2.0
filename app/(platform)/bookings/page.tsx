"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type BookingObj = {
  id: string;
  date: string;
  user_id: string;
  mentor_id: string;
  start_time: string;
};

const Bookings = () => {
  const { user } = useUser();
  const [bookings, setBookings] = useState<BookingObj[]>([]);
  const router = useRouter();
  const [isMentor, setIsMentor] = useState(false);

  const checkMentor = async () => {
    const currUser = await axios.post("/api/user/mentor/getbyemail", {
      email: user?.emailAddresses[0].emailAddress,
    });
    setIsMentor(currUser.data["isMentor"]);
  };

  const getBookings = async (email: string) => {
    const currUser = await axios.post("/api/user/mentor/getbyemail", {
      email,
    });
    const user_id = currUser.data["id"];
    let currBookings;
    if (isMentor === true) {
      currBookings = await axios.post("/api/booking/getmentorbookings", {
        mentor_id: user_id,
      });
    } else {
      currBookings = await axios.post("/api/booking/getuserbookings", {
        user_id,
      });
    }

    console.log(currBookings);
    // console.log(currBookings.data[2]["date"]);
    setBookings([]);
    setBookings([...currBookings.data]);
  };

  useEffect(() => {
    const email = user?.emailAddresses[0].emailAddress;
    checkMentor();
    if (email !== undefined) {
      getBookings(email);
    }
  }, [user, bookings]);

  return (
    <div className="h-screen w-10/12 overflow-y-auto flex flex-col p-10">
      <div className="text-2xl font-bold tracking-wider">Upcoming Bookings</div>
      <div className="border-1 my-6">
        <hr />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookings.map((currBooking) => {
          return (
            <div
              key={currBooking["id"]}
              className="flex flex-col border-2 gap-2 p-5"
            >
              <div className="flex gap-2">
                <div className="font-bold tracking-wide">Date:</div>
                <div className="text-green-700 font-bold">
                  {currBooking["date"].slice(0, 10)}
                </div>
              </div>

              <div className="flex gap-2">
                <div className="font-bold tracking-wide">Time:</div>
                <div className="text-green-700 font-bold">
                  {currBooking["start_time"]}
                </div>
              </div>

              <Button
                key={currBooking["id"]}
                onClick={() =>
                  router.push(
                    "/videocall/" +
                      currBooking["user_id"] +
                      "@" +
                      currBooking["mentor_id"] +
                      `?ismentor=${isMentor ? "true" : "false"}`
                  )
                }
                className="bg-purple-700 hover:bg-purple-900 mt-3"
              >
                Join
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Bookings;
