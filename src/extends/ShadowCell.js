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