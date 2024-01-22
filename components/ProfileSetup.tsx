import { AuthContext } from "@/context/AuthContext";
import { db, storage } from "@/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useContext, useRef, useState } from "react";

export default function ProfileSetup() {
  const { user, setUser } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [nativeLanguage, setNativeLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [file, setFile] = useState<any>(null);
  const fileInputRef = useRef<any>(null);

  const finishProfileSetup = async () => {
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

    const firestoreUser = {
      name,
      nativeLanguage,
      targetLanguage,
      email: user.email,
      profilePictureUrl: imageUrl,
    };

    setFile(null);

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

      {/* <button
              className="btn btn-secondary"
              onClick={() => fileInputRef.current.click()}
            >
              Upload Profile Picture
            </button> */}
      <div className="flex flex-col my-4">
        <label>Upload profile picture</label>
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e: any) => setFile(e.target.files[0])}
          // style={{ display: "none" }}
        />
        {file && (
          <div className="relative">
            <img src={URL.createObjectURL(file)} width="100" />
            <div className="cursor-pointer" onClick={() => setFile(null)}>
              Delete
            </div>
          </div>
        )}
      </div>

      <button className="btn btn-primary" onClick={finishProfileSetup}>
        Finish Profile Set Up
      </button>
    </div>
  );
}
