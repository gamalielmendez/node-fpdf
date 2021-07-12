/*
Shadow Cell
Informations
Author: Gledston Reis
License: FPDF
Description
This extension allows to add a shadow effect to the text contained in a cell. The ShadowCell() method has the same parameters as Cell(), plus the following ones:

color : color of the shadow. Can be either a string (G for grey, B for black) or an integer between 0 and 255 (greyscale value). Default value: G.

distance : distance between the shadow and the text. Default value: 0.5.
Source
*/

const ShadowCell = (Parent,w, h=0, txt='', border=0, ln=0, align='', fill=false, link='', color='G', distance=0.5) =>{
    let ShadowColor 
    if(color=='G'){
        ShadowColor = 100;
    }else if(color=='B'){
        ShadowColor = 0;
    }else{
        ShadowColor = color;
    }

    let TextColor = Parent.TextColor;
    let x = Parent.x;
    Parent.SetTextColor(ShadowColor);
    Parent.Cell(w, h, txt, border, 0, align, fill, link);
    Parent.TextColor = TextColor;
    Parent.x = x;
    Parent.y += distance;
    Parent.Cell(w, h, txt, 0, ln, align);

}

module.exports = ShadowCell