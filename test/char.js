const FPDF = require('../index')
let cPdfName=`${__dirname}/char.pdf`

const data = {
    'Group 1' : {
        '08-02' : 2.7,
        '08-23' : 3.0,
        '09-13' : 3.3928571,
        '10-04' : 3.2903226,
        '10-25' : 3.1,
        '10-26' : 3.5,
        '10-27' : 2,
        '10-28' : 2.5,
        '10-29' : 4,
    },
    'Group 2' : {
        '08-02' : 2.5,
        '08-23' : 2.0,
        '09-13' : 3.1785714,
        '10-04' : 2.9677419,
        '10-26' : 3.33333,
        '10-27' : 3.33333,
        '10-28' : 3.33333,
        '10-29' : 3.33333,
    }
}
const colors = {
    'Group 1' : [114,171,237],
    'Group 2' : [163,36,153]
}

const pdf = new FPDF();
pdf.SetFont('Arial','',10);
pdf.AddPage();
// Display options: all (horizontal and vertical lines, 4 bounding boxes)
// Colors: fixed
// Max ordinate: 6
// Number of divisions: 3
pdf.LineGraph(190,100,data,'VH',colors,6,3);
/*VHkBvBgBdB
pdf.AddPage();
// Display options: horizontal lines, bounding box around the abscissa values
// Colors: random
// Max ordinate: auto
// Number of divisions: default
pdf.LineGraph(190,100,data,'HvB');

pdf.AddPage();
// Display options: vertical lines, bounding box around the legend
// Colors: random
// Max ordinate: auto
// Number of divisions: default
pdf.LineGraph(190,100,data,'VkB');

pdf.AddPage();
// Display options: horizontal lines, bounding boxes around the plotting area and the entire area
// Colors: random
// Max ordinate: 20
// Number of divisions: 10
pdf.LineGraph(190,100,data,'HgBdB',null,20,10);
*/
pdf.Output('f',cPdfName)