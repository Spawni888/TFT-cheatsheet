let port = process.env.PORT || 3000;

module.exports = {
    app: {
        port
    },
    database: {
        host: 'localhost',
        name: 'bp'
    },
    keys: ['move it to local config for any environments']
};
