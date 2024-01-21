import { AuthContext } from "@/context/AuthContext";
import { auth, db, storage } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import Link from "next/link";
import React, { Fragment, useContext, useRef, useState } from "react";
import GoogleButton from "./GoogleButton";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { FaFileImage } from "react-icons/fa";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function PostModal() {
  const { user } = useContext(AuthContext);

  let [isOpen, setIsOpen] = useState(true);

  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [postText, setPostText] = useState("");

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const publishPost = async () => {
    try {
      let imageUrl;

      // Upload image if image
      if (file) {
        const fileRef = `posts/${user.uid}/${file.name}`;

        const storageRef = ref(storage, fileRef);
        await uploadBytes(storageRef, file).then((snapshot) => {
          console.log("Uploaded a blob or file!");
        });

        imageUrl = await getDownloadURL(ref(storage, fileRef));
      }

      const newPost = {
        postText,
        user: {
          uid: user.uid,
          name: user.name,
          nativeLanguage: user.nativeLanguage,
          targetLanguage: user.targetLanguage,
        },
        createdAt: new Date(),
        ...(imageUrl && { imageUrl }),
      };

      await addDoc(collection(db, "posts"), newPost);
      console.log("posted");

      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      // Perform additional actions with the file if needed
    }
  };

  return (
    <>
      <span className="cursor-pointer" onClick={openModal}>
        Post
      </span>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Create A Post
                  </Dialog.Title>
                  <div className="mt-2 flex flex-col gap-2">
                    <textarea
                      value={postText}
                      onChange={(e) => setPostText(e.target.value)}
                      className="textarea w-full outline-none border"
                    ></textarea>

                    {/* Image preview */}
                    <div className="">
                      {file && (
                        <div className="relative">
                          <img src={URL.createObjectURL(file)} width="100" />
                          <div
                            className="cursor-pointer"
                            onClick={() => setFile(null)}
                          >
                            Delete
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={publishPost}
                    >
                      Post
                    </button>
                    <div className="cursor-pointer" onClick={handleIconClick}>
                      <FaFileImage size={25} />
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                      />
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
