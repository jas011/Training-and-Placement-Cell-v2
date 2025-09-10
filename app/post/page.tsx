import React from "react";
import Post from "./component/Post";
import { MoveLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className=" bg-white space-x-3 p-4 m-auto my-14 w-[80%] ">
      <Link href={"/card"}>
        <div className="mx-6 w-fit p-2 border border-primary rounded-[999px]">
          <MoveLeft />
        </div>
      </Link>
      <Post />
    </div>
  );
}
