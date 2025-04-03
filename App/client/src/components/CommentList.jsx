const CommentList = ({ comments }) => {
    return (
        <div className="mt-3">
            <h6>Comments</h6>
            <ul className="list-group">
                {comments.map((comment) => (
                    <li key={comment.id} className="list-group-item">
                        {comment.content}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CommentList;
