/* eslint-disable */
// sendo importado no SERVER como ApiController
const fs = require('fs')
const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.cert({
    type: 'service_account',
    project_id: 'relatorio-de-visita-a656c',
    private_key_id: 'eaea247e9a323b5b7475f5c42d86e82fdbcbf673',
    private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDLlYJZFOVA4wKE\nuYYUc10tlWXTKujttKG1PDWndQlBG+9L78yEzwl4T2EmAUCKKq05qPvYoCZeNJnp\njtyAXkTxqzgV9fl5utGrGFcTe/wBRyKGX9a2pDZZZwxzfDj0DmTjQuNpdHRe4qFj\neUe/jRkPoA8Ur06DgWKSD0pjFUo7lR3+SstREG3xTw9bAlJv+2FAH9rYDFkbrUe6\nw7pfpLzKNQ5w9JTJDYaMWqLjucGUkqwGUAWBxI3nJHclNhKFQl9W5JjbLK0IYiOj\nU3APabP5v4/wc50/eOM+nMx9R460PIIR653OjnsNdAJcMmnX37Anw7AJYAbh34U7\n62vSClEFAgMBAAECggEAAoAItJkF7bjmotmiahA2oI+D9hwXSzVbgl3Fwj403w39\nmimiPIP3DPlbQJEQXqytKZbygikJVOvWyLWpQzxPzXCkWi9bS8w9tJkHwg9U5hvJ\nB+xtDHDSKAvqF7r6pL35LYn4lVF0TRFXGQvNaUP4KacguEjPhobpaSYd7D8/2kvH\nXzEy6tAItMyKy+QHIRpQCYvu1rBpiDngPCY4edLr7o/CjNPCOSdUAW8JKdP7DRJJ\ngAZ6LziQY6EgKIyZm76ZsVZWVnK6hsqluDEBO3W31AkyadkjS9TSGQZ5fQhaRX+w\nAkdCP6iCKQGY/KDiGEOaJvDRshqqi1TvwE3wemwLcQKBgQD9xVSTewJ9bLkDiMim\n3k+fKh6oxRoHCc8v4MzaoTgJq/RuSMakb4YgTXKMqkhBNMaSjlJcAtjSB2tz89X8\nUGdrOPUAfIn4qGKIuWwf1phVtn4OD/hBMGfx1LukYwecFMhXmeCVOBTitV9TUG7c\nlgxbCvFVa55TEjw/ExoN7LVJTQKBgQDNX1IboSm2XNp0pjoxpoYFdREHrYF90Ige\nT51LjueOOfhi5i+ehoVH/31kx68/QfMKlCXiokEn5+9dhkXmtAUsAzUy3WvzPfY3\n4jLGc8i90UUTRv4mXc5vKBE8MTO2BfDnNMpZWmHnK3fEcb/SqEpEc+5oUWilcfhH\n1Qy0WeaKmQKBgQDCRltlPHq/gohxSDo0ZWUXOKuYEKzITp4qzTKG/X1lChtqgpRw\nNmC8Qg472fDO2pRahlJO1m8e+0cr0bQ0IWnLECOgZ7dIgcBNY4Z/KU4d8EO4iElJ\nvsEUxgOQ6a9dshtd1RO1qOV0Wd3MbnswrD5xRINVHbprZj5xGzKLDngK0QKBgQDA\nqLM2CDJBSUoGNApTmYwQgom/Uh0wEfgft0AwKZc/7VH+NUJmzHsr15mieVEFXrDJ\nM8F2og/Nh98dNWFN04MmjrvRQ7aJMY9RTXmkgenHaBIMy4SQKWAHFudUODPyhhBA\nVV2eBRPi8Pwh5TO2QvmozbjRU81/pzLq8ApDBjMnwQKBgHlampOaZ3ZMhKbb9cpn\noGWZMrIiC1N8qTfcWL8jlsI0oxK7u4auu1OxPjL//OTDUboo5y6LoaZ0RbkXv3Kq\ngrzTVFCAlIL/JR5YpZl447MjlBbI0hWECM4Q0mrfXS/PLbocep8awKYfXI0GyGIH\nWzzICULZiZUMIat6X3Fw+qKx\n-----END PRIVATE KEY-----\n',
    client_email: 'firebase-adminsdk-ol3mg@relatorio-de-visita-a656c.iam.gserviceaccount.com',
    client_id: '105351613309097785665',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ol3mg%40relatorio-de-visita-a656c.iam.gserviceaccount.com',
    universe_domain: 'googleapis.com'
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
const senha = 'cmkncvqhzehrztei'

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
