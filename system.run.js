const { connection, connect } = require('mongoose');
const config = require('./config.mineapi.js');
require('cute-logs');

connect(config.database.connect, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
}).then(() => {
    console.success("Mongoose successfully connected.", "Database");
    require('./src/client/run.js');
});