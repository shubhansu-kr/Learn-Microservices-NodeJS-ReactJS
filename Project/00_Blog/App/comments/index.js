const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');


const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', (req, res) => {
    const commentId = randomBytes(4).toString('hex');

    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];

    comments.push({ id: commentId, content, status: 'pending' });

    commentsByPostId[req.params.id] = comments;

    axios.post("http://event-bus-srv:4005/events", {
        type: "CommentCreated",
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: 'pending'
        }
    }).catch((err) => {
        console.log(err);
    });

    res.status(201).send(commentsByPostId[req.params.id]);
});

app.post('/events', async (req, res) => {

    const { type, data } = req.body;
    console.log('recieved event: ', req.body.type);

    if (type === 'commentModerated') {
        const { postId, id, status, content } = data;

        const comments = commentsByPostId[postId];
        const comment = comments.find(comment => {
            return comment.id === id;
        });

        comment.status = status;

        await axios.post('http://event-bus-srv:4005/events', {
            type: 'commentUpdated',
            data: {
                id,
                postId,
                status,
                content
            }

        }).catch((err) => {
            console.log("error: ", err.messsage);
        });
    }
    res.send({});
});

app.listen(4001, () => {
    console.log('Server listening to 4001');
});