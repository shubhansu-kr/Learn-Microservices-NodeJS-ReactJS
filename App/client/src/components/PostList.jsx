import { useState, useEffect } from "react";
import axios from "axios";
import PostItem from "./PostItem";
import CreatePost from "./CreatePost"; // ✅ Import CreatePost

const PostList = () => {
    const [posts, setPosts] = useState({});

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await axios.get("http://localhost:4000/posts");
            setPosts(res.data);
        };

        fetchPosts();
    }, []);

    // Function to add new post immediately
    const addNewPost = (newPost) => {
        setPosts((prevPosts) => ({
            ...prevPosts,
            [newPost.id]: newPost,
        }));
    };

    return (
        <div className="container mt-4">
            <h3>Posts</h3>
            <CreatePost onPostCreated={addNewPost} /> {/* ✅ Moved here */}
            <div className="row">
                {Object.values(posts).map((post) => (
                    <PostItem key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default PostList;
