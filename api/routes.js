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

app.use('/users', userRoutes);
app.use('/records', recordRoutes);
app.use('/categories', categoryRoutes);
app.use('/limits', limitRoutes);
app.use('/commands', commandRoutes);
app.use('/tags', tagRoutes);
app.use('/wallets', walletRoutes);
app.use('/telegram', telegramRoutes);

module.exports = app;