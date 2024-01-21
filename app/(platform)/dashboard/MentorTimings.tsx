"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { bookingmap } from "@/utils/bookingmap";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

const MentorTimings = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [perHourCost, setPerHourCost] = useState(0);
  const [bookings, setBookings] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<Number[]>([]);

  const onSubmit = async () => {
    const slots = [];

    const currUser = await axios.post("/api/user/mentor/getbyemail", {
      email: user?.emailAddresses[0].emailAddress,
    });

    const user_id = currUser.data["id"];
    let timingsString = "";
    for (let i = 0; i < selectedTime.length; i++) {
      slots.push(bookingmap[(selectedTime[i] as number) + 1]);
    }

    for (let i = 0; i < slots.length; i++) {
      timingsString = timingsString + slots[i] + ",";
    }

    // console.log(timingsString);

    // console.log(perHourCost);

    await axios.post("/api/user/mentor/createslot", {
      cost: perHourCost,
      timings: timingsString,
      user_id: user_id,
    });
    // console.log(slot);
    setSelectedTime([]);
    setPerHourCost(0);
    toast({
      title: "Success",
      description: "Your Availability Updated Successfully",
    });
  };

  useEffect(() => {
    let curr = [];
    for (let key in bookingmap) {
      curr.push(bookingmap[key]);
    }
    setBookings(curr);
  }, []);

  return (
    <div className="h-screen w-10/12 flex flex-col p-10">
      <div className="text-3xl font-bold tracking-wider my-5">
        Current Bookings Details
      </div>

      <div className="mb-2 bottom-1">
        <hr />
      </div>

      <div className="flex w-2/5 items-center">
        <div className="font-bold tracking-wide w-full">
          Select Per Hour Cost:
        </div>
        Rs.
        <Input
          type="number"
          placeholder="0"
          min={0}
          onChange={(e) => setPerHourCost(Number(e.target.value))}
        />
      </div>
      <div className="flex gap-10 mt-8">
        <div className="font-bold tracking-wide">Select Time Slots: </div>
        <div className="w-2/4 grid grid-cols-5 gap-1">
          {bookings.map((val, index) => {
            // return timeSlotContainer(val, index === selectedTime);
            if (selectedTime.indexOf(index) >= 0) {
              return (
                <Button
                  variant="outline"
                  className="text-green-600 border-green-600"
                  onClick={() =>
                    setSelectedTime((prev) =>
                      prev.filter((item) => item !== index)
                    )
                  }
                >
                  {val}
                </Button>
              );
            } else {
              return (
                <Button
                  variant="outline"
                  className="hover:text-green-600 hover:border-green-600"
                  onClick={() => setSelectedTime((prev) => [...prev, index])}
                >
                  {val}
                </Button>
              );
            }
          })}
        </div>
      </div>

      <Button
        onClick={() => onSubmit()}
        className="my-7 w-36 bg-purple-700 hover:bg-purple-900"
        disabled={perHourCost === 0 || selectedTime.length === 0}
      >
        Save
      </Button>
    </div>
  );
};

export default MentorTimings;
