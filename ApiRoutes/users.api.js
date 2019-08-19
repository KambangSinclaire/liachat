const express = require('express');
const UserRouter = express.Router();
const userModel = require('../Models/users.model');
const formidable = require('formidable');
const util = require('util');
const fs = require('fs-extra');


// Api route for Uthenticating a User
UserRouter.post('/user/login', (req, res) => {
    authenticateUser = {
        username: req.body.username,
        password: req.body.password,
        isLoggedIn: req.body.isLoggedIn,
        where: { username: req.body.username }
    }
    userModel.findOne(authenticateUser)
        .then(user => res.json(user))
        .catch(error => console.log(error))
});


// Api route for getting User Details during product purchase
UserRouter.post('/user/details', (req, res) => {
    getUser = {
        email: req.body.email,
        where: { email: req.body.email, }
    }
    userModel.findOne(getUser)
        .then(user => {
            if (user === null) {
                res.json({
                    "error_code": "-1",
                    "msg": "Email Doest Not Exist"
                });
            } else {
                res.json(user);
            }
        })
        .catch(error => console.log(error)
        )
});






// Api route for registering a user
UserRouter.post('/user/registerUser', (req, res) => {

    registerUser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
    }
    userModel.create(registerUser)
        .then(user => res.json(user))
        .catch(error => console.log(error));
});






// Use quickthumb
UserRouter.post('/upload', (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        res.writeHead(200, { 'content-type': 'text/plain' });
        res.write('received upload:\n\n');
        res.end(util.inspect({ fields: fields, files: files }));
    });

    form.on('end', function (fields, files) {
        /* Temporary location of our uploaded file */
        var temp_path = this.openedFiles[0].path;
        /* The file name of the uploaded file */
        var file_name = this.openedFiles[0].name;
        /* Location where we want to copy the uploaded file */
        var new_location = 'uploads/';

        fs.copy(temp_path, new_location + file_name, function (err) {
            if (err) {
                console.error(err);
            } else {
                console.log("success!")
            }
        });
    });
});

// Show the upload form 
// app.get('/', function (req, res) {
//     res.writeHead(200, { 'Content-Type': 'text/html' });
//     var form = '<form action="/upload" enctype="multipart/form-data" method="post">Add a title: <input name="title" type="text" /><br><br><input multiple="multiple" name="upload" type="file" /><br><br><input type="submit" value="Upload" /></form>';
//     res.end(form);
// });
// app.listen(8080);



module.exports = UserRouter;