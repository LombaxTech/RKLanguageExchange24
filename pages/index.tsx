import { addDoc, collection } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";

import { app, auth, db, storage } from "@/firebase";
import { AuthContext } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import ProfileSetup from "@/components/ProfileSetup";
import TargetLanguagePosts from "@/components/TargetLanguagePosts";

export default function App() {
  const { user, userLoading } = useContext(AuthContext);

  const router = useRouter();

  useEffect(() => {
    console.log("starting logs...");
    console.log(user);

    // if (!userLoading && !user) router.push("signup");
  }, [user, userLoading]);

  const addStuff = async () => {
    const docRef = await addDoc(collection(db, "users"), {
      first: "Ada",
      last: "Lovelace",
      born: 1815,
    });
    console.log("Document written with ID: ", docRef.id);
  };

  const show = async () => {
    console.log(user);
  };

  if (!userLoading && user && user.hasNotSetUpProfile) return <ProfileSetup />;

  return (
    <div className="">
      {/* <button onClick={addStuff} className="btn btn-primary">
        Click me!
      </button> */}
      {user && (
        <>
          {/* <div className="p-10 flex flex-col gap-4">
            <span>email: {user.email}</span>
            <span>name: {user.name}</span>
            <span>native lang: {user.nativeLanguage}</span>
            <span>target lang: {user.targetLanguage}</span>
            <button onClick={show}>show</button>
          </div> */}
          <TargetLanguagePosts />
        </>
      )}
      {!user && <div>No user found</div>}
    </div>
  );
}
