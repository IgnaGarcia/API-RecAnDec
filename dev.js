const mongoose = require('mongoose');
const app = require('./api/index');
const log = require('./utils/log.utils')
require('dotenv').config();

const start = async() => {
    mongoose.Promise = global.Promise;
    try {
        await mongoose.connect(`${process.env.DB_CONNECT}/test`)
        log.debug("OK", "Success to connect to DB")
    
        app.listen(process.env.PORT, () => {
            log.debug("OK", `Serves is running in ${process.env.HOST}`)
        })
    } catch (err) {
        log.error(err)
    }
}

start()