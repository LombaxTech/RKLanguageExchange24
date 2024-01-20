import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import React, { useContext, useState } from "react";

export default function ProfileSetup() {
  const { user, setUser } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [nativeLanguage, setNativeLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");

  const finishProfileSetup = async () => {
    const firestoreUser = {
      name,
      nativeLanguage,
      targetLanguage,
      email: user.email,
    };

    await setDoc(doc(db, "users", user.uid), firestoreUser);
    setUser({ ...user, ...firestoreUser, hasNotSetUpProfile: false });
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="">Set up your profile</h1>
      <input
        type="text"
        className="border outline-none p-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="name"
      />
      <input
        type="text"
        className="border outline-none p-2"
        value={nativeLanguage}
        onChange={(e) => setNativeLanguage(e.target.value)}
        placeholder="native language"
      />
      <input
        type="text"
        className="border outline-none p-2"
        value={targetLanguage}
        onChange={(e) => setTargetLanguage(e.target.value)}
        placeholder="target language"
      />
      <button className="btn btn-primary" onClick={finishProfileSetup}>
        Finish Profile Set Up
      </button>
    </div>
  );
}
