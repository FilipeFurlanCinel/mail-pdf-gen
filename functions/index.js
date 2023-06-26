/* eslint-disable */
const functions = require('firebase-functions');
const express = require('express');
const app = express();


const apiRoute = require('./app/routes/api.route');
app.use('/api',apiRoute);

exports.app = functions.https.onRequest(app);