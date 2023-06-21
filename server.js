/* eslint-disable */
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const bodyParser = require("body-parser");
require('dotenv').config();

// inicializando as libs necessarias
const app = express();
app.use(bodyParser.json());
app.use(cors());

// salvando nossos dados do SDK
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);

// inicializando o SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// importando o router
require('./app/routes/api.route.js')(app) // router cuida de "root/api"

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server rodando');
});
