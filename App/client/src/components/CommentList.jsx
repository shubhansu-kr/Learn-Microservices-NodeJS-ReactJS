const CommentList = ({ comments }) => {
    return (
        <ul className="list-group list-group-flush">
            {comments
                .filter(comment => comment.status !== "rejected") // Exclude rejected comments
                .map((comment) => (
                    <li className="list-group-item" key={comment.id}>
                        {comment.status === "pending"
                            ? "Approval Pending"
                            : comment.content}
                    </li>
                ))}
        </ul>
    );
};

export default CommentList;
