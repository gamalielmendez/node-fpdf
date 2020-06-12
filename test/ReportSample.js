const FPDF = require('../index')
const { strtoupper, substr, count } = require('../src/PHP_CoreFunctions')

let textColour = [0, 0, 0];
let headerColour = [100, 100, 100];
let tableHeaderTopTextColour = [255, 255, 255];
let tableHeaderTopFillColour = [125, 152, 179];
let tableHeaderTopProductTextColour = [0, 0, 0];
let tableHeaderTopProductFillColour = [143, 173, 204];
let tableHeaderLeftTextColour = [99, 42, 57];
let tableHeaderLeftFillColour = [184, 207, 229];
let tableBorderColour = [50, 50, 50];
let tableRowFillColour = [213, 170, 170];
let reportName = "2009 Widget Sales Report";
let reportNameYPos = 160;
let logoFile = "widget-company-logo.png";
let logoXPos = 50;
let logoYPos = 108;
let logoWidth = 110;
let columnLabels = ["Q1", "Q2", "Q3", "Q4"];
let rowLabels = ["SupaWidget", "WonderWidget", "MegaWidget", "HyperWidget"];
let chartXPos = 20;
let chartYPos = 250;
let chartWidth = 160;
let chartHeight = 80;
let chartXLabel = "Product";
let chartYLabel = "2009 Sales";
let chartYStep = 20000;

let chartColours = [
    [255, 100, 100],
    [100, 255, 100],
    [100, 100, 255],
    [255, 255, 100],
]

let data = [
    [9940, 10100, 9490, 11730],
    [19310, 21140, 20560, 22590],
    [25110, 26260, 25210, 28370],
    [27650, 24550, 30040, 31980],
]

const pdf = new FPDF('P', 'mm', 'A4');

pdf.SetTextColor(textColour[0], textColour[1], textColour[2]);
pdf.AddPage()
pdf.SetFont('Arial', 'B', 24)
pdf.Ln(reportNameYPos)
pdf.Cell(0, 15, reportName, 0, 0, 'C')

pdf.AddPage();
pdf.SetTextColor(headerColour[0], headerColour[1], headerColour[2]);
pdf.SetFont('Arial', '', 17);
pdf.Cell(0, 15, reportName, 0, 0, 'C');

pdf.SetTextColor(textColour[0], textColour[1], textColour[2]);
pdf.SetFont('Arial', '', 20);
pdf.Write(19, "2009 Was A Good Year");

pdf.Ln(16);
pdf.SetFont('Arial', '', 12);
pdf.Write(6, "Despite the economic downturn, WidgetCo had a strong year. Sales of the HyperWidget in particular exceeded expectations. The fourth quarter was generally the best performing; this was most likely due to our increased ad spend in Q3.");
pdf.Ln(12);
pdf.Write(6, "2010 is expected to see increased sales growth as we expand into other countries.");

pdf.SetDrawColor(tableBorderColour[0], tableBorderColour[1], tableBorderColour[2]);
pdf.Ln(15);

pdf.SetFont('Arial', 'B', 15);

pdf.SetTextColor(tableHeaderTopProductTextColour[0], tableHeaderTopProductTextColour[1], tableHeaderTopProductTextColour[2]);
pdf.SetFillColor(tableHeaderTopProductFillColour[0], tableHeaderTopProductFillColour[1], tableHeaderTopProductFillColour[2]);
pdf.Cell(46, 12, " PRODUCT", 1, 0, 'L', true);

pdf.SetTextColor(tableHeaderTopTextColour[0], tableHeaderTopTextColour[1], tableHeaderTopTextColour[2]);
pdf.SetFillColor(tableHeaderTopFillColour[0], tableHeaderTopFillColour[1], tableHeaderTopFillColour[2]);

for (let i = 0; i < count(columnLabels); i++) {
    pdf.Cell(36, 12, columnLabels[i], 1, 0, 'C', true);
}

pdf.Ln(12);

let fill = false;
let row = 0;

data.forEach(dataRow => {

    pdf.SetFont('Arial', 'B', 15);
    pdf.SetTextColor(tableHeaderLeftTextColour[0], tableHeaderLeftTextColour[1], tableHeaderLeftTextColour[2]);
    pdf.SetFillColor(tableHeaderLeftFillColour[0], tableHeaderLeftFillColour[1], tableHeaderLeftFillColour[2]);
    pdf.Cell(46, 12, " " + rowLabels[row], 1, 0, 'L', fill);

    pdf.SetTextColor(textColour[0], textColour[1], textColour[2]);
    pdf.SetFillColor(tableRowFillColour[0], tableRowFillColour[1], tableRowFillColour[2]);
    pdf.SetFont('Arial', '', 15);

    for (let i = 0; i < count(columnLabels); i++) {
        pdf.Cell(36, 12, ('$' + dataRow[i].toFixed(2)), 1, 0, 'C', fill);
    }
    row++;
    fill = !fill;
    pdf.Ln(12);
});

let xScale = count(rowLabels) / (chartWidth - 40);
let maxTotal = 0;

data.forEach(dataRow => {

    let totalSales = 0;
    for (let i = 0; i < count(dataRow); i++) {
        totalSales += dataRow[i]
    }
    maxTotal = (totalSales > maxTotal) ? totalSales : maxTotal;

})

let yScale = maxTotal / chartHeight;

// Compute the bar width
let barWidth = (1 / xScale) / 1.5;

// Add the axes:

pdf.SetFont('Arial', '', 10);

// X axis
pdf.Line(chartXPos + 30, chartYPos, chartXPos + chartWidth, chartYPos);

for (let i = 0; i < count(rowLabels); i++) {
    pdf.SetXY(chartXPos + 40 + i / xScale, chartYPos);
    pdf.Cell(barWidth, 10, rowLabels[i], 0, 0, 'C');
}

// Y axis
pdf.Line(chartXPos + 30, chartYPos, chartXPos + 30, chartYPos - chartHeight - 8);

for (let i = 0; i <= maxTotal; i += chartYStep) {
    pdf.SetXY(chartXPos + 7, chartYPos - 5 - i / yScale);
    pdf.Cell(20, 10, '$' + i.toFixed(2), 0, 0, 'R');
    pdf.Line(chartXPos + 28, chartYPos - i / yScale, chartXPos + 30, chartYPos - i / yScale);
}

// Add the axis labels
pdf.SetFont('Arial', 'B', 12);
pdf.SetXY(chartWidth / 2 + 20, chartYPos + 8);
pdf.Cell(30, 10, chartXLabel, 0, 0, 'C');
pdf.SetXY(chartXPos + 7, chartYPos - chartHeight - 12);
pdf.Cell(20, 10, chartYLabel, 0, 0, 'R');

// Create the bars
let xPos = chartXPos + 40;
let bar = 0;

data.forEach(dataRow => {

    // Total up the sales figures for this product
    let totalSales = 0;
    for (let i = 0; i < count(dataRow); i++) {
        totalSales += dataRow[i]
    }
    // Create the bar
    let colourIndex = bar % count(chartColours);
    pdf.SetFillColor(chartColours[colourIndex][0], chartColours[colourIndex][1], chartColours[colourIndex][2]);
    pdf.Rect(xPos, chartYPos - (totalSales / yScale), barWidth, totalSales / yScale, 'DF');
    xPos += (1 / xScale);
    bar++;

})

pdf.Output('F', `${__dirname}/testReport.pdf`)
