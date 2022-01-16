/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var nextPosition;
var keyboardM = 20;
var nextPostionStartX;

var holdingNumber;
var emittedHun;

// shim for word search
let doneWithLetter = null;

function keyDown(e) {
    if (e.keyCode >= 48 && e.keyCode <= 57) {
        holdingNumber = e.keyCode;
        emittedHun = false;
    } else if (e.keyCode >= 96 && e.keyCode <= 105) {
        if (holdingNumber) {
            doKeyPress(e, true);
            emittedHun = true;
        }
    } else {
        doKeyPress(e);
    }
}

function keyUp(e) {
    if (e.keyCode >= 48 && e.keyCode <= 57) {
        if (!emittedHun) {
            doKeyPress(e);
        }
        holdingNumber = null;
    }
}

function doKeyPress(e, emitHun) {
    doneWithLetter = false;
    if (!nextPosition || selectedVertex) {
        if (selectedVertex) {
            nextPosition = copyVertex(selectedVertex);
        } else {
            nextPosition = new Vertex(0,0);
        }
        nextPositionStartX = nextPosition.x;
    }
    var spacingX = parseInt(keyboardSpacingXField.value);
    var spacingY = parseInt(keyboardSpacingYField.value);
    
    // load a stroke
    var strokePath = 'stroke/';
    
    if (emitHun) {
        var d1 = holdingNumber - 48;
        var d2 = e.keyCode - 96;
        strokePath += 'Hun/' + d1 + d2 + '.stk';
    } else if (e.keyCode >= 96 && e.keyCode <= 105) {
      strokePath += 'Decimal/' + e.key + '.stk';  
    } else if (e.keyCode >= 65 && e.keyCode <= 90) {
        if (e.key >= 'A' && e.key <= 'Z') {
            strokePath += 'Capital/' + e.key + '.stk';
        } else if (e.key >= 'a' && e.key <= 'z') {
            strokePath += 'Lowercase/' + e.key + '.stk';
        } 
    } else if (e.keyCode >= 48 && e.keyCode <= 57) {
        if (e.key >= '0' && e.key <= '9') {
            strokePath += 'Decimal/' + e.key + '.stk';
        } else {
            if (e.key === '#') {
                strokePath += 'Special/%23.stk';
            } else if (e.key === ')') {
                strokePath += 'Special/closeparenth.stk';
            } else if (e.key === '(') {
                strokePath += 'Special/openparenth.stk';
            } else if (e.key === '*') {
                strokePath += 'Special/star.stk';
            } else {
                strokePath += 'Special/' + e.key + '.stk';
            }
        }
    } else if (e.keyCode === 59) {
        if (e.key === ':') {
            strokePath += 'Special/colon.stk';
        } else {
            strokePath += 'Special/semicolon.stk';
        }
    } else if (e.keyCode === 61) {
        if (e.key === '=') {
            strokePath += 'Special/=.stk';
        } else {
            strokePath += 'Special/+.stk';
        }
    } else if (e.keyCode === 173) {
        if (e.key === '-') {
            strokePath += 'Special/-.stk';
        } else {
            strokePath += 'Special/_.stk';
        }
    } else if (e.keyCode === 188) {
        if (e.key === ',') {
            strokePath += 'Special/,.stk';
        } else {
            strokePath += 'Special/angleOpenBracket.stk';
        }
    } else if (e.keyCode === 190) {
        if (e.key === '.') {
            strokePath += 'Special/period.stk';
        } else {
            strokePath += 'Special/angleCloseBracket.stk';
        }
    } else if (e.keyCode === 191) {
        if (e.key === '/') {
            strokePath += 'Special/forward slash.stk';
        } else {
            strokePath += 'Special/questionmark.stk';
        }
    } else if (e.keyCode === 192) {
        if (e.key === '`') {
            strokePath += 'Special/`.stk';
        } else {
            strokePath += 'Special/~.stk';
        }
    } else if (e.keyCode === 219) {
        if (e.key === '[') {
            strokePath += 'Special/[.stk';
        } else {
            strokePath += 'Special/{.stk';
        }
    } else if (e.keyCode === 220) {
        if (e.key === '|') {
            strokePath += 'Special/pipe.stk';
        } else {
            strokePath += 'Special/backslash.stk';
        }
    } else if (e.keyCode === 221) {
        if (e.key === ']') {
            strokePath += 'Special/].stk';
        } else {
            strokePath += 'Special/}.stk';
        }
    } else if (e.keyCode === 222) {
        if (e.key === '\'') {
            strokePath += 'Special/singlequote.stk';
        } else {
            strokePath += "Special/doublequote.stk";
        }
    } else if (e.code === 'Enter') {
        nextPosition.y += spacingY;
        nextPosition.x = nextPositionStartX;
        return;
    } else if (e.code === 'Space') {
//        nextPosition.x += spacingX;
//        return;
        strokePath += 'Special/space.stk';
    } else if (e.code === 'Backspace' || e.code === 'Delete') {
        if (nextPosition.x > 0) {
            nextPosition.x -= spacingX;
            if (msps.length > 0) {
                var lastRect = msps[msps.length-1].rect;
                if (lastRect.x >= nextPosition.x) {
                    var msp = msps.pop();
                    if (msp === selectedMSP) {
                        selectedMSP = null;
                    }
                    repaint();
                }
            }
        } else if (nextPosition.y <= 0) {
            resetCanvas();
            return;
        } else { // backspace over enter
            var lastRect = msps[msps.length-1].rect;
            nextPosition.y -= spacingY;
            nextPosition.x = lastRect.x + spacingX;
        }
        return;
    } else { // unhandled key
        return;
    }
    
    var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open("GET", strokePath, true);
    req.onreadystatechange = function () {
        if (req.readyState === 4) {
            strokeParts = req.response;
            // scale stroke parts
            for (let i=0; i<strokeParts.length; i++) {
                for (let j=0; j<strokeParts[i].length; j++) {
                    strokeParts[i][j].x *= canvas.width/800;
                    strokeParts[i][j].y *= canvas.height/800;
                }
            }
            continueKeyPress();
        }
    };
    req.send();
}

function continueKeyPress() { 
    
    var size = parseInt(keyboardSizeField.value);
    var spacingX = parseInt(keyboardSpacingXField.value);
    
    var create = !selectedMSP;
    var saveRect;
    
    // create a new msp
    if (create) {
        selectedVertex = null;
        buildRandomMSP(keyboardM,10);
    } else {
        saveRect = copyRectangle(selectedMSP.rect);
    }
    
    // scale to full screen
    var scale = canvas.width/selectedMSP.rect.w;
    zoomMSP(selectedMSP, scale);
    
    // move to center
    if (!create) {
        var dx = canvas.width/2 - selectedMSP.center.x;
        var dy = canvas.height/2 - selectedMSP.center.y;
        translateMSP(selectedMSP, dx, dy);
    }
    
    // choose between rhombi, quads, and tris
//    if (keyboardRhombiRadio.checked) {
//        showRhombiNotDiagonalization();
//    } else if (keyboardQuadsRadio.checked) {
//        diagonalizeMSP();
//    } else {
//        triangularizeMSP();
//    }
    
    // invert and apply the stroke
    invertStroke();
    var rhombi = selectedMSP.polys;
    //if (!create) {
        if (fontColorCheckbox.checked) {
            let useAlpha = fontAlphaCheckbox.checked;
            let alpha = 1.0;
            if (useAlpha) {
                alpha = parseFloat(fontAlphaField.value);
            }
            colorRhombi(rhombi, fontColorField.value, alpha, true, useAlpha);
        } else {
            colorRhombi(rhombi);
        }
        //colorRhombi(rhombi, false, 1.0, false, true);;
    //}
    var rs = [];
    for (var i=0; i<rhombi.length; i++) {
        if (rhombi[i].selectedForColoring) {
            rs.push(rhombi[i]);
            rhombi[i].selectedForColoring = false;
        }
    }
    colorRhombi(rs, '#000', 0.0, false, true);
    
    // scale msp to size
    scale = size/selectedMSP.rect.w;
    zoomMSP(selectedMSP, scale);
    
    // translate msp to final position 
    if (create) {
        var dx = nextPosition.x - selectedMSP.rect.x;
        var dy = nextPosition.y - selectedMSP.rect.y;
        translateMSP(selectedMSP, dx, dy);
    } else {
        var dx = saveRect.x - selectedMSP.rect.x;
        var dy = saveRect.y - selectedMSP.rect.y;
        translateMSP(selectedMSP, dx, dy);
    }
    
    selectedMSP = null;
    
    repaint();
    if (create) {
        nextPosition.x += spacingX;
    }
    // shim-temporary
    doneWithLetter = true;
}

function resetCanvas() {
    msps = [];
    selectedMSP = null;
    nextPosition = null;
    repaint();
}