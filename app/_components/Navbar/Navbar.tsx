"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useSignout from "@/hooks/firebase/auth/useSignout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserContext } from "../context/UserContext";

const Navbar = () => {
  const { user } = useUserContext();
  console.log(user);
  const { mutateAsync: signout } = useSignout();
  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
    : user?.email
    ? user.email.split("@")[0].slice(0, 2).toUpperCase()
    : "";

  return (
    <nav className="bg-red-400 p-3 flex justify-between items-center">
      <div className="font-extrabold text-5xl xs:max-sm:text-4xl text-blue-950">
        The Blueprint
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="mr-12 xs:max-sm:mr-6">
            <AvatarImage src={user?.photoURL || ""} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signout()}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default Navbar;
