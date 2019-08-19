const express = require('express');
const socket = require('socket.io');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const userApiRoutes = require('./ApiRoutes/users.api');
const messageApiRoutes = require('./ApiRoutes/messages.api');
const database = require('./config/database.config');
const qt = require('quickthumb');
const port = process.env.PORT || 9000;
const app = express();

/*
* Application Middlewares
*/
app.use(cors());
app.use(qt.static(__dirname + '/'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use('/liachat.api', userApiRoutes);
app.use('/liachat.api', messageApiRoutes);
app.use(express.static('public'))
app.use('/views', express.static('/public/views/main.html'));
app.use('/styles', express.static('/public/styles/main.css'));



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/src/views/main.html'));
});



// Connecting to PostGres Database
database.authenticate()
    .then(() => {
        console.log("Database Connected Successfully");

    })
    .catch(error => {
        console.log("error" + error);

    });




const server = app.listen(port, () => {
    console.log(`Server started on port ${port}`);

});


// Socket IO Implementation starts here
const serverSocket = socket(server);

serverSocket.on('connection', (socket) => {
    console.log(`A client of Id = ${socket.id} just connected`);
    socket.on('message', (data) => {

        socket.broadcast.emit('message', data);
    });
    socket.on('typing', (user) => {
        socket.broadcast.emit('typing', user);
    });
});
// Socket IO Implementation ends here












// var express = require('express');
// var socket = require('socket.io');

// //App Setup

// var app = express();

// var server = app.listen(4000, function () {

//     console.log('listening to requests on port 4000');
// });

// //Static files
// app.use(express.static('public'));


// // Socket setup
// var io = socket(server);

// io.on('connection', function (socket) {

//     console.log('made socket connection');

//     //Handle Chat event
//     socket.on('chat', function (data) {
//         io.sockets.emit('chat', data);
//     });

//     //Listen for typing
//     socket.on('typing', function (data) {
//         socket.broadcast.emit('typing', data);
//     });
// });