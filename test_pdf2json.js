const PDFParser = require("pdf2json");
const fs = require("fs");

const pdfParser = new PDFParser(null, 1);
pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
pdfParser.on("pdfParser_dataReady", pdfData => {
    console.log(pdfParser.getRawTextContent());
});
// Need a sample pdf
fs.writeFileSync('sample.pdf', ''); // Just checking if it requires properly formatted pdf or runs without error on init
console.log("PDFParser initialized successfully");
