
/*******************************************************************************
* Script :  PDF_Code128
* Version : 1.2
* Date :    2016-01-31
* Auteur :  Roland Gautier
*
* Version   Date        Detail
* 1.2       2016-01-31  Compatibility with FPDF 1.8
* 1.1       2015-04-10  128 control characters FNC1 to FNC4 accepted
* 1.0       2008-05-20  First release
*
* Code128($x, $y, $code, $w, $h)
*     $x,$y :     angle supérieur gauche du code à barre
*                 upper left corner of the barcode
*     $code :     le code à créer
*                 ascii text to convert to barcode
*     $w :        largeur hors tout du code dans l'unité courante
*                 (prévoir 5 à 15 mm de blanc à droite et à gauche)
*                 barcode total width (current unit)
*                 (keep 5 to 15 mm white on left and right sides)
*     $h :        hauteur hors tout du code dans l'unité courante
*                 barcode total height (current unit)
*
* Commutation des jeux ABC automatique et optimisée
* Automatic and optimized A/B/C sets selection and switching
*
*
*   128 barcode control characters
*   ASCII   Aset            Bset        [ne pas utiliser][do not use]
*   ---------------------------
*   200     FNC3            FNC3
*   201     FNC2            FNC2
*   202     ShiftA          ShiftB
*   203     [SwitchToCset]  [SwitchToCset]
*   204     [SwitchToBset]  FNC4
*   205     FNC4            [SwitchToAset]
*   206     FNC1            FNC1
*******************************************************************************/

const {chr,strlen,substr,strpos,ord,count,strtr} = require('../PHP_CoreFunctions')

const JStart = {"A":103, "B":104, "C":105}; // Caractères de sélection de jeu au début du C128
const JSwap = {"A":101, "B":100, "C":99}; 
let Cset="0123456789"+chr(206);

const T128= [
[2, 1, 2, 2, 2, 2],//0 : [ ]    // composition des caractères
[2, 2, 2, 1, 2, 2],//1 : [!]
[2, 2, 2, 2, 2, 1],//2 : ["]
[1, 2, 1, 2, 2, 3],//3 : [#]
[1, 2, 1, 3, 2, 2],//4 : [$]
[1, 3, 1, 2, 2, 2],//5 : [%]
[1, 2, 2, 2, 1, 3],//6 : [&]
[1, 2, 2, 3, 1, 2],//7 : [']
[1, 3, 2, 2, 1, 2],//8 : [(]
[2, 2, 1, 2, 1, 3],//9 : [)]
[2, 2, 1, 3, 1, 2],//10 : [*]
[2, 3, 1, 2, 1, 2],//11 : [+]
[1, 1, 2, 2, 3, 2],//12 : [,]
[1, 2, 2, 1, 3, 2],//13 : [-]
[1, 2, 2, 2, 3, 1],//14 : [.]
[1, 1, 3, 2, 2, 2],//15 : [/]
[1, 2, 3, 1, 2, 2],//16 : [0]
[1, 2, 3, 2, 2, 1],//17 : [1]
[2, 2, 3, 2, 1, 1],//18 : [2]
[2, 2, 1, 1, 3, 2],//19 : [3]
[2, 2, 1, 2, 3, 1],//20 : [4]
[2, 1, 3, 2, 1, 2],//21 : [5]
[2, 2, 3, 1, 1, 2],//22 : [6]
[3, 1, 2, 1, 3, 1],//23 : [7]
[3, 1, 1, 2, 2, 2],//24 : [8]
[3, 2, 1, 1, 2, 2],//25 : [9]
[3, 2, 1, 2, 2, 1],//26 : [:]
[3, 1, 2, 2, 1, 2],//27 : [;]
[3, 2, 2, 1, 1, 2],//28 : [<]
[3, 2, 2, 2, 1, 1],//29 : [=]
[2, 1, 2, 1, 2, 3],//30 : [>]
[2, 1, 2, 3, 2, 1],//31 : [?]
[2, 3, 2, 1, 2, 1],//32 : [@]
[1, 1, 1, 3, 2, 3],//33 : [A]
[1, 3, 1, 1, 2, 3],//34 : [B]
[1, 3, 1, 3, 2, 1],//35 : [C]
[1, 1, 2, 3, 1, 3],//36 : [D]
[1, 3, 2, 1, 1, 3],//37 : [E]
[1, 3, 2, 3, 1, 1],//38 : [F]
[2, 1, 1, 3, 1, 3],//39 : [G]
[2, 3, 1, 1, 1, 3],//40 : [H]
[2, 3, 1, 3, 1, 1],//41 : [I]
[1, 1, 2, 1, 3, 3],//42 : [J]
[1, 1, 2, 3, 3, 1],//43 : [K]
[1, 3, 2, 1, 3, 1],//44 : [L]
[1, 1, 3, 1, 2, 3],//45 : [M]
[1, 1, 3, 3, 2, 1],//46 : [N]
[1, 3, 3, 1, 2, 1],//47 : [O]
[3, 1, 3, 1, 2, 1],//48 : [P]
[2, 1, 1, 3, 3, 1],//49 : [Q]
[2, 3, 1, 1, 3, 1],//50 : [R]
[2, 1, 3, 1, 1, 3],//51 : [S]
[2, 1, 3, 3, 1, 1],//52 : [T]
[2, 1, 3, 1, 3, 1],//53 : [U]
[3, 1, 1, 1, 2, 3],//54 : [V]
[3, 1, 1, 3, 2, 1],//55 : [W]
[3, 3, 1, 1, 2, 1],//56 : [X]
[3, 1, 2, 1, 1, 3],//57 : [Y]
[3, 1, 2, 3, 1, 1],//58 : [Z]
[3, 3, 2, 1, 1, 1],//59 : [[]
[3, 1, 4, 1, 1, 1],//60 : [\]
[2, 2, 1, 4, 1, 1],//61 : []]
[4, 3, 1, 1, 1, 1],//62 : [^]
[1, 1, 1, 2, 2, 4],//63 : [_]
[1, 1, 1, 4, 2, 2],//64 : [`]
[1, 2, 1, 1, 2, 4],//65 : [a]
[1, 2, 1, 4, 2, 1],//66 : [b]
[1, 4, 1, 1, 2, 2],//67 : [c]
[1, 4, 1, 2, 2, 1],//68 : [d]
[1, 1, 2, 2, 1, 4],//69 : [e]
[1, 1, 2, 4, 1, 2],//70 : [f]
[1, 2, 2, 1, 1, 4],//71 : [g]
[1, 2, 2, 4, 1, 1],//72 : [h]
[1, 4, 2, 1, 1, 2],//73 : [i]
[1, 4, 2, 2, 1, 1],//74 : [j]
[2, 4, 1, 2, 1, 1],//75 : [k]
[2, 2, 1, 1, 1, 4],//76 : [l]
[4, 1, 3, 1, 1, 1],//77 : [m]
[2, 4, 1, 1, 1, 2],//78 : [n]
[1, 3, 4, 1, 1, 1],//79 : [o]
[1, 1, 1, 2, 4, 2],//80 : [p]
[1, 2, 1, 1, 4, 2],//81 : [q]
[1, 2, 1, 2, 4, 1],//82 : [r]
[1, 1, 4, 2, 1, 2],//83 : [s]
[1, 2, 4, 1, 1, 2],//84 : [t]
[1, 2, 4, 2, 1, 1],//85 : [u]
[4, 1, 1, 2, 1, 2],//86 : [v]
[4, 2, 1, 1, 1, 2],//87 : [w]
[4, 2, 1, 2, 1, 1],//88 : [x]
[2, 1, 2, 1, 4, 1],//89 : [y]
[2, 1, 4, 1, 2, 1],//90 : [z]
[4, 1, 2, 1, 2, 1],//91 : [{]
[1, 1, 1, 1, 4, 3],//92 : [|]
[1, 1, 1, 3, 4, 1],//93 : [}]
[1, 3, 1, 1, 4, 1],//94 : [~]
[1, 1, 4, 1, 1, 3],//95 : [DEL]
[1, 1, 4, 3, 1, 1],//96 : [FNC3]
[4, 1, 1, 1, 1, 3],//97 : [FNC2]
[4, 1, 1, 3, 1, 1],//98 : [SHIFT]
[1, 1, 3, 1, 4, 1],//99 : [Cswap]
[1, 1, 4, 1, 3, 1],//100 : [Bswap]                
[3, 1, 1, 1, 4, 1],//101 : [Aswap]
[4, 1, 1, 1, 3, 1],//102 : [FNC1]
[2, 1, 1, 4, 1, 2],//103 : [Astart]
[2, 1, 1, 2, 1, 4],//104 : [Bstart]
[2, 1, 1, 2, 3, 2],//105 : [Cstart]
[2, 3, 3, 1, 1, 1],//106 : [STOP]
[2, 1]]            //107 : [END BAR]

let ABCset=""
for (let i = 32; i <= 95; i++) {// jeux de caractères
    ABCset += chr(i);
}

let Aset = ABCset;
let Bset = ABCset;

for (let i = 0; i <= 31; i++) {
    ABCset += chr(i);
    Aset += chr(i);
    
}
for (let i = 96; i <= 127; i++) {
    ABCset += chr(i);
    Bset += chr(i);
}

for (let i = 200; i <= 210; i++) {                                           // controle 128
    ABCset += chr(i);
    Aset += chr(i);
    Bset += chr(i);
   
}

const SetFrom={A:'',B:''}
const SetTo={A:'',B:''}

for (let i=0; i<96;i++) {                                                   // convertisseurs des jeux A & B
    SetFrom["A"] += chr(i);
    SetFrom["B"] += chr(i + 32);
    SetTo["A"] += chr((i < 32) ? i+64 : i-32);
    SetTo["B"] += chr(i);
}

for (let i=96; i<107; i++) {                                                 // contrôle des jeux A & B
    SetFrom["A"] += chr(i + 104);
    SetFrom["B"] += chr(i + 104);
    SetTo["A"] += chr(i);
    SetTo["B"] += chr(i);
}

//________________ Fonction encodage et dessin du code 128 _____________________
function Code128(parent,x, y, code, w, h) {
    
    let Aguid = "";                                                                      // Création des guides de choix ABC
    let Bguid = "";
    let Cguid = "";

    for (let i=0; i < strlen(code); i++) {
        let needle = substr(code,i,1);
        Aguid += ((strpos(Aset,needle)===-1) ? "N" : "O"); 
        Bguid += ((strpos(Bset,needle)===-1) ? "N" : "O"); 
        Cguid += ((strpos(Cset,needle)===-1) ? "N" : "O");
        
    }

    const SminiC = "OOOO";
    const IminiC = 4;
    
    let crypt = "";
    while (code.length>0) {
                                                                                   // BOUCLE PRINCIPALE DE CODAGE
        let pos = strpos(Cguid,SminiC);                                            // forçage du jeu C, si possible
        if (pos!==-1) {
            Aguid[pos] = "N";
            Bguid[pos] = "N";
        }

        let made=0
        let jeu
        if (substr(Cguid,0,IminiC) === SminiC) {                    // jeu C --> conjunto C
            
            crypt += chr((crypt.length>0) ? JSwap["C"] : JStart["C"]);  // début Cstart, sinon Cswap
            made = strpos(Cguid,"N");                               // étendu du set C
            if (made === -1) {
                made = strlen(Cguid);
            }

            if ((made%2)==1) {
                made--;                                                            // seulement un nombre pair
            }

            for (let i=0; i < made; i += 2) {
                crypt += chr(parseInt(substr(code,i,2),10));                          // conversion 2 par 2
            }

            jeu = "C";

        } else {
           
            let madeA = strpos(Aguid,"N");// étendu du set A
            if (madeA === -1) {
                madeA = strlen(Aguid);
            }
            
            let madeB = strpos(Bguid,"N");// étendu du set B
            if (madeB === -1) {
                madeB = strlen(Bguid);
            }

            made = ((madeA < madeB) ? madeB : madeA );                         // étendu traitée
            jeu = ((madeA < madeB) ? "B" : "A" );                                // Jeu en cours
            crypt += chr((crypt > "") ? JSwap[jeu] : JStart[jeu]); // début start, sinon swap
            crypt += strtr(substr(code, 0,made),SetFrom[jeu], SetTo[jeu]); // conversion selon jeu
            
            //break
        }
    
        code = substr(code,made);                                          // raccourcir légende et guides de la zone traitée
        Aguid = substr(Aguid,made);
        Bguid = substr(Bguid,made);
        Cguid = substr(Cguid,made);
    }                                                                          // FIN BOUCLE PRINCIPALE

    let check = ord(crypt[0]);                                                   // calcul de la somme de contrôle
    for (let i=0; i<strlen(crypt); i++) {
        check += (ord(crypt[i]) * i);
    }

    check %= 103;

    crypt += chr(check) + chr(106) + chr(107);                               // Chaine cryptée complète

    let i = (strlen(crypt) * 11) - 8;                                            // calcul de la largeur du module
    let modul = w/i;
    for (let b=0; b<strlen(crypt); b++) {                                      // BOUCLE D'IMPRESSION
        
    
        let c = T128[ord(crypt[b])];
        for (let j=0; j<count(c); j++) {

            parent.Rect(x,y,c[j]*modul,h,"F");
            x += (c[j++]+c[j])*modul;

        }
    }
}

module.exports = Code128