/* eslint-disable */
module.exports = app => {
  // importando as funcoes do controller
  const controllers = require('../controller/api.controller')

  // router do express
  var router = require('express').Router();

  // criando o PDF ANVIL
  //router.post('/gerarPDF', controllers.getAnvilPDF)

  // criando o PDF pdfMaker
  router.post('/gerarPDF', controllers.createPDF)

  // router cuidadara de requests para "root/api"
  app.use('/api', router);
};
