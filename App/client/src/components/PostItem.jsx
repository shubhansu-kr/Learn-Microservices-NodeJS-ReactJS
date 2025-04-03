import { useState, useEffect } from "react";
import axios from "axios";
import CommentList from "./CommentList";
import CreateComment from "./CreateComment";

const PostItem = ({ post }) => {
    const [comments, setComments] = useState([]);

    // Fetch comments when component loads
    useEffect(() => {
        const fetchComments = async () => {
            const res = await axios.get(`http://localhost:4001/posts/${post.id}/comments`);
            setComments(res.data);
        };

        fetchComments();
    }, [post.id]); // Runs only when `post.id` changes

    // Add new comment to state
    const handleNewComment = async (newComment) => {
        setComments(newComment); // Directly set the updated list from backend response
    };


    return (
        <div className="card mt-3">
            <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <CommentList comments={comments} />
                <CreateComment postId={post.id} onCommentCreated={handleNewComment} />
            </div>
        </div>
    );
};

export default PostItem;
