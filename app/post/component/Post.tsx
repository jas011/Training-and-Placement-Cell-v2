import { Badge } from "@/components/ui/badge";
import { Calendar, Share2 } from "lucide-react";

import React from "react";
import { SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WrapButtonProps {
  className?: string;
  children: React.ReactNode;
  href?: string;
}

export default function Post() {
  const BadgeButton = () => {
    return (
      <Badge
        variant="outline"
        className="cursor-pointer rounded-[14px] border border-black/10 bg-white text-base md:left-6"
      >
        <SparklesIcon
          style={{
            height: "calc(var(--spacing) * 6)",
            width: "calc(var(--spacing) * 6)",
          }}
          className=" mr-2 fill-[#EEBDE0] stroke-1 text-neutral-800"
        />
        <span className="whitespace-break-spaces break-words flex-wrap w-min md:w-auto">
          Placement Annoucement
        </span>
      </Badge>
    );
  };

  return (
    <div className=" bg-white space-x-3 p-4  ">
      <div className="flex flex-col items-left gap-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-2 items-center">
            <BadgeButton />
            <span className="text-sm hidden md:flex">
              <Calendar height={18} />
              December 15, 2024
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild={true}>
              <Button
                variant={"outline"}
                className="w-fit h-fit py-1 px-3 rounded-xl focus-visible:ring-0"
              >
                <Share2 />
                Share
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <span className="text-sm flex md:hidden -mb-3 mt-2">
          <Calendar height={18} />
          December 15, 2024
        </span>
        <div>
          <h2 className=" text-3xl font-semibold ">
            REGISTRATIONS FOR SCHNEIDER ELECTRIC INDIA PVT. LTD.
          </h2>
          <div className="flex gap-2 mt-4 mb-1">
            <Badge variant={"secondary"} className="border border-primary">
              ECE
            </Badge>
            <Badge variant={"secondary"} className="border border-primary">
              ECE
            </Badge>
          </div>
          <p className="text-muted-foreground text-md">
            Infosys is a global leader in next-generation digital services and
            consulting. Their purpose is to amplify human potential and create
            the next opportunity for people, businesses, and communities. They
            enable more than 1,884 clients in more than 50 countries to navigate
            their digital transformation. They do it by enabling the enterprise
            with an AI-powered core, empowering the business with agile digital
            at scale, and their always-on learning agenda. Our team, of
            3,28,000+ employees, makes this happen.
          </p>
        </div>
      </div>
    </div>
  );
}
