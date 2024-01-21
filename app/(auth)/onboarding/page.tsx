"use client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { UserButton, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const OnBoarding = () => {
  const { user } = useUser();
  const router = useRouter();

  const [isMentor, setIsMentor] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [description, setDescription] = useState("");
  const [university, setUniversity] = useState("");
  const [country, setCountry] = useState("Select");
  const [gender, setGender] = useState("Select");
  const { toast } = useToast();

  const startOnboarding = async () => {
    // const user = clerkClient.users;
    // const email = (await user).emailAddresses[0].emailAddress;
    const email = user?.emailAddresses[0].emailAddress;
    const name = firstName + " " + lastName;
    if (
      name.length == 0 ||
      description === "" ||
      country === "Select" ||
      gender === "Select" ||
      (isMentor && university === "")
    ) {
      toast({
        title: "Incomplete Details",
        description: "Please fill all the details to continue",
        variant: "destructive",
      });
    } else {
      if (isMentor) {
        const json = await axios.post("/api/user/mentor", {
          name: firstName + " " + lastName,
          email: email,
          description: description,
          university: university,
          country: country,
          image: "default.png",
          gender: gender,
          isMentor: true,
        });
        console.log(json.data);
      } else {
        const json = await axios.post("/api/user/student", {
          name: firstName + " " + lastName,
          email: email,
          description: description,
          country: country,
          image: "default.png",
          gender: gender,
          isMentor: true,
        });
      }
      router.push("/dashboard");
    }
  };

  return (
    <div className="mb-20 w-full px-72">
      <div className="my-2">
        <UserButton afterSignOutUrl="/" />
      </div>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Personal Details
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Please enter your personal details
          </p>
          <div className="flex my-10">
            <p className="mr-10 font-bold">Want to join as Mentor? </p>
            <Switch onClick={() => setIsMentor(!isMentor)} />
          </div>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                First name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  onChange={(e) => setFirstName(e.target.value)}
                  name="first-name"
                  id="first-name"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="last-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Last name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  onChange={(e) => setLastName(e.target.value)}
                  name="last-name"
                  id="last-name"
                  autoComplete="family-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="about"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Description
              </label>
              <div className="mt-2">
                <textarea
                  id="about"
                  name="about"
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={""}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Write a few sentences about yourself.
              </p>
            </div>

            {isMentor ? (
              <div className="sm:col-span-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  University
                </label>
                <div className="mt-2">
                  <input
                    id="texts"
                    name="text"
                    type="text"
                    onChange={(e) => setUniversity(e.target.value)}
                    autoComplete="texts"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            ) : null}

            <div className="sm:col-span-3">
              <label
                htmlFor="country"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Country
              </label>
              <div className="mt-2">
                <select
                  id="country"
                  name="country"
                  onChange={(e) => setCountry(e.target.value)}
                  autoComplete="country-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  <option>Select</option>
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Mexico</option>
                  <option>Australia</option>
                  <option>London</option>
                  <option>Sweden</option>
                  <option>Germany</option>
                  <option>France</option>
                  <option>Amsterdam</option>
                  <option>Singapore</option>
                  <option>India</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <label
                htmlFor="country"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Gender
              </label>
              <div className="mt-2">
                <select
                  id="country"
                  name="country"
                  onChange={(e) => setGender(e.target.value)}
                  autoComplete="country-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  <option>Select</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
        <Button onClick={startOnboarding}> Submit</Button>
      </div>
    </div>
  );
};

export default OnBoarding;
