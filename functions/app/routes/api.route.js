/* eslint-disable */
const express = require('express')
const router = express.Router()

// importando as funcoes do controller
const controllers = require('../controller/api.controller')

// criando o PDF pdfMaker
router.post('/gerarPDF', controllers.createPDF)

// enviando emails
router.post('/enviarEmail', controllers.sendMail)

// route check
router.get('/teste', controllers.check)

// router cuidadara de requests para "root/api"
module.exports = router
