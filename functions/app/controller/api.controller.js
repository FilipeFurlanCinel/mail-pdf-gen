/* eslint-disable */
// sendo importado no SERVER como ApiController
const fs = require('fs')
const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.cert({
    //segredo
  }),
});


// libs pdfMake
const fonts = require('../config/config.pdf').fonts
const PdfPrinter = require('pdfmake')
const printer = new PdfPrinter(fonts)

/*
// post /gerarPDF
exports.createPDF = async (req, res) => {
  try {
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

    const options = {
      // ...
    }

    // criando o pdf com os parametros recebidos
    const pdfDoc = printer.createPdfKitDocument(docDefinition, options)

    // recebendo em chunks o arquivo do pdf
    const chunks = []
    pdfDoc.on('data', (chunk) => {
      chunks.push(chunk)
    })

    pdfDoc.end() // finalizando o printer

    // concatenando os chunks para criar o arquivo
    pdfDoc.on('end', () => {
      const result = Buffer.concat(chunks)
      res.end(result)
    })
  } catch (err) {
    res.send('Houve um erro ao gerar o relatorio : ', err)
  }
}
*/


// libs pdfKit
const pdfKit = require('pdfkit')
//uuid ultilizado para criar um ID unico para cada PDF
const uuid = require('uuid')

exports.createPDF = functions.
  https.onCall(async(data, context) => {
    const doc = new pdfKit();

    let pdfId = uuid.v4();
    const fileRef = admin
    .storage()
    .bucket()
    file(`pdfs/pdf-${pdfId}.pdf`);

    // I'll explain this part in a second      
    await new Promise((resolve, reject) => {
      const writeStream = fileRef.createWriteStream({
        resumable: false,
        contentType: "application/pdf",
      });
      writeStream.on("finish", () => resolve());
      writeStream.on("error", (e) => reject(e));
      
      doc.pipe(writeStream);

    doc
      .fontSize(24)
      .text('Teste')
      .fontSize(16)
      .moveDown(2)
      .text('Esse é o teste')
    
    doc.end()
  })
  const url = await file.getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + 24 * 60 * 60 * 1000,
  });
    
  return { url };

})


// libs nodeMailer
const nodemailer = require('nodemailer')

const email = 'sismerapp@gmail.com'
const senha = 'cmkncvqhzehrztei'

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
      text: data.content,
    }).then(res => res.send({response: 'email enviado'}))
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
