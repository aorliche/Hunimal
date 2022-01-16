/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function MSP(rhombi, chains, center, m, sideLength) {
    this.rhombi = rhombi;
    this.chains = chains;
    this.center = copyVertex(center);
    this.m = m;
    this.sideLength = sideLength;
    this.rect = padRectangle(getBoundingRectangle(rhombi), 5);
    this.quads = null;
    this.tris = null;
    this.polys = rhombi;
    this.needDiag = true;
}

// find the radius of an MSP
function findRadius(m, sideLength) {
    var diam = 0;
    for (var a=0; a<m; a++){
        diam += sideLength*Math.sin(a*Math.PI/m);
    }
    return diam/2;
}

function copyMSP(msp) {
    return loadMSP(JSON.stringify(msp));
}

function restoreIntegrity(msp) {
    var rhombi = msp.rhombi;
    var chains = msp.chains;
    
    // keep integrity between rhombi and chains
    for (var i=0; i<rhombi.length; i++) {
        replaceInChains(rhombi[i], chains);
    }
    
    // replace polys (keep integrity) simple fix
    msp.polys = msp.rhombi;
}

function loadMSP(json) {
    var msp = JSON.parse(json);
    restoreIntegrity(msp);
    return msp;
}

function replaceInChains(r, chains) {
    for (var i=0; i<chains.length; i++) {
        for (var j=0; j<chains[i].length; j++) {
            if (chains[i][j].idx === r.idx) {
                chains[i][j] = r;
            }
        }
    }
}

function translatePoint(p, dx, dy) {
    p.x += dx;
    p.y += dy;
}

function translatePoly(poly, dx, dy) {
    var vs = poly.vs;
    for (var i=0; i<vs.length; i++) {
        translatePoint(vs[i], dx, dy);
    }
    if (poly.center) {
        translatePoint(poly.center, dx, dy);
    }
}

function translateMSP(msp, dx, dy) {
    var rs = msp.rhombi;
    for (var i=0; i<rs.length; i++) {
        translatePoly(rs[i], dx, dy);
    }
    
    translatePoint(msp.center, dx, dy);
    translatePoint(msp.rect, dx, dy);
    
    if (msp.quads) {
        var quads = msp.quads;
        for (var i=0; i<quads.length; i++) {
            translatePoly(quads[i], dx, dy);
        }
    }
    
    if (msp.tris) {
        var tris = msp.tris;
        for (var i=0; i<tris.length; i++) {
            translatePoly(tris[i], dx, dy);
        }
    }
}

function zoomPoint(p, o, scale) {
    p.x = scale*(p.x-o.x)+o.x;
    p.y = scale*(p.y-o.y)+o.y;
}

function zoomPoly(poly, v, scale) {
    var vs = poly.vs;
    for (var i=0; i<vs.length; i++) {
        zoomPoint(vs[i], v, scale);
    }
    if (poly.center) {
        zoomPoint(poly.center, v, scale);
    }
}

function zoomMSP(msp, scale, point) {
    if (!point) {
        point = msp.center;
    } else {
        zoomPoint(msp.center, point, scale);
    }
    
    var rs = msp.rhombi;
    for (var i=0; i<rs.length; i++) {
        zoomPoly(rs[i], point, scale);
    }
    
    zoomRectangle(msp.rect, point, scale);
    
    // update side length
    msp.sideLength *= scale;
    
    if (msp.quads) {
        var quads = msp.quads;
        for (var i=0; i<quads.length; i++) {
            zoomPoly(quads[i], point, scale);
        }
    }
    
    if (msp.tris) {
        var tris = msp.tris;
        for (var i=0; i<tris.length; i++) {
            zoomPoly(tris[i], point, scale);
        }
    }
}

function doReflectX() {
    assert(selectedMSP, "doReflectX: selected msp is null");
    reflectX(selectedMSP);
    repaint();
}

function doReflectY() {
    assert(selectedMSP, "doReflectY: selected msp is null");
    reflectY(selectedMSP);
    repaint();
}

function reflectX(msp) {
    var allPolys = [msp.rhombi, msp.quads, msp.tris];
    var cx = msp.center.x;
    
    for (var i=0; i<allPolys.length; i++) {
        var polys = allPolys[i];
        if (!polys) {
            continue;
        }
        for (var j=0; j<polys.length; j++) {
            // update vs
            var vs = polys[j].vs;
            for (var k=0; k<vs.length; k++) {
                var x = vs[k].x;
                var y = vs[k].y;
                vs[k] = new Vertex(2*cx-x, y);
            }
            // update center
            var x = polys[j].center.x;
            polys[j].center.x = 2*cx-x;
        }
    }
}

function reflectY(msp) {
    var allPolys = [msp.rhombi, msp.quads, msp.tris];
    var cy = msp.center.y;
    
    for (var i=0; i<allPolys.length; i++) {
        var polys = allPolys[i];
        if (!polys) {
            continue;
        }
        for (var j=0; j<polys.length; j++) {
            // update vs
            var vs = polys[j].vs;
            for (var k=0; k<vs.length; k++) {
                var x = vs[k].x;
                var y = vs[k].y;
                vs[k] = new Vertex(x, 2*cy-y);
            }
            // update center
            var y = polys[j].center.y;
            polys[j].center.y = 2*cy-y;
        }
    }
}

function getOutsideRhombusHelper(c, r, d) {
    var n = 0;
    for (var i=0; i<r.vs.length; i++) {
        var nd = distance(c, r.vs[i]);
        if (approxEqual(d, nd)) {
            n++;
        } else {
            assert(nd < d, "getOutsideRhombusHelper: star MSP with even M");
        }
    }
    if (n >= 2) {
        return true;
    }
    return false;
}

// get leftmost outside rhombus with at least two vertices on edge of msp
function getOutsideRhombus(msp) {
    var lx = Number.POSITIVE_INFINITY;
    var candRs;
    var d;
    for (var i=0; i<msp.rhombi.length; i++) {
        var r = msp.rhombi[i];
        var vs = r.vs;
        var addedCandR = false;
        for (var j=0; j<vs.length; j++) {
            if (approxEqual(vs[j].x, lx) && !addedCandR) {
                candRs.push(r);
                addedCandR = true;
            } else if (vs[j].x < lx) {
                candRs = [r];
                d = distance(vs[j], msp.center);
                lx = vs[j].x;
            }
        }
    }
    var r = null;
    for (var i=0; i<candRs.length; i++) {
        if (getOutsideRhombusHelper(msp.center, candRs[i], d)) {
            r = candRs[i];
            break;
        }
    }
    assert(r, "getOutsideRhombus: no rhombus on the outside");
    return r;
}

function doRotate(cw) {
    assert(selectedMSP, "doRotate: selectedMSP is null");
    
    var hsl = parseInt(rotateHSLField.value);
    assert(hsl > 0, "doRotate: hsl < 1");
    
    // get "outside" edge of first rhombus
//    var r = selectedMSP.rhombi[0];
    var r = getOutsideRhombus(selectedMSP);
    var c = selectedMSP.center;
    var vsDists = [];
    for (var i=0; i<r.vs.length; i++) {
        var d = distance(c, r.vs[i]);
        vsDists.push([r.vs[i], d, i]);
    }
    vsDists.sort(function (a,b) {return b[1]-a[1];});
    var a = distance(c, vsDists[0][0]);
    var ap = distance(c, vsDists[1][0]);
    
    assert(approxEqual(a, ap), "doRotate: lengths to center aren't equal 1");
    
    // three vertices on edge, equal dist to center
    var indDist = Math.abs(vsDists[0][2]-vsDists[1][2]);
    if (indDist !== 1 && indDist !== 3) {
        vsDists[0][0] = vsDists[2][0];
        a = distance(c, vsDists[0][0]);
    }
    
    assert(approxEqual(a, ap), "doRotate: lengths to center aren't equal 2");
    
    var sl = distance(vsDists[0][0], vsDists[1][0]);
    var theta = Math.acos(1-((sl*sl)/(2*a*a)));
    
    if (cw) {
        rotateMSP(selectedMSP, hsl*0.5*theta);
    } else {
        rotateMSP(selectedMSP, -hsl*0.5*theta);
    }
    
    repaint();
}

function rotatePoint(p, theta) {
    var xp = p.x*Math.cos(theta)-p.y*Math.sin(theta);
    var yp = p.x*Math.sin(theta)+p.y*Math.cos(theta);
    p.x = xp;
    p.y = yp;
}

function rotatePoly(poly, theta) {
    var vs = poly.vs;
    for (var i=0; i<vs.length; i++) {
        rotatePoint(vs[i], theta);
    }
    if (poly.center) {
        rotatePoint(poly.center, theta);
    }
}

function rotateMSP(msp, theta) {
    // translate to center at (0,0)
    var dx = msp.center.x;
    var dy = msp.center.y;
    
    translateMSP(msp, -dx, -dy);
    
    // rotate
    var allPolys = [msp.rhombi, msp.quads, msp.tris];
    for (var i=0; i<allPolys.length; i++) {
        var polys = allPolys[i];
        if (!polys) {
            continue;
        }
        for (var j=0; j<polys.length; j++) {
            rotatePoly(polys[j], theta);
        }
    }
    
    updateBoundingRect(msp);
    
    // translate back after rotation
    translateMSP(msp, dx, dy);
}

function saveMSP() {
    assert(selectedMSP, "saveMSP: no selected MSP");
    
    var mspCopy = copyMSP(selectedMSP);
    
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    var a = document.createElement("a");
    
    a.appendChild(document.createTextNode("Saved MSP " + (savedStateIdx++)));
    a.addEventListener("click", createRestoreSavedStateFunction(mspCopy), false);
    
    td.appendChild(a);
    tr.appendChild(td);
    
    td = document.createElement("td");
    a = document.createElement("a");
    
    a.appendChild(document.createTextNode("Remove"));
    a.addEventListener("click", createRemoveSavedStatesTableRowFunction(tr), false);
    
    td.appendChild(a);
    tr.appendChild(td);
    
    td = document.createElement("td");
    a = document.createElement("a");
    
    a.appendChild(document.createTextNode("Save to File"));
    a.addEventListener("click", createSaveToFileFunction(mspCopy), false);
    
    td.appendChild(a);
    tr.appendChild(td);
    
    savedStatesTable.appendChild(tr);
}

function createRestoreSavedStateFunction(mspCopy) {
    return function() {
        msps.push(copyMSP(mspCopy));
        selectedMSP = msps[msps.length-1];
        repaint();
    };
}

function createRemoveSavedStatesTableRowFunction(tr) {
    return function() {
        savedStatesTable.removeChild(tr);
    };
}

function createSaveToFileFunction(mspCopy) {
    return function() {
        var text = JSON.stringify(mspCopy);
        var file = new Blob([text], {type: "application/octet-stream"});
        var a = document.createElement("a");
        var url = URL.createObjectURL(file);
        a.href = url;
        a.download = "msp.msp";
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    };
}

function selectMSP(p) {
    for (var i=msps.length-1; i>=0; i--) {
        var msp = msps[i];
        if (!rectangleContainsPoint(msp.rect, p)) {
            continue;
        }
        var r = getRhombusAtCoords(msp.rhombi, p);
        if (r !== null) {
            // move msps down to make room for new top msp
            for (var j=i; j<msps.length-1; j++) {
                msps[j] = msps[j+1];
            }
            msps[msps.length-1] = msp;
            selectedMSP = msp;
            return;
        }
    }
    selectedMSP = null;
}

function selectMultiple(p) {
    for (var i=msps.length-1; i>=0; i--) {
        var msp = msps[i];
        if (!rectangleContainsPoint(msp.rect, p)) {
            continue;
        }
        var r = getRhombusAtCoords(msp.rhombi, p);
        if (r !== null) {
            msp.selected = !msp.selected;
            return;
        }
    }
}

function deleteMSP() {
    if (!selectedMSP) {
        return;
    }
    var found = false;
    for (var i=0; i<msps.length; i++) {
        if (msps[i] === selectedMSP) {
            msps.splice(i,1);
            found = true;
            break;
        }
    }
    assert(found, "deleteMSP");
    selectedMSP = null;
    repaint();
}

function getPolyAtCoords(msp, v) {
    return getRhombusAtCoords(msp.polys, v);
}

function getRhombusAtCoords(rhombi, v) {
    for (var i=0; i<rhombi.length; i++) {
        if (contains(rhombi[i].vs, v)) {
            return rhombi[i];
        }
    }
    return null;
}

var vertexCheckDist = 1e-4;

function isVertexOnEdge(v, msp) {
    var vc1 = new Vertex(v.x+vertexCheckDist, v.y);
    var vc2 = new Vertex(v.x-vertexCheckDist, v.y);
    return getRhombusAtCoords(msp.rhombi, vc1) === null 
            || getRhombusAtCoords(msp.rhombi, vc2) === null;
}

function getVerticesOneSideLengthFromVertex(v, msp) {
    var rs = msp.rhombi;
    var vs = [];
    for (var i=0; i<rs.length; i++) {
        for (var j=0; j<4; j++) {
            var candv = rs[i].vs[j];
            if (approxEqual(distance(v, candv), msp.sideLength) 
                    && !vertexInArray(candv, vs)) {
                vs.push(candv);
            }
        }
    }
    return vs;
}

function findRhombiContainingVertex(v, msp) {
    var rhombi = msp.rhombi;
    var rs = [];
    for (var i=0; i<rhombi.length; i++) {
        var cr = rhombi[i];
        for (var j=0; j<4; j++) {
            if (equivVertices(v, cr.vs[j])) {
                rs.push(cr);
            }
        }
    }
    return rs;
}

function rhombiHaveVertexInCommon(r1, r2, v) {
    var r1has = false, r2has = false;
    for (var i=0; i<4; i++) {
        if (equivVertices(v, r1.vs[i])) {
            r1has = true;
        }
    }
    for (var i=0; i<4; i++) {
        if (equivVertices(v, r2.vs[i])) {
            r2has = true;
        }
    }
    return r1has && r2has;
}

function updateBoundingRect(msp) {
    msp.rect = padRectangle(getBoundingRectangle(msp.rhombi), 5);
}