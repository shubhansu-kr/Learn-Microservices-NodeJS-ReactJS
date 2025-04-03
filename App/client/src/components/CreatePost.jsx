import { useState } from "react";
import axios from "axios";

const CreatePost = ({ onPostCreated }) => {
    const [title, setTitle] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        const res = await axios.post("http://localhost:4000/posts", { title });

        onPostCreated(res.data); // Pass new post to update state in PostList
        setTitle(""); // Clear input after submission
    };

    return (
        <div className="container mt-4">
            <h3>Create a Post</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default CreatePost;
