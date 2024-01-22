import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";

export default function TargetLanguagePosts() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const postQuery = query(
          collection(db, "posts"),
          orderBy("createdAt", "desc")
        );
        onSnapshot(postQuery, (postsSnapshot) => {
          let posts: any = [];

          postsSnapshot.forEach((postDoc) => {
            posts.push({ id: postDoc.id, ...postDoc.data() });
          });

          setPosts(posts);
        });
      } catch (error) {
        console.log(error);
      }
    };

    if (user) getPosts();
  }, [user]);

  return (
    <div className="p-4 flex flex-col">
      {/* <button onClick={() => console.log(posts[0].createdAt.toDate())}>
        Show posts
      </button> */}
      {/* {posts && posts.map((post) => <Post post={post} />)} */}

      <div className="max-w-md mx-auto">
        <h1 className="text-xl font-semibold text-gray-900 border-b pb-2 mb-4">
          Target Language Posts
        </h1>
        {posts && posts.map((post) => <Post post={post} />)}
      </div>
    </div>
  );
}

const Post = ({ post }: { post: any }) => {
  return (
    <div className="p-4 flex items-center gap-4 border">
      <div>
        <Link href={`profile/${post.user.uid}`}>{post.user.name}</Link>
      </div>

      <p>{post.postText}</p>
      {post.imageUrl && (
        <img src={post.imageUrl} className="w-[100px] shadow-md" />
      )}
    </div>
  );
};
