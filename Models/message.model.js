const Sequelize = require('sequelize');
const database = require('../config/database.config');


const message = database.define('messages', {

    message: {
        type: Sequelize.STRING
    },
    isSent: {
        type: Sequelize.BOOLEAN
    },
    time: {
        type: Sequelize.DATE
    },
    author: {
        type: Sequelize.STRING
    },
});

module.exports = message;
