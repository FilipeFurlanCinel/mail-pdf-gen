/* eslint-disable */
// sendo importado no SERVER como ApiController
const fs = require('fs')
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cors = require('cors')({ origin: true })


// nosso bucket no fire Storage
const bucket = require('../config/config.db')

// libs pdfMake
const fonts = require('../config/config.pdf').fonts
const PdfPrinter = require('pdfmake')
const printer = new PdfPrinter(fonts)

// post/ criarPDF
exports.createPDF = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      res.set('Access-Control-Allow-Origin', '*')
      res.set('Access-Control-Allow-Methods', 'GET, POST')

      const reqTratado = []

      const pdfHeader = req.body.data
      const appGyverReq = req.body.data.tarefas
      for (let i = 0; i < appGyverReq.length; i++) {
        const rows = []
        appGyverReq[i].posicao = i + 1
        rows.push(appGyverReq[i].posicao)
        rows.push(appGyverReq[i].tarefa)
        rows.push(appGyverReq[i].concluido)
        reqTratado.push(rows)
      }

      const docDefinition = {
        content: [
          {
            text: `${pdfHeader.data}\n ${pdfHeader.rede}\n ${pdfHeader.loja}\n ${pdfHeader.setor}\n ${pdfHeader.porcentagem} \n \n \n`,
            style: 'header',
            fontSize: 30,
            alignment: 'center',
            bold: true
          },
          {
            table: {
              widths: ['*', '*', '*'],
              body: [['Posicao', 'Tarefa', 'Concluido']]
            },
            italics: true,
            bold: true,
            fontSize: 18,
            layout: 'lightHorizontalLines',
            fillColor: '#FFFF00'
          },
          {
            table: {
              widths: ['*', '*', '*'],
              body: [...reqTratado],
              bold: false
            },
            fontSize: 14,
            layout: 'lightHorizontalLines'
          }
        ]
      }

      const chunks = []

      const pdfDoc = printer.createPdfKitDocument(docDefinition)

      pdfDoc.on('data', (chunk) => {
        chunks.push(chunk)
      })

      pdfDoc.on('end', () => {
        const result = Buffer.concat(chunks)
        const fileRef = bucket.file('report.pdf', {
          metadata: { contentType: 'application/pdf' }
        })
        const stream = fileRef.createWriteStream({
          resumable: false,
          gzip: true
        })

        stream.on('error', (error) => {
          console.error('Erro ao fazer o upload ao Storage :', error)
          res.status(500).send('Erro ao fazer o upload do pdf')
        })

        stream.on('finish', () => {
          res.status(200).send('PDF criado e salvo no bucket')
        })

        stream.end(result)
      })

      pdfDoc.end()
    } catch (error) {
      console.error('Erro ao criar o PDF:', error)
      res.status(500).send('Erro ao criar o PDF PDF')
    }
  })
})

// libs nodeMailer
const nodemailer = require('nodemailer')

const email = 'sismerapp@gmail.com'
const senha = 'cmkncvqhzehrztei'

// post/ enviarEmail
exports.sendMail = functions.https.onRequest((req, res) => {
  async (req, res) => {
    const data = req.body.data
    try {
    // configurando o CORS
      res.set('Access-Control-Allow-Origin', '*')
      res.set('Access-Control-Allow-Methods', 'POST')
      const authData = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: email,
          pass: senha
        }
      })

      await authData
        .sendMail({
          from: '//de onde vem',
          to: data.email,
          subject: data.subject,
          text: data.content
        })
        .then(res.send({ response: 'Email enviado' }))
    } catch (err) {
      res.status(501).send(err)
    }
  }
})

// get/ test
exports.check = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
    // configurando o CORS
      res.set('Access-Control-Allow-Origin', '*')
      res.set('Access-Control-Allow-Methods', 'GET, POST')
      res.send({ response: 'server ok' })
    } catch (err) {
      res.status(500).send({ erro: 'Erro ao executar a API', message: err })
    }
  })
})
