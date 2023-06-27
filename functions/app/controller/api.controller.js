/* eslint-disable */
// sendo importado no SERVER como ApiController
const fs = require('fs')
const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.cert({
    
  })
})

// bucket fire storage
const bucket = admin.storage().bucket("relatorio-de-visita-a656c.appspot.com")

// libs pdfMake
const fonts = require('../config/config.pdf').fonts
const PdfPrinter = require('pdfmake')
const printer = new PdfPrinter(fonts)

// post/ criarPDF
exports.createPDF = functions.https.onRequest(async (req, res) => {
  // tratando o req body
  const reqTratado = []

  const pdfHeader = req.body.data
  const appGyverReq = req.body.data.tarefas
  for (i = 0; i < appGyverReq.length; i++) {
    const rows = new Array()
    appGyverReq[i].posicao = i + 1
    rows.push(appGyverReq[i].posicao)
    rows.push(appGyverReq[i].tarefa)
    rows.push(appGyverReq[i].concluido)
    reqTratado.push(rows)
  }

  // docDefinitions pdfmake
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

  // criando o pdf com os parametros recebidos
  const pdfDoc = printer.createPdfKitDocument(docDefinition)

  pdfDoc.on('data', (chunk) => {
    chunks.push(chunk)
  })

  pdfDoc.on('end', () => {
    const result = Buffer.concat(chunks)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader(
      'Content-disposition',
      'attachment; filename=report.pdf'
    )

    // upload o file gerado ao fire storage
    const fileRef = bucket.file(
      'report.pdf',
      { metadata: { contentType: 'application/pdf' } }
    )
    fileRef.save(result)

    // enviando o file gerado como res
    res.send(result)
  })

  pdfDoc.on('error', (err) => {
    res.status(501).send(err)
  })

  pdfDoc.end()
})

 
// libs nodeMailer
const nodemailer = require('nodemailer')

const email = 'sismerapp@gmail.com'
const senha = 

// post/ sendMail
exports.sendMail = async (req, res) => {
  const data = req.body.data
  try {
    const authData = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: email,
        pass: senha
      }
    })

    authData.sendMail({
      from: 'SISMER',
      to: data.email,
      subject: data.subject,
      text: data.content
    }).then(res => res.send({ response: 'email enviado' }))
  } catch (err) {
    res.send('erro', err)
  }
}

exports.check = async (req, res) => {
  try {
    const authData = nodema
  } catch (err) {
    res.send({ res: err })
  }
}
