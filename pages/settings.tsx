import { AuthContext } from "@/context/AuthContext";
import { db, storage } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useContext, useEffect, useRef, useState } from "react";

import { languages } from "@/data";

export default function Settings() {
  const { user, userLoading, setUser } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [nativeLanguage, setNativeLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");

  const [changesExist, setChangesExist] = useState(false);

  const [file, setFile] = useState<any>(null);
  const fileInputRef = useRef<any>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setNativeLanguage(user.nativeLanguage);
      setTargetLanguage(user.targetLanguage);

      if (user.profilePictureUrl) setProfilePictureUrl(user.profilePictureUrl);
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
      await updateDoc(doc(db, "users", user.uid), {
        name,
        targetLanguage,
      });

      console.log("updated");
    } catch (error) {
      console.log(error);
    }
  };

  const updateProfilePicture = async () => {
    try {
      let imageUrl;

      // Upload image if image
      if (file) {
        const fileRef = `profilePictures/${user.uid}/${file.name}`;

        const storageRef = ref(storage, fileRef);
        await uploadBytes(storageRef, file).then((snapshot) => {
          console.log("Uploaded a blob or file!");
        });

        imageUrl = await getDownloadURL(ref(storage, fileRef));
      }

      if (imageUrl) {
        await updateDoc(doc(db, "users", user.uid), {
          profilePictureUrl: imageUrl,
        });

        console.log("updated profile picture");
        setFile(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (user)
    return (
      <div className="p-4 flex flex-col gap-4 items-center ">
        <h1 className="">Profile Settings</h1>

        {/* <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" /> */}
        {profilePictureUrl && (
          <div className="avatar">
            <div
              className="w-24 rounded-full cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              <img src={profilePictureUrl} />
            </div>
          </div>
        )}
        {!profilePictureUrl && (
          <div className="flex gap-2">
            <button
              className="btn btn-secondary"
              onClick={() => fileInputRef.current.click()}
            >
              Upload Profile Picture
            </button>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e: any) => setFile(e.target.files[0])}
          style={{ display: "none" }}
        />
        {file && (
          <div className="flex flex-col gap-4">
            <div className="relative">
              <img src={URL.createObjectURL(file)} width="100" />
              <div className="cursor-pointer" onClick={() => setFile(null)}>
                Delete
              </div>
            </div>
            <button className="btn btn-primary" onClick={updateProfilePicture}>
              Update profile picture
            </button>
          </div>
        )}

        <div className="flex items-center gap-4">
          <label className="">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border outline-none rounded-xl"
          />
        </div>
        <div className="flex flex-col">
          <label className="">Native Language</label>
          <select
            disabled
            className="select w-full max-w-xs"
            value={nativeLanguage}
            onChange={(e) => setNativeLanguage(e.target.value)}
          >
            <option disabled selected>
              Select Target Language
            </option>
            {languages.map((language) => (
              <option>{language}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="">Target Language</label>
          <select
            className="select w-full max-w-xs"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
          >
            <option disabled selected>
              Select Target Language
            </option>
            {languages.map((language) => (
              <option>{language}</option>
            ))}
          </select>
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
