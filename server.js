const mongoose = require('mongoose');
const app = require('./api/index');
const log = require('./utils/log.utils')
require('dotenv').config();

//conectarse a bd
mongoose.Promise = global.Promise;
try {
    conn = await mongoose.connect(`${process.env.DB_CONNECT}/collections`)
    log.debug("OK", "Success to connect to DB")
        app.listen(process.env.PORT, () => {
            log.debug("OK", `Serves is running in ${process.env.HOST}`)
        })
} catch (err) {
    log.error(err)
}

module.exports = app