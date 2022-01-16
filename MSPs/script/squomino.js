/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var squominoSideLength = 25;
var squominoColor = 'green';
var squominoSideColor = 'white';

// horizontal is true or false
function Square(x, y, sideLength, idx, horizontal) {
    this.x = x;
    this.y = y;
    this.sideLength = sideLength;
    this.idx = idx;
    this.horizontal = horizontal;
}

function VisualSquomino(squomino) {
    assert(squomino.length >= 1, "VisualSquomino 1");
    assert(squomino[0].length >= 1, "VisualSquomino 2");
    
    this.squares = Array();
    this.chains = copyChains(squomino);
    
    var square = new Square(0,0,squominoSideLength,squomino[0][0], true);
    this.squares.push(square);
    
    for (var i=1; i<squomino[0].length; i++) {
        square = new Square(i*squominoSideLength,0,squominoSideLength,
                squomino[0][i], true);
        this.squares.push(square);
    }
    
    for (var i=1; i<squomino.length; i++) {
        var j, horizontal;
        square = null;
        for (j=0; j<squomino[i].length; j++) {
            square = findSquareInVisualSquomino(this.squares, squomino[i][j]);
            if (square) {
                break;
            }
        }
        assert(square !== null, "VisualSquomino 3");
        if (square.horizontal) {
            horizontal = false;
            dx = 0;
            dy = squominoSideLength;
        } else {
            horizontal = true;
            dx = squominoSideLength;
            dy = 0;
        }
        var x = square.x - (j*dx);
        var y = square.y - (j*dy);
        for (var k=0; k<squomino[i].length; k++) {
            if (k === j) {
                continue;
            }
            square = new Square(x + k*dx, y + k*dy, squominoSideLength, 
                squomino[i][k], horizontal);
            this.squares.push(square);
        }
    }
    
    this.dv = findSquominoDisplacementFromCenter(this);
}

function parseSquomino(str) {
    var squomino = Array();
    
    str = str.trim();
    var lines = str.split('\n');
    
    for (var i=0; i<lines.length; i++) {
        var numStrs = lines[i].split(',');
        var nums = Array();
        for (var j=0; j<numStrs.length; j++) {
            nums.push(parseInt(numStrs[j]));
        }
        squomino.push(nums);
    }
    
    return squomino;
}

function findSquareInVisualSquomino(squares, idx) {
    for (var i=0; i<squares.length; i++) {
        if (squares[i].idx === idx) {
            return squares[i];
        }
    }
    return null;
}

function findSquominoDisplacementFromCenter(visualSquomino) {
    // find least, greatest x and y
    var lx = Number.POSITIVE_INFINITY, ly = Number.POSITIVE_INFINITY;
    var gx = 0, gy = 0;
    var squares = visualSquomino.squares;
    for (var i=0; i<squares.length; i++) {
        if (squares[i].x < lx) {
            lx = squares[i].x;
        }
        if (squares[i].y < ly) {
            ly = squares[i].y;
        }
        if (squares[i].x+squominoSideLength > gx) {
            gx = squares[i].x+squominoSideLength;
        }
        if (squares[i].y+squominoSideLength > gy) {
            gy = squares[i].y+squominoSideLength;
        }
    }
    var width = gx - lx;
    var height = gy - ly;
    return new Vertex(width/2, height/2);
}

function drawSquomino(ctx, visualSquomino) {
    var squares = visualSquomino.squares;
//    var dx = -visualSquomino.dv.x;
//    var dy = -visualSquomino.dv.y;
    
    ctx.fillStyle = squominoColor;
    ctx.strokeStyle = squominoSideColor;
    
    for (var i=0; i<squares.length; i++) {
        var s = squares[i];
        ctx.fillRect(s.x, s.y, squominoSideLength, squominoSideLength);
    }
    
    for (var i=0; i<squares.length; i++) {
        var s = squares[i];
        ctx.strokeRect(s.x, s.y, squominoSideLength, squominoSideLength);
    }
}

function squominoContains(vs, v) {
    for (var i=0; i<vs.squares.length; i++) {
        var square = vs.squares[i];
        if (v.x >= square.x 
                && v.x <= (square.x + square.sideLength)
                && v.y >= square.y
                && v.y <= (square.y + square.sideLength)) {
            return true;
        }
    }
    return false;
}

function moveSquomino(vs, dx, dy) {
    for (var i=0; i<vs.squares.length; i++) {
        var square = vs.squares[i];
        square.x += dx;
        square.y += dy;
    }
}

function highlightRhombi(vs, v, msp, chains) {
    var r = getRhombusAtCoords(msp, v);
    if (r === null) {
        return;
    }
    var ccopy = copyChains(chains);
    var sset = [vs.chains[0][0]];
    var rset = [r];
    var rmap = new Map();
    rmap.set(vs.chains[0][0], r);
    for (var i=0; i<vs.chains.length; i++) {
        var schain = vs.chains[i];
        var n = 0;
        for (var j=0; j<schain.length; j++) {
            if (sset.includes(schain[j])) {
                expandHighlightInChain(schain, j, ccopy, sset, rset, rmap);
                n++;
                break;
            }
        }
    }
//    assert(rset <= vs.squares.length, "highlightRhombi 1");
    if (rset.length < vs.squares.length) {
        return;
    }
    for (var i=0; i<rset.length; i++) {
        rset[i].highlight = true;
    }
}

function expandHighlightInChain(schain, j, ccopy, sset, rset, rmap) {
    var r = rmap.get(schain[j]);
    for (var l=0; l<ccopy.length; l++) {
        for (var k=0; k<ccopy[l].length; k++) {
            if (ccopy[l][k] === r) {
                // runs off the end of the chain
                if (k-j < 0) {
                    return;
                }
                if (k+schain.length-j > ccopy[l].length) {
                    return;
                }
                for (var ii=0; ii<schain.length; ii++) {
                    if (!sset.includes(schain[ii])) {
                        sset.push(schain[ii]);
                        var s = ccopy[l][k-j+ii];
                        if (!rset.includes(s)) {
                            rset.push(s);
                            rmap.set(schain[ii], s);
                        }
                    }
                    ccopy[l][k-j+ii] = null;
                }
                return;
            }
        }
    }
}

function clearHighlight(msp) {
    for (var i=0; i<msp.length; i++) {
        msp[i].highlight = false;
    }
}

function findLeastXInSquares(squares) {
    var lx = Number.POSITIVE_INFINITY;
    for (var i=0; i<squares.length; i++) {
        if (squares[i].x < lx) {
            lx = squares[i].x;
        }
    }
    return lx;
}

function findLeastYInSquares(squares) {
    var ly = Number.POSITIVE_INFINITY;
    for (var i=0; i<squares.length; i++) {
        if (squares[i].y < ly) {
            ly = squares[i].y;
        }
    }
    return ly;
}

function convertSquaresToVertices(squares) {
    for (var i=0; i<squares.length; i++) {
        var x = squares[i].x;
        var y = squares[i].y;
        var sideLength = squares[i].sideLength;
        squares[i].vs = [
            new Vertex(x,y), 
            new Vertex(x+sideLength,y), 
            new Vertex(x+sideLength,y+sideLength),
            new Vertex(x,y+sideLength)];
    }
}

function convertFromVerticesToSquares(squaresWithVs) {
    for (var i=0; i<squaresWithVs.length; i++) {
        var s = squaresWithVs[i];
        var lx = Number.POSITIVE_INFINITY;
        var ly = Number.POSITIVE_INFINITY;
        for (var j=0; j<4; j++) {
            if (s.vs[j].x < lx) {
                lx = s.vs[j].x;
            }
            if (s.vs[j].y < ly) {
                ly = s.vs[j].y;
            }
        }
        s.x = lx;
        s.y = ly;
    }
}

function reflectSquomino(vs) {
    var lx = findLeastXInSquares(vs.squares);
    var cx = lx + vs.dv.x;
    convertSquaresToVertices(vs.squares);
    for (var i=0; i<vs.squares.length; i++) {
        var s = vs.squares[i];
        for (var j=0; j<4; j++) {
            s.vs[j].x = cx + (cx - s.vs[j].x);
        }
    }
    convertFromVerticesToSquares(vs.squares);
}

function rotateSquomino90Clockwise(vs) {
    var lx = findLeastXInSquares(vs.squares);
    var ly = findLeastYInSquares(vs.squares);
    var cx = lx + vs.dv.x;
    var cy = ly + vs.dv.y;
    var dx = -cx;
    var dy = -cy;
    moveSquomino(vs, dx, dy);
    convertSquaresToVertices(vs.squares);
    for (var i=0; i<vs.squares.length; i++) {
        var s = vs.squares[i];
        for (var j=0; j<4; j++) {
            var temp = s.vs[j].x;
            s.vs[j].x = -s.vs[j].y;
            s.vs[j].y = temp;
        }
    }
    convertFromVerticesToSquares(vs.squares);
    moveSquomino(vs, -dx, -dy);
    vs.dv = findSquominoDisplacementFromCenter(vs);
}

function convertVisualSquominoToChains(vs) {
    var chains = [];
    for (var i=0; i<vs.squares.length; i++) {
        vs.squares[i].visited = false;
    }
    findInitialHorizontalChainInSquomino(vs, chains);
    vs.chains = chains;
}

function findInitialHorizontalChainInSquomino(vs, chains) {
    var lx = Number.POSITIVE_INFINITY;
    var lxCand = [];
    for (var i=0; i<vs.squares.length; i++) {
        var s = vs.squares[i];
        if (approxEqual(s.x, lx)) {
            lxCand.push(s);
        } else if (s.x < lx) {
            lxCand = [s];
            lx = s.x;
        }
    }
    for (var i=0; i<lxCand.length; i++) {
        var squares = findContiguousHorizontalSquares(lxCand[i], vs.squares);
        if (squares.length > 1 || i === lxCand.length-1) {
            var chain = [];
            chains.push(chain);
            for (var j=0; j<squares.length; j++) {
                chain.push(squares[j].idx);
                findVerticalSquares(squares[j], vs.squares, chains);
            }
            return;
        }
    }
}

function findContiguousHorizontalSquares(sq, squares) {
    var res = [];
    for (var i=0; i<squares.length; i++) {
        var nsq = squares[i];
        if (approxEqual(sq.y, nsq.y)) {
            res.push(nsq);
        }
    }
    res.sort(function(a,b) {
        return a.x - b.x;
    });
    var i=0;
    for (; i<res.length; i++) {
        if (res[i] === sq) {
            break;
        }
    }
    var lower, upper;
    for (lower=i-1; lower>=0; lower--) {
        if (!approxEqual(res[lower+1].x-res[lower].sideLength, res[lower].x)) {
            break;
        }
    }
    if (lower === -1) {
        lower = 0;
    }
    for (upper=i+1; upper<res.length; upper++) {
        if (!approxEqual(res[upper-1].x+res[upper-1].sideLength, res[upper].x)) {
            break;
        }
    }
    if (upper === res.length) {
        upper = res.length-1;
    }
    return res.slice(lower,upper+1);
}

function findContiguousVerticalSquares(sq, squares) {
  var res = [];
    for (var i=0; i<squares.length; i++) {
        var nsq = squares[i];
        if (approxEqual(sq.x, nsq.x)) {
            res.push(nsq);
        }
    }
    res.sort(function(a,b) {
        return a.y - b.y;
    });
    var i=0;
    for (; i<res.length; i++) {
        if (res[i] === sq) {
            break;
        }
    }
    var lower, upper;
    for (lower=i-1; lower>=0; lower--) {
        if (!approxEqual(res[lower+1].y-res[lower].sideLength, res[lower].y)) {
            break;
        }
    }
    if (lower === -1) {
        lower = 0;
    }
    for (upper=i+1; upper<res.length; upper++) {
        if (!approxEqual(res[upper-1].y+res[upper-1].sideLength, res[upper].y)) {
            break;
        }
    }
    if (upper === res.length) {
        upper = res.length-1;
    }
    return res.slice(lower,upper+1);
}

function findVerticalSquares(sq, squares, chains) {
    sq.visited = true;
    var res = findContiguousVerticalSquares(sq, squares);
    if (res.length === 1) {
        return;
    }
    var chain = [];
    chains.push(chain);
    for (var i=0; i<res.length; i++) {
        chain.push(res[i].idx);
        if (!res[i].visited) {
            findHorizontalSquares(res[i], squares, chains);
        }
    }
}

function findHorizontalSquares(sq, squares, chains) {
    sq.visited = true;
    var res = findContiguousHorizontalSquares(sq, squares);
    if (res.length === 1) {
        return;
    }
    var chain = [];
    chains.push(chain);
    for (var i=0; i<res.length; i++) {
        chain.push(res[i].idx);
        if (!res[i].visited) {
            findVerticalSquares(res[i], squares, chains);
        }
    }
}