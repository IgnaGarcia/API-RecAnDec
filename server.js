const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();

//conectarse a bd
mongoose.Promise = global.Promise;
console.log(process.env.DB_CONNECT)
mongoose.connect(`${process.env.DB_CONNECT}/`)
    .then(() => {
        console.log("OK - Success to connect to DB");
        app.listen(process.env.PORT, () => {
            console.log(`OK - Serves is running in ${process.env.HOST}`);
        })
    })
    .catch(err => console.log("ERR - Error to connect to DB: ",err));