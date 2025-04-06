import CommentList from "./CommentList";
import CreateComment from "./CreateComment";

const PostItem = ({ post, onCommentCreated }) => {
    return (
        <div className="card mt-3">
            <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <CommentList comments={post.comments} />
                <CreateComment postId={post.id} onCommentCreated={onCommentCreated} />
            </div>
        </div>
    );
};

export default PostItem;
