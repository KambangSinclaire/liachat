const Sequelize = require('sequelize');
const database = require('../config/database.config');


const user = database.define('liachatUsers', {

    username: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    phone: {
        type: Sequelize.INTEGER
    },
    profilePicture: {
        type: Sequelize.STRING
    },
    isLoggedIn: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
});

module.exports = user;
