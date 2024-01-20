import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";

export default function Settings() {
  const { user, userLoading, setUser } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [nativeLanguage, setNativeLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");

  const [changesExist, setChangesExist] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setNativeLanguage(user.nativeLanguage);
      setTargetLanguage(user.targetLanguage);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    if (name !== user.name || targetLanguage !== user.targetLanguage) {
      setChangesExist(true);
    } else {
      setChangesExist(false);
    }
  }, [user, name, nativeLanguage, targetLanguage]);

  const saveChanges = async () => {
    if (!changesExist) return;

    try {
      let updatedUser = await updateDoc(doc(db, "users", user.uid), {
        name,
        targetLanguage,
      });

      console.log("updated");
      console.log(updatedUser);

      // setUser(updatedUser);
    } catch (error) {
      console.log(error);
    }
  };

  if (user)
    return (
      <div className="p-4 flex flex-col gap-4 items-center ">
        <h1 className="">Profile Settings</h1>

        {/* <div className="flex items-center gap-4">
          <label className="">Profile Picture</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border outline-none rounded-xl"
          />
        </div> */}

        <div className="flex items-center gap-4">
          <label className="">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border outline-none rounded-xl"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="">Target Language</label>
          <input
            type="text"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="p-2 border outline-none rounded-xl"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="">Native Language</label>
          <input
            type="text"
            value={nativeLanguage}
            onChange={(e) => setNativeLanguage(e.target.value)}
            className="p-2 border outline-none rounded-xl"
          />
        </div>

        <button
          className="btn btn-primary"
          disabled={!changesExist}
          onClick={saveChanges}
        >
          Save changes
        </button>
      </div>
    );
}
