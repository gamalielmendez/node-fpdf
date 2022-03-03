const { isset } = require('../PHP_CoreFunctions')

function _Set_Format(parent, format) {

    parent._Margin_Left = _Convert_Metric(parent, format['marginLeft'], format['metric']);
    parent._Margin_Top = _Convert_Metric(parent, format['marginTop'], format['metric']);
    parent._X_Space = _Convert_Metric(parent, format['SpaceX'], format['metric']);
    parent._Y_Space = _Convert_Metric(parent, format['SpaceY'], format['metric']);
    parent._X_Number = format['NX'];
    parent._Y_Number = format['NY'];
    parent._Width = _Convert_Metric(parent, format['width'], format['metric']);
    parent._Height = _Convert_Metric(parent, format['height'], format['metric']);
    _Set_Font_Size_Label(parent,format['font-size']);
    parent._Padding = _Convert_Metric(parent, 3, 'mm');

}

// convert units (in to mm, mm to in)
// $src must be 'in' or 'mm'
function _Convert_Metric(parent, value, src) {

    let dest = parent._Metric_Doc;

    if (src !== dest) {
        let a = { 'in': 39.37008, 'mm': 1000 }
        return value * a[dest] / a[src];
    } else {
        return value;
    }

}

// Give the line height for a given font size
function _Get_Height_Chars(parent, pt) {

    let a = { 6: 2, 7: 2.5, 8: 3, 9: 4, 10: 5, 11: 6, 12: 7, 13: 8, 14: 9, 15: 10 }
    if (!isset(a[pt])) {
        parent.Error('Invalid font size: '.pt);
    }

    return _Convert_Metric(parent, a[pt], 'mm');
}

// Set the character size
// This changes the line height too
function _Set_Font_Size_Label(parent, pt) {
    parent._Line_Height = _Get_Height_Chars(parent, pt);
    parent.SetFontSize(pt);
}

// Print a label
function _Add_Label(parent, text) {
    
    parent._COUNTX++;
    if (parent._COUNTX == parent._X_Number) {
        // Row full, we start a new one
        parent._COUNTX = 0;
        parent._COUNTY++;
        if (parent._COUNTY === parent._Y_Number) {
            // End of page reached, we start a new one
            parent._COUNTY = 0;
            parent.AddPage();
        }
    }

    let _PosX = parent._Margin_Left + parent._COUNTX * (parent._Width + parent._X_Space) + parent._Padding;
    let _PosY = parent._Margin_Top + parent._COUNTY * (parent._Height + parent._Y_Space) + parent._Padding;
    parent.SetXY(_PosX, _PosY);
    parent.MultiCell(parent._Width - parent._Padding, parent._Line_Height, text, 0, 'L');

}

module.exports={
    _Set_Font_Size_Label,
    _Add_Label,
    _Set_Format  
}