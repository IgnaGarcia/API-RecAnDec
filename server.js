const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send(`[GET] home`)
});


app.listen(3100, () => {
    console.log(`Server ON. PORT: ${3000}`)
})