function placeTriangle_31212(e) {
    let poly = e.polys[0];
    let npnv = getPolyNeighbors(poly);
    let np = npnv[0];
    let nv = npnv[1];
    assert(np.length >= 1, "poly has no neighbors");
    
    let vLowIdx = poly.vs.indexOf(e.va);
    let vHighIdx = poly.vs.indexOf(e.vb);
    
    assert(vLowIdx >= 0 && vHighIdx >=0, "failed to find indices");
    assert(vLowIdx !== vHighIdx, "same indices");
    
    if (vLowIdx > vHighIdx) {
        let temp = vLowIdx;
        vLowIdx = vHighIdx;
        vHighIdx = temp;
    }
    
    if (vLowIdx === 0 && vHighIdx === poly.vs.length-1) {
        vLowIdx = vHighIdx;
        vHighIdx = 0;
    }
    
    // find neighbor that shares an edge, i.e. two vertices
    let nvelt = null;
    let npoly = null;
    
    for (let i=0; i<nv.length; i++) {
        assert(nv[i].length <= 2, "bad length in nv element");
        if (nv[i].length === 2) {
            nvelt = nv[i];
            npoly = np[i];
            break;
        }
    }
    assert(nvelt, "failed to find neighbor sharing edge");
    
    let vnLowIdx = poly.vs.indexOf(nvelt[0]);
    let vnHighIdx = poly.vs.indexOf(nvelt[1]);
    
    assert(vnLowIdx >= 0 && vnHighIdx >=0, "failed to find neighbor indices");
    assert(vnLowIdx !== vnHighIdx, "same neighbor indices");
    
    if (vnLowIdx > vnHighIdx) {
        let temp = vnLowIdx;
        vnLowIdx = vnHighIdx;
        vnHighIdx = temp;
    }
    
    if (vnLowIdx === 0 && vnHighIdx === poly.vs.length-1) {
        vnLowIdx = vnHighIdx;
        vnHighIdx = 0;
    }
    
    let dist = (vLowIdx > vnHighIdx) ? vLowIdx-vnHighIdx : vnLowIdx-vHighIdx;
    
    assert(dist >= 0, "negative distance");
    
    if (npoly.vs.length === 3) {
        return dist%2 === 1;
    } else {
        return dist%2 === 0;
    }
}

function expandBoard31212() {
    var es = getOuterEdges();
    var count = 0;
    
    while (es.length > 0) {
        if (count++ > 5) {
            console.log("expandBoard iterations exceeded");
            console.log("unfilled edges are:");
            for (var i=0; i<es.length; i++) {
                console.log("" + es[i].va.vIdx + "," + es[i].vb.vIdx);
            }
            console.log(es);
            return;
        }
        for (var i=0; i<es.length; i++) {
            // we may use up two edges with one polygon
            // in this case, need to remove extra edge from external edges array
            es[i].polys = getEdgePolys(es[i]);
            if (es[i].polys.length === 2) {
                es.splice(i,1);
                i--;
                continue;
            } else if (es[i].polys.length !== 1) {
                console.log("bad number of polygons for edge " 
                        + es[i].va.vIdx + "," + es[i].vb.vIdx);
            }
            // place a dodecagon on triangle edge
            if (edgeIsPolygonEdge(es[i], '3')) { 
                var angle = edgeGetStartAngle(es[i], '12');
                placePoly(es[i].va, '12', angle);
                es[i].polys = getEdgePolys(es[i]);
                es.splice(i,1);
                i--;
            // edge is dodecagon edge
            // place either a triangle
            } else if (placeTriangle_31212(es[i])) {
                var angle = edgeGetStartAngle(es[i], '3');
                placePoly(es[i].va, '3', angle);
                es[i].polys = getEdgePolys(es[i]);
                es.splice(i,1);
                i--;
            // or a dodecagon
            } else {
                var angle = edgeGetStartAngle(es[i], '12');
                placePoly(es[i].va, '12', angle);
                es[i].polys = getEdgePolys(es[i]);
                es.splice(i,1);
                i--;
            }
        }
    }
}

function tessellate31212() {
    placePoly(v, '3', deg2rad(0));
    placePoly(v, '12', deg2rad(60));
    placePoly(v, '12', deg2rad(210));
    
    for (var i=0; i<iter; i++) {
        expandBoard31212();
    }
}
