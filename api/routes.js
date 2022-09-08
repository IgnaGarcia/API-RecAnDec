const express = require('express');
const recordRoutes = require('./record/index');

const app = express();

app.use('/user', recordRoutes);

module.exports = app;