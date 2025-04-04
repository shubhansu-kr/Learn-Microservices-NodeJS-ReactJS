const CommentList = ({ comments }) => {
    return (
        <ul className="list-group list-group-flush">
            {comments.map((comment) => (
                <li className="list-group-item" key={comment.id}>
                    {comment.content}
                </li>
            ))}
        </ul>
    );
};

export default CommentList;
