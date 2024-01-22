"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import defaultProfile from "../../../../public/default-profile.jpg";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { bookingmap } from "@/utils/bookingmap";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
import Link from "next/link";
import getStipePromise from "@/lib/stripe";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";

const star = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-4 h-4 mx-1 text-yellow-400"
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
      clipRule="evenodd"
    />
  </svg>
);

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

const MentorProfilePage = ({ params }: { params: { id: string } }) => {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user } = useUser();
  const router = useRouter();
  const [date, setDate] = useState<Date>();
  const [bookings, setBookings] = useState<string[]>([]);
  const [price, setPrice] = useState(0);
  4;
  const [selectedTime, setSelectedTime] = useState(-1);
  const [mentorDetails, setMentorDetails] = useState<MentorObj>({
    id: "",
    country: "",
    description: "",
    email: "",
    gender: "",
    image: "",
    isMentor: true,
    name: "",
    university: "",
    rating: 0,
  });
  const [isAvailable, setIsAvailable] = useState(true);

  const getMentorDetails = async () => {
    const data = await axios.get("/api/user/" + params.id);
    setMentorDetails(data.data.data.user);
    const currEmail = data.data.data.user["email"];

    const slotDetails = await axios.post("/api/user/mentor/getslot", {
      email: currEmail,
    });
    // console.log(slotDetails.data);
    if (slotDetails.data === null) {
      setIsAvailable(false);
      return;
    }
    const timingsArray = slotDetails.data["timings"].split(",");

    setPrice(Number(slotDetails.data["cost"]));
    setBookings([]);
    setBookings((prev) => [...prev, ...timingsArray.sort().slice(1)]);
  };

  const handleCheckout = async () => {
    console.log(date?.toDateString());
    console.log(bookings[selectedTime]);
    const stripe = await getStipePromise();
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-cache",
      body: JSON.stringify([
        {
          name: "booking",
          price: price,
          mentor_id: mentorDetails.id,
          date: date,
          start_time: bookings[selectedTime],
        },
      ]),
    });

    const data = await response.json();
    console.log(data);
    if (data.session) {
      stripe?.redirectToCheckout({ sessionId: data.session.id });
    }
  };

  const handleSuccessfull = async (
    email: string,
    date: string,
    start_time: string
  ) => {
    const currUser = await axios.post("/api/user/mentor/getbyemail", {
      email: email,
    });
    const user_id = currUser.data["id"];
    // console.log(date);
    // console.log(start_time);
    // console.log(user_id);
    // console.log(mentorDetails.id);
    const booking = await axios.post("/api/booking", {
      user_id,
      date,
      start_time,
      mentor_id: mentorDetails.id,
    });
    console.log(booking);
    toast({
      title: "Success",
      description: "Booking SuccessFully Created",
    });
    router.push("/bookings");
  };

  useEffect(() => {
    const email = user?.emailAddresses[0].emailAddress;
    const isSuccessfull = searchParams.get("success");
    const tempDate = searchParams.get("date");
    const start_time = searchParams.get("start_time");

    if (isSuccessfull === "false") {
      toast({
        title: "Fail",
        variant: "destructive",
        description: "Booking Failed, Try Again",
      });
    } else if (isSuccessfull !== null && email !== undefined) {
      handleSuccessfull(email, tempDate + "", start_time ?? "");
    }
    getMentorDetails();
  }, [user]);

  if (isAvailable === false) {
    return (
      <div className="grid grid-cols-2 gap-28 w-10/12 overflow-y-auto pr-36">
        <div className="flex flex-col  p-10">
          <Button onClick={() => router.back()} variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <Image
              src={defaultProfile}
              alt="default-profile"
              className="rounded-full h-52 w-auto mt-10"
            />
          </div>
          <div className="my-10">
            <div className="text-3xl font-bold tracking-widest">
              {mentorDetails.name}
            </div>

            <div className="text-2xl font-semibold tracking-wider text-gray-600">
              {mentorDetails.university}
            </div>

            <div className="tracking-wider">{mentorDetails.country}</div>
            <div className="w-72 text-sm font-light tracking-wide my-2">
              {mentorDetails.description}
            </div>
            <div className="flex items-center font-semibold">
              Rating: {mentorDetails.rating + ""} / 5 {star}
            </div>
          </div>
        </div>

        <div className="h-full flex flex-col justify-between p-10">
          <div>
            <div className="mt-20 text-3xl tracking-wider font-bold">
              Booking Details
            </div>
            <div className="border-1 mt-4 mb-2">
              {" "}
              <hr />
            </div>
            <div className="text-red-500 font-semibold tracking-widers">
              No Slots Available
            </div>
          </div>
          {/* <Link href="/payment"> */}

          {/* </Link> */}
        </div>
      </div>
    );
  } else
    return (
      <div className="grid grid-cols-2 gap-28 w-10/12 overflow-y-auto pr-36">
        <div className="flex flex-col  p-10">
          <Button onClick={() => router.back()} variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <Image
              src={defaultProfile}
              alt="default-profile"
              className="rounded-full h-52 w-auto mt-10"
            />
          </div>
          <div className="my-10">
            <div className="text-3xl font-bold tracking-widest">
              {mentorDetails.name}
            </div>

            <div className="text-2xl font-semibold tracking-wider text-gray-600">
              {mentorDetails.university}
            </div>

            <div className="tracking-wider">{mentorDetails.country}</div>
            <div className="w-72 text-sm font-light tracking-wide my-2">
              {mentorDetails.description}
            </div>
            <div className="flex items-center font-semibold">
              Rating: {mentorDetails.rating + ""} / 5 {star}
            </div>
          </div>
        </div>

        <div className="h-full flex flex-col justify-between p-10">
          <div>
            <div className="mt-20 text-3xl tracking-wider font-bold">
              Booking Details
            </div>
            <div className="border-1 mt-4 mb-8">
              {" "}
              <hr />
            </div>
            <div className="flex gap-6 my-2">
              <div className="font-bold">Hourly Rate: </div>
              <div className="text-green-600 font-bold">Rs. {price} / Hr</div>
            </div>

            <div className="flex gap-5 items-center my-3">
              <div className="font-bold">Select Date: </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex gap-5 my-6">
              <div className="font-bold">Select Time:</div>
              <div className="grid grid-cols-5 gap-1">
                {bookings.map((val, index) => {
                  // return timeSlotContainer(val, index === selectedTime);
                  if (index === selectedTime) {
                    return (
                      <Button
                        variant="outline"
                        className="text-green-600 border-green-600"
                        onClick={() => setSelectedTime(-1)}
                      >
                        {val}
                      </Button>
                    );
                  } else {
                    return (
                      <Button
                        variant="outline"
                        className="hover:text-green-600 hover:border-green-600"
                        onClick={() => setSelectedTime(index)}
                      >
                        {val}
                      </Button>
                    );
                  }
                })}
              </div>
            </div>
          </div>
          {/* <Link href="/payment"> */}
          <Button
            onClick={() => handleCheckout()}
            disabled={date === undefined || selectedTime === -1}
            className="bg-purple-600 hover:bg-purple-8 mb-10"
          >
            Proceed To Payment
          </Button>
          {/* </Link> */}
        </div>
      </div>
    );
};

export default MentorProfilePage;
