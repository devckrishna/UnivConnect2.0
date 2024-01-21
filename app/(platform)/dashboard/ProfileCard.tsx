import Image from "next/image";
import defaultProfile from "../../../public/default-profile.jpg";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
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
}

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

const ProfileCard = (props: Props) => {
  return (
    <div className="flex h-full w-full my-5 border-2 items-center rounded-md shadow-md">
      <Image
        src={defaultProfile}
        alt="default-profile"
        className="rounded-full h-48 w-auto m-5"
      />
      <div className="flex flex-col justify-between">
        <div className="text-xl font-bold my-2">{props.name}</div>
        <div className="text-md font-semibold">{props.university}</div>
        <div className="text-md font-semibold"> {props.country}</div>
        <div className="flex font-semibold w-36 items-center  my-4">
          Rating : {props.rating + ""} / 5{star}
        </div>
        <Link href={"/mentor/" + props.id}>
          <Button className="bg-purple-700 hover:bg-purple-900">Connect</Button>
        </Link>
      </div>
    </div>
  );
};

export default ProfileCard;
