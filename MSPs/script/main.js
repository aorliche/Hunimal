/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var canvas;
var xCoordField;
var yCoordField;
var mField;
var flowerMField;
var sideLengthField;
var powerField;
var flipsField;
var keyboardSizeField;
var keyboardSpacingXField;
var keyboardSpacingYField;
var savedStatesTable;
var savedStrokeTable;
var squominoTextArea;
var colorField;
var rotateHSLField;
var displayNumbersCheckbox;
var displayLinesCheckbox;
var stretchNField;
var applyColorCheckbox;
var applyAlphaCheckbox;
var backgroundColorField;
var fontColorField;
var fontColorCheckbox;
var fontAlphaField;
var fontAlphaCheckbox;
let typingAreaDiv;
let typingArea;

var selectMSPRadio;
var selectVertexRadio;
var selectEdgeRadio;
var selectForFlipRadio;
var selectForColoringRadio;
var selectMultipleRadio;

var fileInput;
var strokeFileInput;
var canvasFileInput;

var msps = [];
var selectedMSP;

var maxExpandIter = 10000;
var savedStateIdx = 0;
var savedStrokeIdx = 0;
var visualSquomino;
var draggingSquomino = false;
var prevPosition;
var selectedVertex;
var selectedEdge;

var translating = false;
var selectingForColoring = false;
var selectingForColoringApplied = false;

var stroking;
var strokeParts;
var backgroundColor = "black";
var backgroundImage = null;
var useBackgroundImage = false;

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

function clearSelection() {
    selectedEdge = null;
    selectedVertex = null;
    repaint();
}

function onload() {
    canvas = document.getElementById("canvas");
    
    xCoordField = document.getElementById("x-coord-field");
    yCoordField = document.getElementById("y-coord-field");
    
    selectMSPRadio = document.getElementById("select-msp-radio");
    selectVertexRadio = document.getElementById("select-vertex-radio");
    selectEdgeRadio = document.getElementById("select-edge-radio");
    selectForFlipRadio = document.getElementById("select-for-flip-radio");
    selectForColoringRadio = document.getElementById("select-for-coloring-radio");
    selectMultipleRadio = document.getElementById("select-multiple-radio");
    
    mField = document.getElementById("m-field");
    sideLengthField = document.getElementById("side-length-field");
    powerField = document.getElementById("power-field");
    flipsField = document.getElementById("flips-field");
    colorField = document.getElementById("color-field");
    embedWordField = document.getElementById("embed-word-field");
    flowerMField = document.getElementById("flower-m-field");
    rotateHSLField = document.getElementById("rotate-hsl-field");
    stretchNField = document.getElementById("stretch-n-field");
    alphaField = document.getElementById("alpha-field");
    keyboardSizeField = document.getElementById("keyboard-size-field");
    keyboardSpacingXField = document.getElementById("keyboard-spacing-x-field");
    keyboardSpacingYField = document.getElementById("keyboard-spacing-y-field");
    
    displayNumbersCheckbox = document.getElementById("display-numbers-checkbox");
    displayLinesCheckbox = document.getElementById("display-lines-checkbox");
    applyColorCheckbox = document.getElementById("apply-color-checkbox");
    applyAlphaCheckbox = document.getElementById("apply-alpha-checkbox");
    
    fileInput = document.getElementById("file-input");
    strokeFileInput = document.getElementById("stroke-file-input");
    canvasFileInput = document.getElementById("canvas-file-input");
    
    savedStatesTable = document.getElementById("saved-states-table");
    squominoTextArea = document.getElementById("squomino-text-area");
    savedStrokeTable = document.getElementById("saved-stroke-table");
    
    backgroundColorField = document.getElementById("background-color-field");
    fontColorField = document.getElementById("font-color-field");
    fontColorCheckbox = document.getElementById("font-color-checkbox");
    fontAlphaField = document.getElementById("font-alpha-field");
    fontAlphaCheckbox = document.getElementById("font-alpha-checkbox");
    
    typingAreaDiv = document.getElementById("typing-area-div");
    typingArea = document.getElementById("typing-area");
    
    center = new Vertex(canvas.width/2, canvas.height/2);
    
    // attach listeners
    selectEdgeRadio.addEventListener("change", function(e) {
        clearSelection();
    }, false);
    selectVertexRadio.addEventListener("change", function(e) {
        clearSelection();
    }, false);
    selectMSPRadio.addEventListener("change", function(e) {
        clearSelection();
    }, false);
    selectForFlipRadio.addEventListener("change", function(e) {
        clearSelection();
    }, false);
    selectForColoringRadio.addEventListener("change", function(e) {
        clearSelection();
    }, false);
    selectMultipleRadio.addEventListener("change", function(e) {
        clearSelection();
    }, false);
    
    canvas.addEventListener("mousemove", function(e) {
        var v = convertToElementCoords(e);
        xCoordField.value = v.x.toFixed(0);
        yCoordField.value = v.y.toFixed(0);
        if (translating) {
            var dx = v.x - prevPosition.x;
            var dy = v.y - prevPosition.y;
            prevPosition = v;
            if (selectedMSP) {
                translateMSP(selectedMSP, dx, dy);
            } else {
                for (var i=0; i<msps.length; i++) {
                    translateMSP(msps[i], dx, dy);
                }
            }
            repaint();
        } else if (selectingForColoring) {
            if (!selectedMSP) {
                return;
            }
            if (stroking) {
                strokeParts[strokeParts.length-1].push(copyVertex(v));
            }
            selectingForColoringApplied = true;
            var r = getPolyAtCoords(selectedMSP, v);
            if (r === null) {
                return;
            }
            r.selectedForColoring = true;
            repaint();
        } else {
            if (!selectedMSP) {
                return;
            }
            var r = getPolyAtCoords(selectedMSP, v);
            repaint();
            if (r === null) {
                return;
            }
            repaintWord(r);
        }
//        if (draggingSquomino) {
//            var dx = v.x - prevPosition.x;
//            var dy = v.y - prevPosition.y;
//            moveSquomino(visualSquomino, dx, dy);
//            repaint();
//            prevPosition = v;
//            clearHighlight(msp);
//            highlightRhombi(visualSquomino, v, msp, chains);
//        } else if (clickMoveRecolorCheckbox.checked && translating) {
//            var r = getRhombusAtCoords(msp, v);
//            if (r !== null) {
//                r.selectedForColoring = true;
//                repaintRhombus(r);
//            }
//            strokeParts[strokeParts.length-1].push(copyVertex(v));
//        } else if (translating) {
//            var dx = v.x - prevPosition.x;
//            var dy = v.y - prevPosition.y;
//            prevPosition = v;
//            center.x += dx;
//            center.y += dy;
//            for (var i=0; i<msp.length; i++) {
//                moveRhombus(msp[i], dx, dy);
//            }
//            if (quads) {
//                for (var i=0; i<quads.length; i++) {
//                    moveRhombus(quads[i], dx, dy);
//                }
//            }
//            if (triangles) {
//                for (var i=0; i<triangles.length; i++) {
//                    moveRhombus(triangles[i], dx, dy);
//                }
//            }
//            repaint();
//        } else {
//            var r = getRhombusAtCoords(msp, v);
//            repaint();
//            if (r) {
//                repaintWord(r);
//            }
//        }
    }, false);
    
    canvas.addEventListener("click", function(e) {
        var v = convertToElementCoords(e);
//        if (visualSquomino && squominoContains(visualSquomino, v)) {
//            return;
//        }
//        if (clickMoveRecolorCheckbox.checked) {
//            var r = getRhombusAtCoords(msp, v);
//            if (r !== null) {
//                r.selectedForColoring = true;
//                repaintRhombus(r);
//            }
//            return;
//        }
        canvasClick(v);
    });
    
    canvas.addEventListener("mousedown", function(e) {
        var v = convertToElementCoords(e);
        prevPosition = v;
        if (selectMSPRadio.checked) {
            translating = true;
        } else if (selectForColoringRadio.checked) {
            if (stroking) {
                strokeParts.push([copyVertex(v)]);
            }
            selectingForColoring = true;
            selectingForColoringApplied = false;
        }
//        if (visualSquomino && squominoContains(visualSquomino, v)) {
//            draggingSquomino = true;
//            prevPosition = v;
//        } else /*if (getRhombusAtCoords(msp, v) === null)*/ {
//            translating = true;
//            prevPosition = v;
//            if (!continueStrokeCheckbox.checked || !strokeParts) {
//                strokeParts = [];
//            }
//            strokeParts.push([copyVertex(v)]);
//        }
    }, false);
    
    canvas.addEventListener("mouseup", function(e) {
//        clearHighlight(msp);
//        draggingSquomino = false;
        translating = false;
        selectingForColoring = false;
    }, false);
    
    canvas.addEventListener("mouseleave", function(e) {
//        clearHighlight(msp);
//        draggingSquomino = false;
        translating = false;
        selectingForColoring = false;
        selectingForColoringApplied = false;
    }, false);
    
    canvas.addEventListener("wheel", function(e) {
        e.preventDefault();
        if (!selectMSPRadio.checked) {
            return;
        }
        var v = convertToElementCoords(e);
        var scale = 1;
        if (/*e.wheelDelta > 0 ||*/ e.deltaY < 0) {
            scale = 1.1;
        } else {
            scale = 0.9;
        }
        if (selectedMSP) {
            zoomMSP(selectedMSP, scale);
        } else {
            for (var i=0; i<msps.length; i++) {
                zoomMSP(msps[i], scale, v);
            }
        }
        repaint();
    }, false);
    
    typingArea.addEventListener("keydown", function(e) {
        keyDown(e);
    }, false);
    
    typingArea.addEventListener("keyup", function(e) {
        keyUp(e);
    }, false);
    
    canvas.addEventListener("keydown", function(e) {
        e.preventDefault();
        keyDown(e);
    }, false);
    
    canvas.addEventListener("keyup", function(e) {
        e.preventDefault();
        keyUp(e);
    }, false);
    
    displayNumbersCheckbox.addEventListener("change", function(e) {
        repaint();
    }, false);
    
    displayLinesCheckbox.addEventListener("change", function(e) {
        repaint();
    }, false);
    
    fileInput.addEventListener("change", function (e) {
        var file = e.target.files[0];
        if (!file) {
            return;
        }
        var r = new FileReader();
        r.onload = function(e) {
            var msp = loadMSP(e.target.result);
            msps.push(msp);
            selectedMSP = msp;
            repaint();
        };
        r.readAsText(file);
    }, false);
    
    strokeFileInput.addEventListener("change", function(e) {
        var file = e.target.files[0];
        if (!file) {
            return;
        }
        var r = new FileReader();
        r.onload = function(e) {
            strokeParts = JSON.parse(e.target.result);
            repaint();
            stroking = true;
            displayStroke();
        };
        r.readAsText(file);
    }, false);
    
    canvasFileInput.addEventListener("change", function (e) {
        var file = e.target.files[0];
        if (!file) {
            return;
        }
        var r = new FileReader();
        r.onload = function(e) {
            loadCanvas(e.target.result);
            repaint();
        };
        r.readAsText(file);
    }, false);
        
    buildRandomMSP();
    //buildRandomMSP(false, false, true);
}

function displayTypingArea() {
    typingAreaDiv.style.display = "block";
}

function hideTypingArea() {
    typingAreaDiv.style.display = "none";
}

function selectAllForRecoloring() {
    assert(selectedMSP, "selectAllForRecoloring: no selected MSP");
    var rhombi = selectedMSP.polys;
    var value = !rhombi[0].selectedForColoring;
    for (var i=0; i<rhombi.length; i++) {
        rhombi[i].selectedForColoring = value;
    }
    repaint();
}

function getSelectedRhombi(rhombi) {
    var sel = [];
    for (var i=0; i<rhombi.length; i++) {
        if (rhombi[i].selectedForColoring || rhombi[i].selectedForFlip) {
            sel.push(rhombi[i]);
        }
    }
    return sel;
}

function divideMSP() {
    assert(selectedMSP, "divideMSP 1");
    var power = parseInt(powerField.value);
    divideRhombi(selectedMSP, selectedMSP.rhombi, power);
    sideLengthField.value = sideLengthField.value/power;
    repaint();
}

// misnamed - this function actually divides all rhombi that
// are selected for coloring or flipping
function divideRhombus() {
    assert(selectedMSP, "divideRhombus 1");
    var power = parseInt(powerField.value);
    
    var rs = getSelectedRhombi(selectedMSP.rhombi);
    if (rs.length === 0) {
        return;
    }
    divideRhombi(selectedMSP, rs, power);
    
    repaint();
}

function divideRhombi(msp, rhombi, power) {
    assert(power > 1, "divideRhombi 1");
    
    var orhombi = msp.rhombi;
    var nrhombi = [];
    
    for (var i=0; i<rhombi.length; i++) {
        var rs = splitRhombus(rhombi[i], power);
        for (var j=0; j<rs.length; j++) {
            nrhombi.push(rs[j]);
        }
    }
    
    colorRhombi(nrhombi);
    
    if (rhombi !== orhombi) {
        for (var i=0; i<orhombi.length; i++) {
            if (rhombi.includes(orhombi[i])) {
                continue;
            }
            nrhombi.push(orhombi[i]);
        }
    }
    
    msp.rhombi = nrhombi;
    msp.polys = msp.rhombi;
    msp.needDiag = true;
    msp.chains = buildChains(nrhombi);
}

function combineRhombi() {
    assert(selectedMSP, "combineRhombi 1");
    
    var ors = selectedMSP.rhombi;
    var rs = getSelectedRhombi(ors);
    if (rs.length < 4) {
        return;
    }
    
    var nr = combineHelper(rs);
    if (nr === null) {
        return;
    }
    
    var nrs = [nr];
    colorRhombi(nrs);
    
    for (var i=0; i<ors.length; i++) {
        if (!rs.includes(ors[i])) {
            nrs.push(ors[i]);
        }
    }
    
    selectedMSP.rhombi = nrs;
    selectedMSP.polys = nrs;
    selectedMSP.chains = buildChains(nrs);
    
    repaint();
}

function rediagonalizeMSP(msp) {
    msp.tris = makeTrianglesFromMSP(msp);
    msp.quads = makeQuadsFromChains(msp.chains);
    msp.quads = msp.quads.concat(makeTrianglesFromChains(msp.chains));
    colorRhombi(msp.quads);
    colorRhombi(msp.tris);
    msp.needDiag = false;
}

function diagonalizeMultiple(action) {
    for (var i=0; i<msps.length; i++) {
        var msp = msps[i];
        if (msp.selected) {
            if (action === 'Rhombi') {
                selectedMSP = msp;
                showRhombiNotDiagonalization();
            } else if (action === 'Quads') {
                selectedMSP = msp;
                diagonalizeMSP();
            } else if (action === 'Tris') {
                selectedMSP = msp;
                triangularizeMSP();
            } else if (action === 'Clear') {
                clearDiagonalization();
            }
        }
    }
}

function diagonalizeMSP(){
    assert(selectedMSP, "diagonalizeMSP: selectedMSP is null");
    if (selectedMSP.needDiag) {
        rediagonalizeMSP(selectedMSP);
    }
    selectedMSP.polys = selectedMSP.quads;
    repaint();
}

function triangularizeMSP() {
    assert(selectedMSP, "diagonalizeMSP: selectedMSP is null");
    if (selectedMSP.needDiag) {
        rediagonalizeMSP(selectedMSP);
    }
    selectedMSP.polys = selectedMSP.tris;
    repaint();
}

function showRhombiNotDiagonalization() {
    assert(selectedMSP, "showRhombiNotDiagonalization: selectedMSP is null");
    selectedMSP.polys = selectedMSP.rhombi;
    repaint();
}

function clearDiagonalization() {
    assert(selectedMSP, "clearDiagonalization: selectedMSP is null");
    selectedMSP.quads = null;
    selectedMSP.tris = null;
    selectedMSP.needDiag = true;
    selectedMSP.polys = selectedMSP.rhombi;
    repaint();
}

function changeBackground() {
    backgroundColor = backgroundColorField.value;
    useBackgroundImage = false;
    repaint();
}

// this destroys the selectedMSP
function setMSPBackground() {
    if (!selectedMSP && !backgroundImage) {
        return;
    }
    // center the MSP and expand so that all of the canvas
    // is covered by its rhombi
    if (selectedMSP) {
        let scale = 1.5*canvas.width/selectedMSP.rect.w;
        zoomMSP(selectedMSP, scale);
        
        let dx = canvas.width/2 - selectedMSP.center.x;
        let dy = canvas.height/2 - selectedMSP.center.y;
        translateMSP(selectedMSP, dx, dy);
        
        repaint();
        
        useBackgroundImage = true;
        
        let dataURL = canvas.toDataURL();
        backgroundImage = new Image();
        backgroundImage.src = dataURL;
        backgroundImage.onload = function() {
            repaint();
        }
        
        deleteMSP();
    } else {
        useBackgroundImage = true;
        repaint();
    }
}

//function flipSquomino() {
//    if (!visualSquomino) {
//        return;
//    }
//    reflectSquomino(visualSquomino);
//    convertVisualSquominoToChains(visualSquomino);
//    squominoTextArea.value = chainsToBasicString(visualSquomino.chains);
//    clearHighlight();
//    highlightRhombi(visualSquomino, prevPosition, msp, chains);
//    repaint();
//}

//function rotateSquomino() {
//    if (!visualSquomino) {
//        return;
//    }
//    rotateSquomino90Clockwise(visualSquomino);
//    convertVisualSquominoToChains(visualSquomino);
//    squominoTextArea.value = chainsToBasicString(visualSquomino.chains);
//    clearHighlight(msp);
//    highlightRhombi(visualSquomino, prevPosition, msp, chains);
//    repaint();
//}

//function createSquomino() {
//    var squomino = parseSquomino(squominoTextArea.value);
//    visualSquomino = new VisualSquomino(squomino);
//    
//    moveSquomino(visualSquomino, 100, 100);
//    
//    repaint();
//}

// random flip without checking for duplication
// more random for large numbers of flips but slow because of diffusion effect
// (i.e. can go backwards)
function doRandomFlips() {
    var nFlips = parseInt(flipsField.value);
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

function embedWord() {
    assert(selectedMSP, "embedWord 1: selectedMSP is null");
    var rs = selectedMSP.polys;
    var word = embedWordField.value;
    for (var i=0; i<rs.length; i++) {
        if (rs[i].selectedForFlip || rs[i].selectedForColoring) {
            rs[i].word = word;
            rs[i].selectedForFlip = false;
            rs[i].selectedForColoring = false;
            repaintRhombus(rs[i]);
            repaintWord(rs[i]);
        }
    }
}

function recolorSelectedRhombi(doRandomColors) {
    assert(selectedMSP, "recolorSelectedRhombi: selectedMSP is null");
    var color = colorField.value;
    var alpha = alphaField.value;
    var applyColor = applyColorCheckbox.checked;
    var applyAlpha = applyAlphaCheckbox.checked;
    var rhombi = selectedMSP.polys;
    var rs = [];
    for (var i=0; i<rhombi.length; i++) {
        if (rhombi[i].selectedForColoring) {
            rs.push(rhombi[i]);
            rhombi[i].selectedForColoring = false;
        }
    }
    if (doRandomColors === true) {
        colorRhombi(rs);
	} else if (doRandomColors === "stripes" || doRandomColors === "dots") {
		createRandomPattern(doRandomColors, (pat) => {
			colorRhombi(rs, pat, alpha, applyColor, applyAlpha)
			for (var i=0; i<rs.length; i++) {
				repaintRhombus(rs[i]);
			}
		});
    } else {
        colorRhombi(rs, color, alpha, applyColor, applyAlpha);
    }
    for (var i=0; i<rs.length; i++) {
        repaintRhombus(rs[i]);
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

function drawRect(r, color) {
    var ctx = canvas.getContext('2d');
    if (!color) {
        ctx.strokeStyle = 'red';
    } else {
        ctx.strokeStyle = color;
    }
    ctx.strokeRect(r.x, r.y, r.w, r.h);
}

function drawVertices(vs) {
    var ctx = canvas.getContext('2d');
    for (var i=0; i<vs.length; i++) {
        drawVertex(ctx, vs[i]);
    }
}

function drawLines(lines) {
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#000';
    ctx.fillStyle = 'white';
//    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (var i=0; i<lines.length; i++) {
        ctx.moveTo(lines[i][0].x, lines[i][0].y);
        ctx.lineTo(lines[i][1].x, lines[i][1].y);
        ctx.stroke();
    }
}

function drawVertex(ctx, v) {
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(v.x, v.y, 5, 0, 2*Math.PI);
    ctx.closePath();
    ctx.fill();
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
    if (!r.selectedForColoring && !r.selectedForFlip && (r.alpha || r.alpha === 0)) {
        ctx.globalAlpha = r.alpha;
    }
    ctx.fill();
    ctx.globalAlpha = 1.0;
    if (displayLinesCheckbox.checked) {
        ctx.stroke();
    }
    if (displayNumbersCheckbox.checked) {
        ctx.fillStyle = "#000";
        ctx.fillText(r.idx, r.center.x-5, r.center.y+5);
    }
}

function drawMSP(ctx, msp) {
    for (var i=0; i<msp.polys.length; i++) {
        drawRhombus(ctx, msp.polys[i]);
    }
    if (msp.selected) {
        drawRect(msp.rect, 'green');
    }
    if (msp === selectedMSP) {
        drawRect(msp.rect);
    }
}

function repaint() {
    var ctx = canvas.getContext('2d');
    
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (useBackgroundImage) {
        ctx.drawImage(backgroundImage, 0, 0);
    }
    
    for (var i=0; i<msps.length; i++) {
        drawMSP(ctx, msps[i]);
    }
    
    if (selectedVertex) {
        drawVertex(ctx, selectedVertex);
    }
    if (selectedEdge) {
        drawEdge(selectedEdge);
    }
    
//    if (visualSquomino) {
//        drawSquomino(ctx, visualSquomino);
//    }
}

function repaintRhombus(r) {
    var ctx = canvas.getContext('2d');
    drawRhombus(ctx, r);
}

function repaintWord(r) {
    if (!r.word) {
        return;
    }
    var ctx = canvas.getContext('2d');
    var fontSav = ctx.font;
    ctx.font = '19px Sans-serif';
    var w = ctx.measureText(r.word).width;
    var h = 20;
    ctx.strokeStyle = "#000";
    ctx.fillStyle = "#fff";
    ctx.fillRect(r.center.x-w/2-5, r.center.y-h-10, w+10, h+10);
    ctx.strokeRect(r.center.x-w/2-5, r.center.y-h-10, w+10, h+10);
    ctx.fillStyle = "#000";
    ctx.fillText(r.word, r.center.x-w/2, r.center.y-8);
    ctx.font = fontSav;
}

function trySelectVertexInRhombi(rs, v) {
    var candvs = [];
    for (var i=0; i<rs.length; i++) {
        for (var j=0; j<4; j++) {
            var candv = rs[i].vs[j];
            var dist = distance(v, candv);
            if (dist < 10) {
                candvs.push([candv, dist]);
            }
        }
    }
    candvs.sort(function (a,b) {
        return a[1]-b[1];
    });
    if (candvs.length > 0) {
        selectedVertex = candvs[0][0];
        return true;
    } else {
        return false;
    }
}

function trySelectVertex(v) {
    for (var i=msps.length-1; i>=0; i--) {
        var msp = msps[i];
        if (!rectangleContainsPoint(msp.rect, v)) {
            continue;
        }
        var rs = msp.rhombi;
        var found = trySelectVertexInRhombi(rs, v);
        if (found) {
            return;
        }
    }
    selectedVertex = copyVertex(v);
}

function trySelectEdge(v) {
    assert(selectedMSP, "trySelectEdge: selectedMSP is null");
    if (selectedMSP.polys !== selectedMSP.rhombi) {
        return;
    }
    var edge;
    outer:
    for (var i=0; i<selectedMSP.rhombi.length; i++) {
        var vs = selectedMSP.rhombi[i].vs;
        for (var j=0; j<3; j++) {
            if (vertexOnEdge(v, vs[j], vs[j+1])) {
                edge = [vs[j], vs[j+1]];
                break outer;
            }
        }
        if (vertexOnEdge(v, vs[3], vs[0])) {
            edge = [vs[3], vs[0]];
            break;
        }
    }
    if (edge) {
        selectedEdge = edge;
    }
}

function drawEdge(e) {
    var ctx = canvas.getContext('2d');
    
    ctx.strokeStyle = 'red';
    ctx.lineWidth = '3';
    ctx.beginPath();
    ctx.moveTo(e[0].x, e[0].y);
    ctx.lineTo(e[1].x, e[1].y);
    ctx.stroke();
    ctx.lineWidth = '1';
}

function canvasClick(v) {
    if (selectVertexRadio.checked) {
        trySelectVertex(v);
        repaint();
        return;
    } else if (selectEdgeRadio.checked) {
        selectedEdge = null;
        trySelectEdge(v);
        repaint();
        return;
    } else if (selectMSPRadio.checked) {
        selectMSP(v);
        repaint();
        return;
    } else if (selectForFlipRadio.checked) {
        selectMSP(v);
        if (!selectedMSP) {
            return;
        }
        if (selectedMSP.polys !== selectedMSP.rhombi) {
            return;
        }
        var r = getRhombusAtCoords(selectedMSP.rhombi, v);
        if (r === null) {
            return;
        }
        r.selectedForFlip = !r.selectedForFlip;
        if (r.selectedForFlip) {
            tryFlip(selectedMSP, r);
        }
        repaint();
        return;
    } else if (selectForColoringRadio.checked) {
        if (selectingForColoringApplied) {
            selectingforColoringApplied = false;
            return;
        }
        if (!selectedMSP) {
            return;
        }
        if (stroking) {
            strokeParts[strokeParts.length-1].push(copyVertex(v));
        }
        var r = getPolyAtCoords(selectedMSP, v);
        if (r === null) {
            return;
        }
        r.selectedForColoring = !r.selectedForColoring;
        repaint();
        return;
    } else if (selectMultipleRadio.checked) {
        selectMultiple(v);
        repaint();
        return;
    }
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
            break;
        }
    }
}

function doLogChains() {
    if (selectedMSP) {
        logChains(selectedMSP.chains);
    }
}
