/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function doSplitPolys() {
    var toSplit = [];
    for (var i=0; i<polys.length; i++) {
        if (polys[i].selected) {
            toSplit.push(polys[i]);
        }
    }
    for (var i=0; i<toSplit.length; i++) {
        splitPoly(toSplit[i]);
    }
    if (toSplit.length > 0) {
        repaint();
    }
}

function splitPoly(poly) {
    var nSides = getNumSides(poly);
    if (nSides === 6) {
        splitHexagon(poly);
    } else if (nSides === 12) {
        splitDodecagon(poly);
    } else {
        poly.selected = false;
    }
}

function splitHexagon(hex) {
    // get center
    var p0 = hex.vs[0].p;
    var p3 = hex.vs[3].p;
    var cx = (p0.x + p3.x)/2;
    var cy = (p0.y + p3.y)/2;
    var cv = new Vertex(new Point(cx, cy));
    
    // get start angle of first triangle
    var angle = getAngle(cv.p, p0);
    
    deletePoly(hex);
    
    // new vertex must be placed after deletion
    // otherwise delete will remove new vertex since
    // there are no polygons connected to that vertex
    vs.push(cv);
    
    for (var i=0; i<6; i++) {
        placePoly(cv, '3', angle);
        angle += Math.PI/3;
        angle = normalizeAngle(angle);
    }
}

function splitDodecagon(dodec) {
    // save vs
    var vs = dodec.vs;
    
    // get center
    var p0 = vs[0].p;
    var p6 = vs[6].p;
    var cx = (p0.x + p6.x)/2;
    var cy = (p0.y + p6.y)/2;
    var cv = new Vertex(new Point(cx, cy));
    
    deletePoly(dodec);
    
    // find if vertices go clockwise or counter clockwise
    var cw = clockwise(vs[0], vs[1], cv);
    var placeTri = true;
    
    // saved square for placing hexagon
    var savedSq = null;
    
    // place squares and triangles
    for (var i=0; i<12; i++) {
        var typeStr = '4';
        var polyAngle = Math.PI/2;
        if (placeTri) {
            typeStr = '3';
            polyAngle = Math.PI/3;
        }
        var va = vs[i];
        var vb = (i === 11) ? vs[0] : vs[i+1];
        var angle = getAngle(va.p, vb.p);
        if (!cw) {
            angle -= polyAngle;
        }
        placePoly(vs[i], typeStr, angle);
        // remember a square
        if (!savedSq && !placeTri) {
            savedSq = polys[polys.length-1];
        }
        placeTri = !placeTri;
    }
    
    // place inner hexagon:
    // find edge to place triangle on
    var va = null, vb = null;
    var sl = distance(vs[0].p, vs[1].p);
    for (var i=0; i<4; i++) {
        if (approxEqual(distance(savedSq.vs[i].p, cv.p), sl)) {
            if (va) {
                assert(!vb, 'splitDodecagon: too many sq vs one side length from center');
                vb = savedSq.vs[i];
            } else {
                va = savedSq.vs[i];
            }
        }
    }
    assert(vb, 'splitDodecagon: did not find required sq vs');
    
    // determine if vertices are cw or ccw
    var cw = clockwise(va, vb, cv);
   
    // place hex
    var angle = getAngle(va.p, vb.p);
    if (!cw) {
        angle -= 2*Math.PI/3;
    }
    placePoly(va, '6', angle);
}