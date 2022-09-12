const express = require('express');
const recordRoutes = require('./record/index');
const categoryRoutes = require('./category/index');

const app = express();

app.use('/user', recordRoutes);
app.use('/user', categoryRoutes);

module.exports = app;