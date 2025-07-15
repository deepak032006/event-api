const express = require('express');
const app = express();
const eventRoutes = require('./routes/eventRoutes');

app.use(express.json());
app.use('/events', eventRoutes);

module.exports = app;