/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var colors = ['yellow', 'green', 'blue', 'pink', 'cyan', 'magenta'];

function getRandomHexDigit() {
//    var hex = "0123456789abcdef";
    var hex = "89abcdef";
    return hex.charAt(Math.floor(hex.length*Math.random()));
}

function colorPoly(poly, color, alpha, noApplyColor, noApplyAlpha) {
    if (!noApplyAlpha) {
        if (alpha || alpha === 0) {
            poly.alpha = alpha;
        }
    }
    if (!noApplyColor) {
        if (color && color !== "") {
            poly.color = color;
        } else {
            var r = getRandomHexDigit();
            var g = getRandomHexDigit();
            var b = getRandomHexDigit();
            color = '#' + r + g + b;
            poly.color = color;
        }
    }
}

function colorPolys(polys, color, alpha, noApplyColor, noApplyAlpha) {
    for (var i=0; i<polys.length; i++) {
        colorPoly(polys[i], color, alpha, noApplyColor, noApplyAlpha);
    }
}
