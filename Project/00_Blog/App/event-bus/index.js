const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const events = [];

app.post('/events', (req, res) => {
    const event = req.body;

    events.push(event);
    console.log('shuvh: Recieved Event');

    axios.post('http://posts-clusterip-srv:4000/events', event).catch((err) => {
        console.log(err.message);
    });
    axios.post('http://comments-clusterip-srv:4001/events', event).catch((err) => {
        console.log(err.message);
    });
    axios.post('http://query-clusterip-srv:4002/events', event).catch((err) => {
        console.log(err.message);
    });
    axios.post('http://moderation-clusterip-srv:4003/events', event).catch((err) => {
        console.log(err.message);
    });

    res.send({ status: "ok" });
});

app.get('/events', (req, res) => {
    res.send(events);
});

app.listen(4005, () => {
    console.log('Server listening to 4005');
});