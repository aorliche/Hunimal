/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function doStretchMSP() {
    assert(selectedMSP, "doStretchMSP: selectedMSP is null");
    assert(selectedEdge, "doStretchMSP: selectedEdge is null");
    
    var n = parseInt(stretchNField.value);
    
    assert(n >= 1, "doStretchMSP: n < 1");
    
    stretchMSP(selectedMSP, selectedEdge, n);
}

function stretchMSP(msp, e, n) {
    if (n <= 0) {
        return;
    }
    
    // check whether edge is on edge of MSP
    if (!isVertexOnEdge(e[0], msp) || !isVertexOnEdge(e[1], msp)) {
        return;
    }
    
    var prevVs = getVerticesOneSideLengthFromVertex(e[0], msp);
    var nextVs = getVerticesOneSideLengthFromVertex(e[1], msp);
    
    var vs = prevVs.concat(nextVs);
    
    var v0;
    
    // find previous vertex to get parallel line
    for (var i=0; i<vs.length; i++) {
        if (equivVertices(e[0], vs[i]) || equivVertices(e[1], vs[i])) {
            continue;
        }
        if (!isVertexOnEdge(vs[i], msp)) {
            continue;
        }
        if (colinear(vs[i], e[0], e[1])) {
            continue;
        }
        if (oneSideLengthApart(vs[i], e[0], msp) 
                && !clockwise(vs[i], e[0], e[1])) {
            assert(!v0, "stretchMSP: multiple previous vs");
            v0 = vs[i];
        }
        if (oneSideLengthApart(vs[i], e[1], msp) 
                && !clockwise(vs[i], e[1], e[0])) {
            assert(!v0, "stretchMSP: multiple previous vs");
            v0 = vs[i];
            
            // need to switch order of vertices in edge
            var t = e[0];
            e[0] = e[1];
            e[1] = t;
        }
    }
    
    var vn = copyVertex(e[0]);
    vn.x += e[0].x - v0.x;
    vn.y += e[0].y - v0.y;
    
    var rvs = [e[1], e[0], vn];
    var r = buildRhombusFromThreeVs(rvs);
    
    stretchFromAddedRhombus(r, msp);
    
    stretchMSP(msp, [r.vs[2], r.vs[3]], n-1);
}

function stretchFromAddedRhombus(r, msp) {
    var nrs = [r];
    var rhombi = msp.rhombi;
    var holes = [];
    var nIter = 0;
    
    rhombi.push(r);
    addHoles(holes, r, rhombi);
    
    while (holes.length > 0) {
        shuffle(holes);
        var hole = holes.shift();
        
        fillHole(hole, rhombi);
        
        r = rhombi[rhombi.length-1];
        nrs.push(r);
        
        holes = cullHoles(holes, r);
        
        addHoles(holes, r, rhombi);
        
        assert((nIter++) < maxExpandIter, "stretchFromAddedRhombus: max iter exceeded");
    }
    
    colorRhombi(nrs);
    
    msp.polys = rhombi;
    msp.needDiag = true;
    msp.chains = buildChains(rhombi);
    updateBoundingRect(msp);
    
    repaint();
}