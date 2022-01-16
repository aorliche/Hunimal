
// DOM
let canvas;     // should be mspCanvas but keyboard file requires variable to be canvas
let wordSearchCanvas;
let wordList;
let numFoundSpan;
let numUsedSpan;

// MSP font
// we can call resetCanvas() method after creating each letter (and saving to an image)
let msps = [];
let selectedVertex = null;
let selectedMSP = null;
const keyboardSpacingXField = {value: 0};
const keyboardSpacingYField = {value: 0};
const keyboardSizeField = {value: 0}; // changed in main
const fontColorCheckbox = {checked: false};
const fontAlphaField = {value: 0.5};
const fontColorField = {value: "red"};
const maxExpandIter = 10000;

// words
const NUM_USED_WORDS = 10;
let allWords = [];
const usedWords = [];

// grid
let CELL_SIZE = 70;
let nRows;
let nCols;
let grid;
const placedLetters = [];

// shim for creating msp font
// must be called repaint for keyboard.js
// word search canvas repaint is called boardRepaint()
function repaint() {
    var ctx = canvas.getContext('2d');
    
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (var i=0; i<msps.length; i++) {
        drawMSP(ctx, msps[i]);
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

function drawMSP(ctx, msp) {
    for (var i=0; i<msp.polys.length; i++) {
        drawRhombus(ctx, msp.polys[i]);
    }
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
    //if (displayLinesCheckbox.checked) {
    if (r.alpha !== 0.0) {
        ctx.stroke();
    }
    //}
    /*if (displayNumbersCheckbox.checked) {
        ctx.fillStyle = "#000";
        ctx.fillText(r.idx, r.center.x-5, r.center.y+5);
    }*/
}
// end shim

async function init() {
    canvas = document.getElementById("msp-canvas");
    wordSearchCanvas = document.getElementById("word-search-canvas");
    wordList = document.getElementById("word-list");
    numFoundSpan = document.getElementById("num-found-span");
    numUsedSpan = document.getElementById("num-used-span");
    
    // for msp font
    keyboardSizeField.value = canvas.width;
    
    nCols = Math.floor(wordSearchCanvas.width / CELL_SIZE);
    nRows = Math.floor(wordSearchCanvas.height / CELL_SIZE);
    
    wordSearchCanvas.width = nCols * CELL_SIZE;
    wordSearchCanvas.height = nRows * CELL_SIZE;
    
    // load words
    await fetch("words/hun.txt")
        .then(res => res.text())
        .then(data => allWords = data.split("\r\n"));
    await fetch("words/math.txt")
        .then(res => res.text())
        .then(data => allWords = allWords.concat(data.split("\r\n")));
    
    // make sure we can fit the word in the grid!
    const allWordsFiltered = [];
    for (let i=0; i<allWords.length; i++) {
        if (allWords[i].length <= nCols && allWords[i].length <= nRows) {
            allWordsFiltered.push(allWords[i]);
        }
    }
    allWords = allWordsFiltered;
    
    // populate list
    const indices = getRandomIndices(allWords.length, NUM_USED_WORDS);
    for (let i=0; i<indices.length; i++) {
        const w = allWords[indices[i]].toUpperCase();
        indices.splice(i--,1);
        usedWords.push({word: w});
    }
    
    // create grid
    grid = [];
    for (let i=0; i<nCols; i++) {
        grid[i] = [];
        for (let j=0; j<nRows; j++) {
            grid[i][j] = {
                letter: String.fromCharCode(0x41+Math.floor(26*Math.random()))
            };
        }
    }
    
    // place words in grid...
    for (let i=0; i<usedWords.length; i++) {
        const placed = placeWord(usedWords[i]);
        if (!placed) {
            usedWords.splice(i--, 1);
        }
    }
    
    //... it is sometimes the case that we can't place all the words
    for (let i=0; i<usedWords.length; i++) {
        const w = usedWords[i].word;
        const li = document.createElement("li");
        li.innerHTML = "<div class='checkbox-div' id='word-" + escapeHtml(w) + "-div'></div>" + escapeHtml(w);
        wordList.appendChild(li);
    }
        
    numFoundSpan.innerText = 0;
    numUsedSpan.innerText = usedWords.length;
    
    boardRepaint();
    
    wordSearchCanvas.addEventListener("click", function(e) {
        const p = convertToElementCoords(e);
        const c = Math.floor(p.x / CELL_SIZE);
        const r = Math.floor(p.y / CELL_SIZE);
        if (c >= nCols) c = nCols-1;
        if (r >= nRows) r = nRows-1;
        grid[c][r].selected = !grid[c][r].selected;
        // count number selected
        let nSel = 0;
        for (let i=0; i<nCols; i++) {
            for (let j=0; j<nRows; j++) {
                if (grid[i][j].selected) {
                    nSel++;
                }
            }
        }
        // check if we've hit a word
        outer:
        for (let i=0; i<usedWords.length; i++) {
            const word = usedWords[i];
            if (word.solved) {
                continue;
            }
            // select all and only all letters of a word
            if (nSel !== word.word.length) { 
                continue;
            }
            const sCol = word.start[0];
            const sRow = word.start[1];
            const eCol = word.end[0];
            const eRow = word.end[1];
            const colInc = (eCol === sCol) ? 0 : Math.sign(eCol-sCol);
            const rowInc = (eRow === sRow) ? 0 : Math.sign(eRow-sRow);
            for (let j=0, c2=sCol, r2=sRow; j<nSel; j++, c2 += colInc, r2 += rowInc) {
                if (!grid[c2][r2].selected || word.word[j] !== grid[c2][r2].letter) {
                    continue outer;
                }
            }
            // found word
            for (let j=0, c2=sCol, r2=sRow; j<nSel; j++, c2 += colInc, r2 += rowInc) {
                grid[c2][r2].selected = false;
            }
            word.solved = true;
            const wordDiv = document.getElementById("word-"+word.word+"-div");
            wordDiv.style.backgroundImage = "url('image/check.png')";
            numFoundSpan.innerText = parseInt(numFoundSpan.innerText)+1;
            break;
        }
        boardRepaint();
    }, false);
    
    // change letters to msp font
    // doneWithLetter starts off being null
    let gridPosI = 0;
    let gridPosJ = 0;
    let fn;
    setTimeout(fn = function() {
        if (doneWithLetter === false) {
            setTimeout(fn, 50);
            return;
        }
        let done = false;
        let letter;
        if (gridPosI === grid.length) {
            done = true;
        } else {
            letter = grid[gridPosI][gridPosJ].letter;
        }
        if (doneWithLetter === true) {
            // previous indices
            let prevJ = (gridPosJ === 0) ? grid[0].length-1 : gridPosJ-1;
            let prevI = (gridPosJ === 0) ? gridPosI - 1 : gridPosI;
            // create image
            // add image
            const img = new Image();
            img.addEventListener("load", function() {
                boardRepaint();
            }, false);
            img.src = canvas.toDataURL();
            grid[prevI][prevJ].img = img;
            resetCanvas();
            if (done) {
                return;
            }
        }
        if (++gridPosJ === grid[0].length) {
            gridPosI++;
            gridPosJ = 0;
        }
        keyDown({key: letter, keyCode: letter.charCodeAt(0)});
        setTimeout(fn, 50);
    }, 100);
    
    //keyDown({key: usedWords[0].word[0], keyCode: usedWords[0].word.charCodeAt(0)});
}

const MAX_PLACE_ITER = 100;
//let myIter = 0;

// tryCollide: try to overlap with existing words
// call first with true and then with false
function placeWordByDirection(word, dir, tryCollide) {
    assert(word.word.length > 0, "zero length word");
    
    // randomly try to place word
    let placed = false;
    
    outer:
    for (let i=0; i<MAX_PLACE_ITER; i++) {
        //console.log(myIter++);
        let c, r;
        if (dir === 'hl') {
            c = Math.floor((nCols-word.word.length)*Math.random());
            r = Math.floor(nRows*Math.random());
        } else if (dir === 'hr') {
            c = word.word.length - 1 + Math.floor((nCols-word.word.length+1)*Math.random());;
            r = Math.floor(nRows*Math.random());
        } else if (dir === 'vd') {
            c = Math.floor(nCols*Math.random());
            r = Math.floor((nRows-word.word.length)*Math.random());
        } else if (dir === 'vu') {
            c = Math.floor(nCols*Math.random());
            r = word.word.length - 1 + Math.floor((nRows-word.word.length+1)*Math.random());
        } else {
            assert(false, "bad dir: " + dir);
        }
        
        let collision = false;
        
        for (let j=0; j<word.word.length; j++) {
            if (dir === 'hl') {
                cp = c+j;
                rp = r;
            } else if (dir === 'hr') {
                cp = c-j;
                rp = r;
            } else if (dir === 'vd') {
                cp = c;
                rp = r+j;
            } else if (dir === 'vu') {
                cp = c;
                rp = r-j;
            }
            if (grid[cp][rp].placed && grid[cp][rp].letter !== word.word[j]) {
                continue outer;
            }
            if (grid[cp][rp].placed) {
                collision = true;
            }
        }
        
        if (tryCollide && !collision) {
            continue;
        }
        
        word.start = [c,r];
        
        if (dir === 'hl') {
            word.end = [c+word.word.length-1,r];
        } else if (dir === 'hr') {
            word.end = [c-word.word.length+1,r];
        } else if (dir === 'vd') {
            word.end = [c,r+word.word.length-1];
        } else if (dir === 'vu') {
            word.end = [c,r-word.word.length+1];
        } 
        
        for (let j=0; j<word.word.length; j++) {
            if (dir === 'hl') {
                cp = c+j;
                rp = r;
            } else if (dir === 'hr') {
                cp = c-j;
                rp = r;
            } else if (dir === 'vd') {
                cp = c;
                rp = r+j;
            } else if (dir === 'vu') {
                cp = c;
                rp = r-j;
            }
            if (!grid[cp][rp].placed) {
                grid[cp][rp].placed = true;
                grid[cp][rp].letter = word.word[j];
            }
        }
        
        placed = true;
        break;
    }
    return placed;
}

function placeWord(word) {
    const dirs = ['hl', 'hr', 'vd', 'vu'];
    shuffle(dirs);
    let placed;
    for (let i=0; i<dirs.length; i++) {
        placed = placeWordByDirection(word, dirs[i], true);
        if (placed) {
            break;
        }
    }
    if (placed) {
        return placed;
    }
    for (let i=0; i<dirs.length; i++) {
        placed = placeWordByDirection(word, dirs[i], false);
        if (placed) {
            break;
        }
    }
    return placed;
}

function boardRepaint() {
    const ctx = wordSearchCanvas.getContext("2d");
    ctx.clearRect(0, 0, wordSearchCanvas.width, wordSearchCanvas.height);
    // show letters and grid
    for (let i=0; i<nCols; i++) {
        for (let j=0; j<nRows; j++) {
            if (!grid[i][j].img) {
                ctx.font = (CELL_SIZE-10) + "px Arial";
                ctx.fillStyle = "black";
                ctx.fillText(grid[i][j].letter, i*CELL_SIZE+10, (j+1)*CELL_SIZE-10);
            } else {
                ctx.drawImage(grid[i][j].img, i*CELL_SIZE, j*CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(i*CELL_SIZE, j*CELL_SIZE);
            ctx.lineTo((i+1)*CELL_SIZE, j*CELL_SIZE);
            ctx.lineTo((i+1)*CELL_SIZE, (j+1)*CELL_SIZE);
            ctx.lineTo(i*CELL_SIZE, (j+1)*CELL_SIZE);
            ctx.stroke();
        }
    }
    // show solved words
    for (let i=0; i<usedWords.length; i++) {
        const word = usedWords[i];
        if (!word.solved) {
            continue;
        }
        const sCol = word.start[0];
        const sRow = word.start[1];
        const eCol = word.end[0];
        const eRow = word.end[1];
        let x, y, w, h;
        if (sRow === eRow) {
            if (sCol < eCol) {
                x = sCol*CELL_SIZE;
                y = sRow*CELL_SIZE;
                w = (eCol-sCol+1)*CELL_SIZE;
                h = CELL_SIZE;
            } else {
                x = eCol*CELL_SIZE;
                y = sRow*CELL_SIZE;
                w = (sCol-eCol+1)*CELL_SIZE;
                h = CELL_SIZE;
            }
        } else {
            if (sRow < eRow) {
                x = sCol*CELL_SIZE;
                y = sRow*CELL_SIZE;
                w = CELL_SIZE;
                h = (eRow-sRow+1)*CELL_SIZE;
            } else {
                x = sCol*CELL_SIZE;
                y = eRow*CELL_SIZE;
                w = CELL_SIZE;
                h = (sRow-eRow+1)*CELL_SIZE;
            }
        }
        ctx.globalAlpha = 0.8;
        ctx.strokeStyle = "#0b0";
        ctx.lineWidth = 4;
        ctx.strokeRect(x+5,y+5,w-10,h-10);
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 1;
        ctx.fillStyle = "#0b0";
        ctx.fillRect(x+5,y+5,w-10,h-10);
        ctx.globalAlpha = 1.0;
    }
    // show selection
    for (let i=0; i<nCols; i++) {
        for (let j=0; j<nRows; j++) {
            ctx.beginPath();
            ctx.moveTo(i*CELL_SIZE, j*CELL_SIZE);
            ctx.lineTo((i+1)*CELL_SIZE, j*CELL_SIZE);
            ctx.lineTo((i+1)*CELL_SIZE, (j+1)*CELL_SIZE);
            ctx.lineTo(i*CELL_SIZE, (j+1)*CELL_SIZE);
            if (grid[i][j].selected) {
                ctx.fillStyle = "red";
                ctx.globalAlpha = 0.3;
                ctx.fill();
                ctx.globalAlpha = 1.0;
            }
        }
    }
}

function getRandomIndices(max, n) {
    assert(n <= max, "n > max");
    const all = [];
    const res = [];
    for (let i=0; i<max; i++) {
        all[i] = i;
    }
    for (let i=0; i<n; i++) {
        const j = Math.floor(all.length*Math.random());
        res.push(all.splice(j, 1));
    }
    return res;
}