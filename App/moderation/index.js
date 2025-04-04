const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/events', async (req, res) => {
    const { type, data } = req.body.type;
    console.log('recieved event: ', req.body.type);

    if (type === 'CommentCreated') {
        const status = data.content.includes('orange') ? 'rejected' : 'approved';

        await axios.post('http://localhost:4005/events', {
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