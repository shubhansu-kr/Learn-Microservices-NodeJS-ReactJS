import { useState, useEffect } from "react";
import axios from "axios";
import PostItem from "./PostItem";
import CreatePost from "./CreatePost";

const PostList = () => {
    const [posts, setPosts] = useState({});

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await axios.get("http://posts.com/posts");
            setPosts(res.data);
        };

        fetchPosts();
    }, []);

    const addNewPost = (newPost) => {
        setPosts((prevPosts) => ({
            ...prevPosts,
            [newPost.id]: { ...newPost, comments: [] },
        }));
    };

    const handleNewComment = (postId, comment) => {
        setPosts((prevPosts) => {
            const updatedPost = { ...prevPosts[postId] };
            updatedPost.comments = [...updatedPost.comments, comment];

            return {
                ...prevPosts,
                [postId]: updatedPost,
            };
        });
    };

    return (
        <div className="container mt-4">
            <h3>Posts</h3>
            <CreatePost onPostCreated={addNewPost} />
            <div className="row">
                {Object.values(posts).map((post) => (
                    <PostItem
                        key={post.id}
                        post={post}
                        onCommentCreated={handleNewComment}
                    />
                ))}
            </div>
        </div>
    );
};

export default PostList;
