const mongoose = require('mongoose');

module.exports = {
    init: () => {
        const dbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: false,
            autoIndex: false,
            connectTimeoutMS: 10000,
            family: 4,
        };

        mongoose.connect(process.env.DB_URL, dbOptions);
        mongoose.Promise = global.Promise;

        mongoose.connection.on('connected', () => {
            console.log('Conencted to database');
        });

        mongoose.connection.on('err', err => console.err(err));

        mongoose.connection.on('disconnect', () => {
            console.log('Disconnected from database');
        });
    },
};