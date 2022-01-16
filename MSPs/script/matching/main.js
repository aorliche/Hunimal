/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// DOM
var canvas;
var flipsSpan;
var goalSpan;
var difficultyInput;
var errorP;
var solvedMessageDiv;

// msps[0] is the target msp
// msps[1] is the flipping msp
var msps; 
var center0, center1;
var width, height;
var undoArr;
var selectedVertex; // to fix reference error
var solved;

var maxExpandIter = 10000;

function returnToCenter(msp, center, width, height) {
    // find bounding box of the msp
    var lx = Number.POSITIVE_INFINITY;
    var ly = Number.POSITIVE_INFINITY;
    var gx = Number.NEGATIVE_INFINITY;
    var gy = Number.NEGATIVE_INFINITY;
    
    var rect = msp.rect;
    if (rect.x < lx) {
        lx = rect.x;
    }
    if (rect.x+rect.w > gx) {
        gx = rect.x+rect.w;
    }
    if (rect.y < ly) {
        ly = rect.y;
    }
    if (rect.y+rect.h > gy) {
        gy = rect.y+rect.h;
    }
    
    // get center
    var cx = (lx+gx)/2;
    var cy = (ly+gy)/2;
    
    // translation
    var dx = center.x - cx;
    var dy = center.y - cy;
    
    // zoom
    var w = gx-lx;
    var h = gy-ly;
    var scale = w > h ? width/w : height/h;
    
    // zoom and translate the msp
    translateMSP(msp, dx, dy);
    zoomMSP(msp, scale, center);
    
    repaint();
}

// be careful with adding event listeners several times
// only add the event listener in the initial load
function matching_load() {
    canvas = document.getElementById("canvas");
    
    flipsSpan = document.getElementById("flips-span");
    goalSpan = document.getElementById("goal-span");
    difficultyInput = document.getElementById("difficulty-input");
    errorP = document.getElementById("error-p");
    solvedMessageDiv = document.getElementById("solved-message-div");
    
    center0 = new Vertex(canvas.width/4, canvas.height/2);
    center1 = new Vertex(3*canvas.width/4, canvas.height/2);
    
    width = (canvas.width-80)/2;
    height = (canvas.height-80);
    
    canvas.addEventListener("click", function(e) {
        var v = convertToElementCoords(e);
        canvasClick(v);
    });
    
    mField = document.createElement('input');
    mField.type = 'text';
    mField.value = 3;
    
    flipsField = document.createElement('input');
    flipsField.type = 'text';
    flipsField.value = 100;
    
    // side length doesn't matter because msps are scaled
    sideLengthField = document.createElement('input');
    sideLengthField.type = 'text';
    sideLengthField.value = 20;
    
    matching_reload();
}

function matching_reload() {
    let dif = parseInt(difficultyInput.value);
    if (dif < 1 || dif > 10) {
        errorP.style.display = "block";
        errorP.innerText = "Difficulty must be between 1 and 10";
        return;
    } else {
        errorP.style.display = "none";
    }
    
    solved = false;
    solvedMessageDiv.style.display = "none";
    
    mField.value = dif+2;
    
    // do enough flips for the difficulty level
    let lowFlips = [1, 1, 3, 5, 10, 10, 10, 10, 10, 10];
    let highFlips = [1, 3, 5, 10, 20, 30, 30, 30, 30, 30];
    let difIdx = dif-1;
    let flips = lowFlips[difIdx]+
            Math.floor(
            Math.random()*(highFlips[difIdx]-lowFlips[difIdx]+1));
    
    flipsSpan.innerText = 0;
    goalSpan.innerText = flips;
    
    msps = [];
    undoArr = []
    
    buildRandomMSP();
    //buildRandomMSP(false, false, true);
    //colorRhombi(msps[0].rhombi, 'white', 1.0, true);
    //doRandomFlips();
    colorRhombi(msps[0].rhombi);
    returnToCenter(msps[0], center0, width, height);
    
    msps[1] = copyMSP(msps[0]);
    flipsField.value = flips;
    doRandomFlips();
    returnToCenter(msps[1], center1, width, height);
    
    repaint();
}

function flipInArray(flips, flip) {
    for (let i=0; i<flips.length; i++) {
        if (equivFlips(flip, flips[i])) {
            return true;
        }
    }
    return false;
}

// random flip, checking for duplication
function doRandomFlips() {
    let flipLog = [];
    nFlips = parseInt(flipsField.value);
    assert(nFlips > 0, "doRandomFlips 1");
    assert(selectedMSP, "doRandomFlips 2");
    for (var i=0; i<nFlips; i++) {
        let flips = findAllPossibleFlips(selectedMSP.rhombi, selectedMSP.chains);
        while (true) {
            let flipIdx = Math.floor(Math.random()*flips.length);
            let flip = flips[flipIdx];
            if (flipInArray(flipLog, flip)) {
                flips.splice(flipIdx, 1);
                if (flips.length === 0) {
                    setText(errorP, "Ran out of flips on flip " + i + "!");
                    return;
                }
                continue;
            }
            doFlip(flip, selectedMSP.chains);
            flipLog.push(flip);
            break;
        }
    }
}

function getRandomHexDigit() {
//    var hex = "0123456789abcdef";
    var hex = "89abcdef";
    return hex.charAt(Math.floor(hex.length*Math.random()));
}

function colorRhombi(rhombi, color, alpha, applyColor, applyAlpha) {
    var useColor = false;
    if (color && color !== "") {
        useColor = true;
    }
    for (var i=0; i<rhombi.length; i++) {
        if (!useColor) {
            var r = getRandomHexDigit();
            var g = getRandomHexDigit();
            var b = getRandomHexDigit();
            color = '#' + r + g + b;
            rhombi[i].color = color;
        }
        if (applyColor) {
            rhombi[i].color = color;
        }
        if (applyAlpha) {
            rhombi[i].alpha = alpha;
        }
    }
}

function drawRhombus(ctx, r) {
    if (r.selectedForFlip) {
        ctx.fillStyle = 'blue';
    } else {
        ctx.fillStyle = r.color;
    }
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(r.vs[0].x, r.vs[0].y);
    for (var i=1; i<r.vs.length; i++) {
        ctx.lineTo(r.vs[i].x, r.vs[i].y);
    }
    ctx.closePath();
    if (!r.selectedForColoring && !r.selectedForFlip && r.alpha) {
        ctx.globalAlpha = r.alpha;
    }
    ctx.fill();
    ctx.globalAlpha = 1.0;
    ctx.stroke();
    ctx.fillStyle = "#000";
    ctx.fillText(r.idx, r.center.x-5, r.center.y+5);
}

function drawMSP(ctx, msp) {
    for (var i=0; i<msp.polys.length; i++) {
        drawRhombus(ctx, msp.polys[i]);
    }
}

function repaint() {
    var ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (var i=0; i<msps.length; i++) {
        drawMSP(ctx, msps[i]);
    }
}

function repaintRhombus(r) {
    var ctx = canvas.getContext('2d');
    drawRhombus(ctx, r);
}

function canvasClick(v) {
    if (solved) {
        return;
    }
    var r = getRhombusAtCoords(msps[1].rhombi, v);
    if (!r) {
        return;
    }
    r.selectedForFlip = !r.selectedForFlip;
    if (r.selectedForFlip) {
        tryFlip(msps[1], r);
    }
    repaint();
}

function tryFlip(msp, r) {
    var flips = findPossibleFlips(r, msp.chains);
    for (var i=0; i<flips.length; i++) {
        var tri = flips[i];
        if (tri[0].selectedForFlip === true 
                && tri[1].selectedForFlip === true 
                && tri[2].selectedForFlip === true) {
                    
            doFlip(flips[i], msp.chains);
            msp.needDiag = true;
            tri[0].selectedForFlip = false;
            tri[1].selectedForFlip = false;
            tri[2].selectedForFlip = false;
            
            undoArr.push(tri);
            
            let curFlips = parseInt(flipsSpan.innerText);
            flipsSpan.innerText = curFlips+1;
            
            checkSolution();
            
            break;
        }
    }
}

function equivChains(c1, c2) {
    if (c1.length !== c2.length) {
        return false;
    }
    for (let i=0; i<c1.length; i++) {
        if (c1[i].length !== c2[i].length) {
            return false;
        }
        for (let j=0; j<c1[i].length; j++) {
            if (c1[i][j].idx !== c2[i][j].idx) {
                return false;
            }
        }
    }
    return true;
}

function checkSolution() {
    solved = equivChains(msps[0].chains, msps[1].chains);
    if (solved) {
        solvedMessageDiv.style.display = "block";
    }
}

function matching_undo() {
    if (solved) {
        return;
    }
    if (undoArr.length === 0) {
        return;
    }
    
    let tri = undoArr.pop();
    doFlip(tri, msps[1].chains);
    
    let curFlips = parseInt(flipsSpan.innerText);
    flipsSpan.innerText = curFlips-1;
    
    repaint();
}