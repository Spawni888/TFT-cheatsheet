'use strict';
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const config = require('./config');

const modelsPath = path.join(__dirname, '..', 'models');

const initModels = () => {
    fs
        .readdirSync(modelsPath)
        .filter(file => file.endsWith('.js'))
        .forEach(file => require(path.join(modelsPath, file)));
};

const connect = () => {
    const mongoHost = process.env.ENV === 'production' ? 'mongo' : config.database.host;
    const dbName = config.database.name;

    mongoose.connect(`mongodb://${mongoHost}:27017/${dbName}`, { useNewUrlParser: true });
    const db = mongoose.connection;
    let retries = 0;
    db.on('error', () => {
        if (retries >= 30) {
            console.error.bind(console, 'connection error:');
        } else {
            console.log('Mongo restoring, expected unsuccessful connection')
        }
        if (db.readyState === 0) {
            setTimeout(() => {
                retries += 1;
                if (db.readyState !== 0) {
                    return;
                }
                mongoose.connect(`mongodb://${mongoHost}:27017/eldorado`, { useNewUrlParser: true })
                    .catch(err => {
                        console.log(err)
                    });
            }, 1000);
        }
    });
    db.once('open', () => {
        console.log('mongo instance mounted');
    });

    initModels();

    return db;
};

module.exports = { connect };
