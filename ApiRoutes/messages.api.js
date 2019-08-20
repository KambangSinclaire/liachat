const express = require('express');
const chatMessage = require('../Models/message.model')
const messagesRouter = express.Router();


messagesRouter.post('/message/sent/save', (req, res) => {
    const message = {
        message: req.body.message,
        author: req.body.author,
        time: req.body.time,
        isSent: req.body.isSent
    }
    chatMessage.create(message)
        .then(message => {
            res.json(message);
        })
        .catch(error => {
            console.log(error);

        })
});

messagesRouter.post('/message/received/saveMessage', (req, res) => {
    const message = {
        message: req.body.message,
        author: req.body.author,
        time: req.body.time,
        isSent: req.body.isSent
    }
    chatMessage.create(message)
        .then(message => {
            res.json(message);
        })
        .catch(error => {
            console.log(error);

        })
});

messagesRouter.get('/messages', (req, res) => {
    chatMessage.findAll()
        .then(messages => res.json(messages))
        .catch(error => console.log(error)
        );
})

module.exports = messagesRouter;