/* eslint-disable */
// sendo importado no SERVER como ApiController

// libs
const fonts = require("../config/config.pdf").fonts
const PdfPrinter = require("pdfmake");
const printer = new PdfPrinter(fonts);
fs = require("fs");

// post /gerarRelatorio
exports.createPDF = async (req, res) => {
  try {
    // tratando o req body
    const reqTratado = [];

    const pdfHeader = req.body.data
    const appGyverReq = req.body.data.tarefas
    for (i = 0; i < appGyverReq.length; i++) {
      const rows = new Array();
      appGyverReq[i].posicao = i + 1;
      rows.push(appGyverReq[i].posicao);
      rows.push(appGyverReq[i].tarefa);
      rows.push(appGyverReq[i].concluido);
      reqTratado.push(rows);
    }

    // docDefinitions pdfmake
    var docDefinition = {
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
            widths:['*','*','*'],
            body: [["Posicao","Tarefa","Concluido"]],
           },
           italics: true,
           bold: true,
           
           fontSize: 18,
           layout: 'lightHorizontalLines',
           fillColor: "#FFFF00"
        },
        {
          table: {
            widths:['*','*','*'],
            body: [...reqTratado],
            bold: false
          },
           fontSize: 14,
           layout: 'lightHorizontalLines'
        },
      ],
    };

    var options = {
      // ...
    };

    // criando o pdf com os parametros recebidos
    var pdfDoc = printer.createPdfKitDocument(docDefinition, options);

    // recebendo em chunks o arquivo do pdf
    const chunks = [];
    pdfDoc.on("data", (chunk) => {
      chunks.push(chunk);
    });

    pdfDoc.end(); //finalizando o printer

    // concatenando os chunks para criar o arquivo
    pdfDoc.on("end", () => {
      const result = Buffer.concat(chunks);
      res.end(result);
    });
  } catch (err) {
    res.send("Houve um erro ao gerar o relatorio : ", err);
  }
};

// post /gerarPDF
/*exports.getAnvilPDF = async (req, res) => {
  try {
    const pdfTemplateId = process.env.TEMPLATEID;
    const apiKey = process.env.APIKEY;

    const dataPDF = {
      title: 'Blank',
      fontSize: 10,
      textColor: '#333333',
      data: {
        data: 'Data',
        Empresa: 'Empresa',
        Loja: 'Loja',
        Agrupamento: 'Agrupamento',
        Porcentagem: 'Porcentagem',
        TarefaLista: [
          'Item 1 - TarefaItem',
          'Item 2 - TarefaItem',
          'Item 3 - TarefaItem',
          'Item 4 - TarefaItem',
          'Item 5 - TarefaItem',
          'Item 6 - TarefaItem',
          'Item 7 - TarefaItem',
          'Item 8 - TarefaItem',
          'Item 9 - TarefaItem',
          'Item 10 - TarefaItem',
          'Item 11 - TarefaItem',
          'Item 12 - TarefaItem',
          'Item 13 - TarefaItem',
          'Item 14 - TarefaItem',
          'Item 15 - TarefaItem',
          'Item 16 - TarefaItem',
          'Item 17 - TarefaItem',
          'Item 18 - TarefaItem',
        ],
        'No.Lista': [
          'Item 1 - Line 1 - No',
          'Item 2 - Line 1 - No',
          'Item 3 - Line 1 - No',
          'Item 4 - Line 1 - No',
          'Item 5 - Line 1 - No',
          'Item 6 - Line 1 - No',
          'Item 7 - Line 1 - No',
          'Item 8 - Line 1 - No',
          'Item 9 - Line 1 - No',
          'Item 10 - Line 1 - No',
          'Item 11 - Line 1 - No',
          'Item 12 - Line 1 - No',
          'Item 13 - Line 1 - No',
          'Item 14 - Line 1 - No',
          'Item 15 - Line 1 - No',
          'Item 16 - Line 1 - No',
          'Item 17 - Line 1 - No',
          'Item 18 - Line 1 - No',
        ],
        ConcluidoLista: [
          'Item 1 - Line 1 - Item',
          'Item 2 - Line 1 - Item',
          'Item 3 - Line 1 - Item',
          'Item 4 - Line 1 - Item',
          'Item 5 - Line 1 - Item',
          'Item 6 - Line 1 - Item',
          'Item 7 - Line 1 - Item',
          'Item 8 - Line 1 - Item',
          'Item 9 - Line 1 - Item',
          'Item 10 - Line 1 - Item',
          'Item 11 - Line 1 - Item',
          'Item 12 - Line 1 - Item',
          'Item 13 - Line 1 - Item',
          'Item 14 - Line 1 - Item',
          'Item 15 - Line 1 - Item',
          'Item 16 - Line 1 - Item',
          'Item 17 - Line 1 - Item',
          'Item 18 - Line 1 - Item',
        ],
      },
    };

    // autenticando o ANVIL
    const anvilClient = new Anvil({ apiKey });

    // enviando a data do PDF
    const { statusCode, data } = await anvilClient.fillPDF(
      pdfTemplateId,
      dataPDF
    );

    console.log(statusCode)// 200 = ok

    // setando os headers necessarios para aceitar PDF, caso a chamada não seja feita com eles
    res.setHeader('Content-Type', 'application/pdf');
    // setando o header para que o browser baixe o response
    res.setHeader('Content-Disposition', 'attachment; filename=Relatorio.pdf');

    // enviando o pdf como response
    res.send(data);
  } catch (err) {
    console.error('Houve um erro ao gerar o PDF : ', err);
  }

}; */
