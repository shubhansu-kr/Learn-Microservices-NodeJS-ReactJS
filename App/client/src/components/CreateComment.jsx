import { useState } from "react";
import axios from "axios";

const CreateComment = ({ postId, onCommentCreated }) => {
    const [content, setContent] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        const res = await axios.post(`http://localhost:4001/posts/${postId}/comments`, { content });

        onCommentCreated(res.data); // Send new comment to parent
        setContent(""); // Clear input field
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-2">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Add a comment"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">Submit</button>
        </form>
    );
};

export default CreateComment;
