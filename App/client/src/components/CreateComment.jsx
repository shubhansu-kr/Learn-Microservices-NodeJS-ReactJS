import { useState } from "react";
import axios from "axios";

const CreateComment = ({ postId, onCommentCreated }) => {
    const [content, setContent] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await axios.post(`http://posts.com/posts/${postId}/comments`, {
            content,
        });

        if (onCommentCreated) {
            const comments = res.data;
            const latestComment = comments[comments.length - 1];
            onCommentCreated(postId, latestComment);
        }

        setContent("");
    };

    return (
        <form onSubmit={handleSubmit} className="mt-2">
            <div className="mb-2">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Add a comment"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>
            <button className="btn btn-primary btn-sm">Submit</button>
        </form>
    );
};

export default CreateComment;
