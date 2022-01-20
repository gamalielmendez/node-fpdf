/*

Informations
Author: Anthony Master
License: FPDF
Description
This script allows to create line-based charts. The method to use is the following:

LineGraph(float w, float h, array data [, string options [, array colors [, int maxVal [, int nbDiv]]]])

w: graph width
h: graph height
data: multidimensional array containing series of data
options: string containing display options
colors: multidimensional array containing line colors; if null or not given, some random colors are used
maxVal: maximum ordinate; if 0 or not given, it is automatically computed
nbDiv: number of vertical divisions (default value: 4)
*/

    /*******************************************
    Explain the variables:
    $w = the width of the diagram
    $h = the height of the diagram
    $data = the data for the diagram in the form of a multidimensional array
    $options = the possible formatting options which include:
        'V' = Print Vertical Divider lines
        'H' = Print Horizontal Divider Lines
        'kB' = Print bounding box around the Key (legend)
        'vB' = Print bounding box around the values under the graph
        'gB' = Print bounding box around the graph
        'dB' = Print bounding box around the entire diagram
    $colors = A multidimensional array containing RGB values
    $maxVal = The Maximum Value for the graph vertically
    $nbDiv = The number of vertical Divisions
*******************************************/

const {sprintf,isset,max,ceil,count,strstr,array_rand} = require('../PHP_CoreFunctions')

function LineGraph(Parent,w, h, data, options='', colors=null, maxVal=0, nbDiv=4){

    Parent.SetDrawColor(0,0,0);
    Parent.SetLineWidth(0.2);

    const keys = Object.keys(data);
    const ordinateWidth = 10;
    w -= ordinateWidth;
    const valX = Parent.GetX()+ordinateWidth;
    const valY = Parent.GetY();
    const margin = 1;
    const titleH = 8;
    const titleW = w;
    const lineh = 5;
    const keyH = count(data)*lineh;
    const keyW = w/5;
    const graphValH = 5;
    const graphValW = w-keyW-3*margin;
    const graphH = h-(3*margin)-graphValH;
    const graphW = w-(2*margin)-(keyW+margin);
    const graphX = valX+margin;
    const graphY = valY+margin;
    const graphValX = valX+margin;
    const graphValY = valY+2*margin+graphH;
    const keyX = valX+(2*margin)+graphW;
    const keyY = valY+margin+.5*(h-(2*margin))-.5*(keyH);
    //draw graph frame border
    if(strstr(options,'gB')){
        Parent.Rect(valX,valY,w,h);
    }
    //draw graph diagram border
    if(strstr(options,'dB')){
        Parent.Rect(valX+margin,valY+margin,graphW,graphH);
    }
    //draw key legend border
    if(strstr(options,'kB')){
        Parent.Rect(keyX,keyY,keyW,keyH);
    }
    //draw graph value box
    if(strstr(options,'vB')){
        Parent.Rect(graphValX,graphValY,graphValW,graphValH);
    }
    //define colors
    if(colors===null){
        const safeColors = [0,51,102,153,204,225];
        colors={}
        for(let i=0;i<count(data);i++){
            colors[keys[i]] = [safeColors[array_rand(safeColors)],safeColors[array_rand(safeColors)],safeColors[array_rand(safeColors)]];
        }
    }
    //form an array with all data values from the multi-demensional $data array
    const ValArray = [];
    for (const key in data) {
        const value = data[key];
        for (const key2 in value) {
            const val = value[key2];
            ValArray.push(val)
        }

    }

    //define max value
    if(maxVal<ceil(max(ValArray))){
        maxVal = ceil(max(ValArray));
    }
    //draw horizontal lines
    const vertDivH = graphH/nbDiv;
    if(strstr(options,'H')){
        for(let i=0;i<=nbDiv;i++){
            if(i<nbDiv){
                Parent.Line(graphX,graphY+i*vertDivH,graphX+graphW,graphY+i*vertDivH);
            } else{
                Parent.Line(graphX,graphY+graphH,graphX+graphW,graphY+graphH);
            }
        }
    }

    //draw vertical lines
    const horiDivW = Math.floor(graphW/(count(data[keys[0]])-1));
    if(strstr(options,'V')){
        for(let i=0;i<=(count(data[keys[0]])-1);i++){
            if(i<(count(data[keys[0]])-1)){
                Parent.Line(graphX+i*horiDivW,graphY,graphX+i*horiDivW,graphY+graphH);
            } else {
                Parent.Line(graphX+graphW,graphY,graphX+graphW,graphY+graphH);
            }
        }
    }

    //draw graph lines
    let n=undefined
    let valueKeys
    Object.keys(data).forEach(key => {
        const value=data[key]
        Parent.SetDrawColor(colors[key][0],colors[key][1],colors[key][2]);
        Parent.SetLineWidth(0.5);
        valueKeys = Object.keys(value);
        for(let i=0;i<count(value);i++){
            
            if(i==count(value)-2){
                Parent.Line(
                    graphX+(i*horiDivW),
                    graphY+graphH-(value[valueKeys[i]]/maxVal*graphH),
                    graphX+graphW,
                    graphY+graphH-(value[valueKeys[i+1]]/maxVal*graphH)
                );
            } else if(i<(count(value)-1)) {
                Parent.Line(
                    graphX+(i*horiDivW),
                    graphY+graphH-(value[valueKeys[i]]/maxVal*graphH),
                    graphX+(i+1)*horiDivW,
                    graphY+graphH-(value[valueKeys[i+1]]/maxVal*graphH)
                );
            }
        }
  
        Parent.SetFont('Courier','',10);
        if(!isset(n)){n=0}

        Parent.Line(keyX+1,keyY+lineh/2+n*lineh,keyX+8,keyY+lineh/2+n*lineh);
        Parent.SetXY(keyX+8,keyY+n*lineh);
        Parent.Cell(keyW,lineh,key,0,1,'L');
        n++;
    })

    //print the abscissa values
    for (let key = 0; key < valueKeys.length; key++) {
        const value=valueKeys[key]
        if(key===0){
            Parent.SetXY(graphValX,graphValY);
            Parent.Cell(30,lineh,value,0,0,'L');
        } else if(key==count(valueKeys)-1){
            Parent.SetXY(graphValX+graphValW-30,graphValY);
            Parent.Cell(30,lineh,value,0,0,'R');
        } else {
            Parent.SetXY(graphValX+key*horiDivW-15,graphValY);
            Parent.Cell(30,lineh,value,0,0,'C');
        }
    }

    //print the ordinate values
    for(let i=0;i<=nbDiv;i++){
        Parent.SetXY(graphValX-10,graphY+(nbDiv-i)*vertDivH-3);
        Parent.Cell(8,6,sprintf('%.1f',maxVal/nbDiv*i),0,0,'R');
    }
    Parent.SetDrawColor(0,0,0);
    Parent.SetLineWidth(0.2);
}

module.exports=LineGraph