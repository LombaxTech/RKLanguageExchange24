import { AuthContext } from "@/context/AuthContext";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";
import React, { useContext } from "react";

export default function Navbar() {
  const { user, userLoading } = useContext(AuthContext);

  const signout = async () => {
    try {
      await signOut(auth);
      console.log("signed out");
    } catch (error) {
      console.log("error signing out...");
      console.log(error);
    }
  };

  return (
    <div className="p-4 flex items-center justify-between">
      <h1 className="">
        <Link href={"/"}>Logo</Link>
      </h1>
      <ul className="flex gap-4">
        {!user && (
          <>
            <li className="cursor-pointer">
              <Link href={"/signin"}>Sign In</Link>
            </li>
            <li className="cursor-pointer">
              <Link href={"/signup"}>Create Account</Link>
            </li>
          </>
        )}
        {user && (
          <li className="cursor-pointer" onClick={signout}>
            Sign Out
          </li>
        )}
      </ul>
    </div>
  );
}
