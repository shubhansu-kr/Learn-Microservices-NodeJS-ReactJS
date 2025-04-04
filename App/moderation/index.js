const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', (req, res) => {
    const { type, data } = req.body;
    console.log('recieved event: ', req.body.type);

    if (type == "CommentCreated") {
        console.log('comment created event recieved in moderation service');
        const status = data.content.includes('orange') ? 'rejected' : 'approved';

        axios.post('http://localhost:4005/events', {
            type: 'commentModerated',
            data: {
                id: data.id,
                postId: data.postId,
                status,
                content: data.content
            }

        }).catch((err) => {
            console.log("error: ", err.messsage);
        });
    }

    res.send({});
});

app.listen(4003, () => {
    console.log('Server listening to 4003');
});