/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var canvas;
var easyRadio;
var mediumRadio;
var hardRadio;

var msps = [];
var selectedMSP;
var selectedVertex;
var selectedEmptyVertex;
var pinSelectChoices;

var maxExpandIter = 10000;

function displayCenter(msp) {
    drawVertices([msp.center]);
}

function returnToCenter() {
    // find bounding box of all the MSPs
    var lx = Number.POSITIVE_INFINITY;
    var ly = Number.POSITIVE_INFINITY;
    var gx = Number.NEGATIVE_INFINITY;
    var gy = Number.NEGATIVE_INFINITY;
    
    for (var i=0; i<msps.length; i++) {
        var rect = msps[i].rect;
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
    }
    // get center
    var cx = (lx+gx)/2;
    var cy = (ly+gy)/2;
    
    // translation
    var dx = canvas.width/2 - cx;
    var dy = canvas.height/2 - cy;
    
    // zoom
    var w = gx-lx;
    var h = gy-ly;
    var scale = w > h ? canvas.width/w : canvas.height/h;
    var center = new Vertex(canvas.width/2, canvas.height/2);
    
    // zoom and translate the MSPs
    for (var i=0; i<msps.length; i++) {
        translateMSP(msps[i], dx, dy);
        zoomMSP(msps[i], scale, center);
    }
    
    repaint();
}

// be careful with adding event listeners several times
// only add the event listener in the initial load
function jumpin_load() {
    canvas = document.getElementById("canvas");
    
    easyRadio = document.getElementById("easyRadio");
    mediumRadio = document.getElementById("mediumRadio");
    hardRadio = document.getElementById("hardRadio");
    
    center = new Vertex(canvas.width/2, canvas.height/2);
    
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
    
    sideLengthField = document.createElement('input');
    sideLengthField.type = 'text';
    sideLengthField.value = 20;
    
    jumpin_reload();
}

function jumpin_reload() {
    if (easyRadio.checked) {
        mField.value = 3;
    } else if (mediumRadio.checked) {
        mField.value = 5;
    } else {
        mField.value = 7;
    }
    
    vs = []; // needed here because of repaint in buildRandomMSP();
    msps = [];
    buildRandomMSP();
    //buildRandomMSP(false, false, true);
    colorRhombi(msps[0].rhombi, 'white', 1.0, true);
    doRandomFlips();
    returnToCenter();
    getUniqueVertices();
    // generate initial empty pin
    vs[Math.floor(Math.random()*vs.length)].empty = true;
    repaint();
    
    loadedOnce = true;
}

// each "vertex" is a "vertex, array of rhombi containing vertex" object
// v.v = vertex
// v.rhombi = rhombi containing vertex
function VertexWithRhombi(v, rhombus) {
    this.v = v;
    this.rhombi = [rhombus];
}

function getUniqueVertices() {
    assert(msps.length === 1, "getUniqueVertices 1");
    var rs = msps[0].rhombi;
    vs = [];
    for (var i=0; i<rs.length; i++) {
        for (var j=0; j<4; j++) {
            var found = false;
            for (var k=0; k<vs.length; k++) {
                if (equivVertices(rs[i].vs[j], vs[k].v)) {
                    found = true;
                    vs[k].rhombi.push(rs[i]);
                    break;
                }
            }
            if (!found) {
                vs.push(new VertexWithRhombi(rs[i].vs[j], rs[i]));
            }
        }
    }
}

// random flip without checking for duplication
// more random for large numbers of flips but slow because of diffusion effect
// (i.e. can go backwards)
function doRandomFlips() {
    nFlips = parseInt(flipsField.value);
    assert(nFlips > 0, "doRandomFlips 1");
    assert(selectedMSP, "doRandomFlips 2");
    for (var i=0; i<nFlips; i++) {
        var flips = findAllPossibleFlips(selectedMSP.rhombi, selectedMSP.chains);
        var flipIdx = Math.floor(Math.random()*flips.length);
        var flip = flips[flipIdx];
        doFlip(flip, selectedMSP.chains);
    }
    repaint();
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

function drawVertices() {
    var ctx = canvas.getContext('2d');
    for (var i=0; i<vs.length; i++) {
        drawVertex(ctx, vs[i]);
    }
}

function drawVertex(ctx, v) {
    ctx.beginPath();
    ctx.arc(v.v.x, v.v.y, 10, 0, 2*Math.PI);
    ctx.closePath();
//    ctx.globalAlpha = 0.7;
    if (v.empty) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'orange';
        ctx.stroke();
        ctx.lineWidth = 1;
    } else {
        ctx.fillStyle = 'orange';
        ctx.fill();
    }
    if (v === selectedVertex) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'blue';
        ctx.stroke();
        ctx.lineWidth = 1;
    }
    if (pinSelectChoices && pinSelectChoices.includes(v)) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'red';
        ctx.stroke();
        ctx.lineWidth = 1;
    }
//    ctx.globalAlpha = 1.0;
//    ctx.fillStyle = "#000";
//    ctx.fillText(v.v.idx, v.v.x-5, v.v.y+5);
}

function drawRhombus(ctx, r) {
//    ctx.fillStyle = 'orange';
    if (r.selectedForColoring) {
        ctx.fillStyle = 'green';
    } else if (r.selectedForFlip) {
        ctx.fillStyle = 'blue';
    } else {
        ctx.fillStyle = r.color;
    }
    if (r.highlight) {
        ctx.fillStyle = 'gold';
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
//    ctx.fillStyle = "#000";
//    ctx.fillText(r.idx, r.center.x-5, r.center.y+5);
}

function drawMSP(ctx, msp) {
    for (var i=0; i<msp.polys.length; i++) {
        drawRhombus(ctx, msp.polys[i]);
    }
}

function countNonEmpty() {
    var c = 0;
    for (var i=0; i<vs.length; i++) {
        if (!vs[i].empty) {
            c++;
        }
    }
    return c;
}

function repaint() {
    var ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (var i=0; i<msps.length; i++) {
        drawMSP(ctx, msps[i]);
    }
    
    drawVertices();
    
    var nNonEmpty = countNonEmpty();
    if (nNonEmpty === 1) {
        var fontSav = ctx.font;
        var text = 'You win!'
        ctx.font = '5em Arial';
        ctx.fillStyle = 'red';
        var w = ctx.measureText(text).width;
        ctx.fillText(text, (canvas.width-w)/2, canvas.height/2);
        ctx.font = fontSav;
    }
}

function repaintRhombus(r) {
    var ctx = canvas.getContext('2d');
    drawRhombus(ctx, r);
}

function trySelectVertex(v) {
    var removeChoices = false;
    for (var i=0; i<vs.length; i++) {
        if (distance(v, vs[i].v) < 10) {
            if (pinSelectChoices) {
                removeChoices = true;
                if (pinSelectChoices.includes(vs[i])) {
                    selectedVertex.empty = true;
                    vs[i].empty = true;
                    selectedEmptyVertex.empty = false;
                }
            } else if (vs[i].empty ) {
                if (selectedVertex) {
                    selectedEmptyVertex = vs[i];
                    tryJump(selectedVertex, selectedEmptyVertex);
                    if (!pinSelectChoices) {
                        selectedVertex = null;
                        selectedEmptyVertex = null;
                    }
                }
            } else {
                selectedVertex = vs[i];
            } 
            break;
        }
    }
    if (removeChoices) {
        pinSelectChoices = null;
        selectedVertex = null;
        selectedEmptyVertex = null;
    }
}

// find a pin that is connected to both vPin and vEmpty
// there must also be a greater than 90 degree angle between vPin and vEmpty
// using the found pin as the pivot vertex
// you may have two pivot vertices if vPin and vEmpty are in the same rhombus
// in this case possibly remove both pins (from the two pivot vertices)
function tryJump(vPin, vEmpty) {
    var c1 = getConnectedVertices(vPin);
    var c2 = getConnectedVertices(vEmpty);
    // check whether the two are next to each other
    if (c1.includes(vEmpty)) {
        return;
    }
    var c = arrayIntersection(c1, c2);
    var d = distance(vPin.v, vEmpty.v);
    for (var i=0; i<c.length; i++) {
        if (c[i].empty) {
            c.splice(i,1);
            i--;
            continue;
        }
//        if (d < Math.sqrt(2)*distance(vPin.v, c[i].v)) {
//           c.splice(i,1);
//           i--;
//           continue;
//        }
    }
    if (c.length === 1) {
        // check whether we have two possible vertices
        // to jump over
        // in this case select both of the vertices and give user the 
        // option to choose which pin to remove by clicking
        vPin.empty = true;
        vEmpty.empty = false;
        c[0].empty = true;
    } else if (c.length === 2) {
        pinSelectChoices = c;
    }
}

function getConnectedVertices(vwr) {
    var cvs = [];
    for (var i=0; i<vwr.rhombi.length; i++) {
        var r = vwr.rhombi[i];
        for (var j=0; j<4; j++) {
            if (equivVertices(r.vs[j], vwr.v)) {
                if (j === 0) {
                    cvs.push(r.vs[3]);
                    cvs.push(r.vs[1]);
                } else if (j === 3) {
                    cvs.push(r.vs[2]);
                    cvs.push(r.vs[0]);
                } else {
                    cvs.push(r.vs[j-1]);
                    cvs.push(r.vs[j+1]);
                }
            }
        }
    }
    // remove duplicates
    var cvsUnique = [];
    for (var i=0; i<cvs.length; i++) {
        var found = false;
        for (var j=0; j<cvsUnique.length; j++) {
            if (equivVertices(cvsUnique[j], cvs[i])) {
                found = true;
                break;
            }
        }
        if (!found) {
            cvsUnique.push(cvs[i]);
        }
    }
    // convert to vertex with rhombi
    var cvsr = [];
    for (var i=0; i<cvsUnique.length; i++) {
        for (var j=0; j<vs.length; j++) {
            if (equivVertices(cvsUnique[i], vs[j].v)) {
                cvsr.push(vs[j]);
                break;
            }
        }
    }
    return cvsr;
}

function canvasClick(v) {
    trySelectVertex(v);
    repaint();
}

function doLogChains() {
    if (selectedMSP) {
        logChains(selectedMSP.chains);
    }
}