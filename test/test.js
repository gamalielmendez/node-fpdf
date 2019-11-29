const FPDF = require('../fpdf')

const Doc = new FPDF() 
Doc.AddFont('courier')
Doc.AddPage()