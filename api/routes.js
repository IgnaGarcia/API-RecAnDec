const express = require('express');
const recordRoutes = require('./record/index');
const categoryRoutes = require('./category/index');
const limitRoutes = require('./limit/index');
const commandRoutes = require('./command/index');

const app = express();

app.use('/user', recordRoutes);
app.use('/user', categoryRoutes);
app.use('/user', limitRoutes);
app.use('/user', commandRoutes);

module.exports = app;