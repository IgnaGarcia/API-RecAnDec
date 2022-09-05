const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('../doc/swagger.json');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


app.use('', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

module.exports = app;