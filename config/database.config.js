const Sequelize = require('sequelize');
const prodConnectionString = process.env.DATABASE_URL;

if (prodConnectionString) {
    const database = new Sequelize(prodConnectionString, {
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });

    module.exports = database;
} else {

    const database = new Sequelize('Liachat', 'postgres', 'rootuser', {
        host: 'localhost',
        dialect: 'postgres',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
    });
    module.exports = database;
}

