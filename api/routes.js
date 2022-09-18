const express = require('express');
const recordRoutes = require('./record/index');
const categoryRoutes = require('./category/index');
const limitRoutes = require('./limit/index');
const commandRoutes = require('./command/index');
const tagRoutes = require('./tag/index');
const walletRoutes = require('./wallet/index');
const telegramRoutes = require('./telegram/index');
const userRoutes = require('./user/index');

const app = express();

app.use('/user', userRoutes);
app.use('/user', recordRoutes);
app.use('/user', categoryRoutes);
app.use('/user', limitRoutes);
app.use('/user', commandRoutes);
app.use('/user', tagRoutes);
app.use('/user', walletRoutes);
app.use('/telegram', telegramRoutes);

module.exports = app;