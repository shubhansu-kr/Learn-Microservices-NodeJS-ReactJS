# Mini Blog Application

Functionalities of the blog applciation.

1. User can create a blog.
2. User can comment on the blog.
3. All the blogs will be displayed on the home page.

Three very simple features to be implemented in this blog application.

## Design for this blog application

We will go with creating two different services for this application

1. Post service
    - Create a post
    - List all posts
2. Comment Service
    - Create a comment
    - List all comments

Initial App Setup

1. Generate a new react app
2. Create an express based project for Post service
3. Create an express based project for Comments service

Steps:

1. Create an application folder
    - `mkdir App`
2. Create a react application named client
    - `npm create vite@latest client -- --template react`
    - `cd client`
    - `npm install`
    - `npm run dev`
3. Create a dir for posts service in App dir
    - `mkdir posts`
    - `cd posts`
    - `npm init -y`
    - `npm install express cors axios nodemon`
4. Repeat the steps for comments service
    - `mkdir comments`
    - `cd comments`
    - `npm init -y`
    - `npm install express cors axios nodemon`

Now we need to start implementing the services.

### Posts service

In the posts service we need two functionality - get all posts and create a post. Both the feature can be implemented on the same path (/posts) with different methods. GET to retrieve all post and POST to create a post.

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');

const app = express();
app.use(bodyParser.json());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts', (req, res) => {
    const id = randomBytes(4).toString('hex');

    const { title } = req.body;

    posts[id] = {
        id,
        title
    };

    res.status(201).send(posts[id]);
});

app.listen(4000, () => {
    console.log('Server listening to 4000');
});
```

### Comments Service

Comment service will also have two routes. /posts/:id/comments with GET method to get all the comment on the post and with POST method to create a comment on the post.

```javascript

const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');

const app = express();
app.use(bodyParser.json());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', (req, res) => {
    const commentId = randomBytes(4).toString('hex');

    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];

    comments.push({ id: commentId, content });

    commentsByPostId[req.params.id] = comments;

    res.status(201).send(commentsByPostId[req.params.id]);
});

app.listen(4001, () => {
    console.log('Server listening to 4001');
});
```

### Client Application - React

Now we need to create client application which will give users an interface to create post, comment and read all the posts and comment. For this we will we using react and the design will be as follows. React app -> will have two component. First one will be create post and second will be list post and in post list component we will have comment list and comment create component.

The setup for client app is too large to be listed here. Check in the project 0 zip.

### Minimize the request

Now we face the issue where number of API calls is higher than required. We are fetching all the posts and the fetching all the comments assosited with each post. This is increasing the number of API calls to the server.

Now there are two ways to minimise the number of API calls :

1. Sync : Create a API call from post service to the comment service to retrieve all the comments from the service and return to the client in one request only.

2. Async : We will create a query service. which will listen to whenever a new post or comment is created. So this query service will own a database where we will save id of the post, title of the post and list of all the commnets.

### Event Bus

Event bus is a simple multicasting service which listens to individual service ommitting an event and forecasts it to all the active services.

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', (req, res) => {
    const event = req.body;

    axios.post('http://localhost:4000/events', event).catch((err) => {
        console.log(err.message);
    });
    axios.post('http://localhost:4001/events', event).catch((err) => {
        console.log(err.message);
    });
    axios.post('http://localhost:4002/events', event).catch((err) => {
        console.log(err.message);
    });

    res.send({ status: "ok" });
});

app.listen(4005, () => {
    console.log('Server listening to 4005');
});
```

### Query Service

The query service listens to the events being propagated by the event bus and updates it's database accordingly. If a post or comment is created, it's event is catched by the query service via event bus and the db is accordingly updated.

```javascript

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;

    if (type == 'PostCreated') {
        const { id, title } = data;
        posts[id] = { id, title, comments: []};
    }
    if (type == 'CommentCreated') {
        const {id, content, postId} = data;
        const post = posts[postId];

        post.comments.push({id, content});
    }

    console.log(posts);

    res.send({});
});

app.listen(4002, () => {
    console.log('Server listening to 4002');
});
```

### Comment Moderation feature

To implement the comment moderation feature, we created a new service which listens to comment created event and moderated the comment and sends out commentModerated event. Now we are update the comment's database and query database when the moderated event triggers the comment update event.

Flow diagram :
commentCreated -> Updates query service, triggers moderation service.
commentModerated -> Updated comment service, triggers comment update event.
commentUpdate -> Updates the comment status in the query service db.

### Event Syncing

For missing events / creating a new service, we store all the events in the event bus and let others service borrow all the events data to update their status.
