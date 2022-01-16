/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function polyHasAdjacentTwoTriangles(poly) {
    var polys = getEdgeAdjacentPolys(poly);
    var nTri = 0;
    for (var i=0; i<polys.length; i++) {
        if (polys[i].vs.length === 3) {
            nTri++;
        }
    }
    return nTri === 2;
}

function polyHasAdjacentSquare(poly) {
    var polys = getEdgeAdjacentPolys(poly);
    for (var i=0; i<polys.length; i++) {
        if (polys[i].vs.length === 4) {
            return true;
        }
    }
    return false;
}

function squareEdgeIsOppositePoly(e, typeStr) {
    var nSides = parseInt(typeStr);
    assert(nSides > 0, "squareEdgeIsOppositePoly: bad number of sides for poly");
    var sq = e.polys[0];
    assert(sq.vs.length === 4, "squareEdgeIsOppositePoly: edge is not on square");
    var vs = [];
    for (var i=0; i<sq.vs.length; i++) {
        if (sq.vs[i] !== e.va && sq.vs[i] !== e.vb) {
            vs.push(sq.vs[i]);
        }
    }
    assert(vs.length === 2, "squareEdgeIsOppositePoly: bad vertices");
    var oe = new Edge(vs[0], vs[1]);
    oe.polys = getEdgePolys(oe);
    if (oe.polys.length === 2) {
        if (    (oe.polys[0].vs.length === 4 && oe.polys[1].vs.length === nSides)
             || (oe.polys[0].vs.length === nSides && oe.polys[1].vs.length === 4)) 
        {
            return true;
        }
    }
    return false;
}

function edgeHasNeighboringEdgeWhichIsPoly(e, typeStr) {
    var nSides = parseInt(typeStr);
    assert(nSides > 0, "edgeHasNeighboringEdgeWhichIsPoly: bad typeStr");
    assert(e.polys.length === 1, "edgeHasNeighboringEdgeWhichIsPoly: bad edge");
    var poly = e.polys[0];
    var polys = getEdgeAdjacentPolys(poly);
    var evs = [e.va, e.vb];
    for (var i=0; i<polys.length; i++) {
        var vs = getEquivVertices(evs, polys[i].vs);
        if (vs.length === 1) {
            if (polys[i].vs.length === nSides) {
                return true;
            }
        }
    }
    return false;
}

function expandBoard33344() {
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
            // edge is triangle edge
            if (edgeIsPolygonEdge(es[i], '3')) {
                assert(es[i].polys.length === 1, "expandBoard33344: too many polys");
                var tri = es[i].polys[0];
                // place square on edge
                if (polyHasAdjacentTwoTriangles(tri)) {
                    var angle = edgeGetStartAngle(es[i], '4');
                    placePoly(es[i].va, '4', angle);
                    es[i].polys = getEdgePolys(es[i]);
                    es.splice(i,1);
                    i--;
                }
                // place triangle on edge
                else if (polyHasAdjacentSquare(tri)) {
                    var angle = edgeGetStartAngle(es[i], '3');
                    placePoly(es[i].va, '3', angle);
                    es[i].polys = getEdgePolys(es[i]);
                    es.splice(i,1);
                    i--;
                }
            }
            // edge is square edge
            else if (edgeIsPolygonEdge(es[i], '4')) {
                // place square on edge
                if (squareEdgeIsOppositePoly(es[i], '4')) {
                    var angle = edgeGetStartAngle(es[i], '4');
                    placePoly(es[i].va, '4', angle);
                    es[i].polys = getEdgePolys(es[i]);
                    es.splice(i,1);
                    i--;
                }
                // place triangle on edge
                else if (squareEdgeIsOppositePoly(es[i], '3')) {
                    var angle = edgeGetStartAngle(es[i], '3');
                    placePoly(es[i].va, '3', angle);
                    es[i].polys = getEdgePolys(es[i]);
                    es.splice(i,1);
                    i--;
                }
                // place square on edge
                else if (edgeHasNeighboringEdgeWhichIsPoly(es[i], '3')) {
                    var angle = edgeGetStartAngle(es[i], '4');
                    placePoly(es[i].va, '4', angle);
                    es[i].polys = getEdgePolys(es[i]);
                    es.splice(i,1);
                    i--;
                }
                // place triangle on edge
                else if (edgeHasNeighboringEdgeWhichIsPoly(es[i], '4')) {
                    var angle = edgeGetStartAngle(es[i], '3');
                    placePoly(es[i].va, '3', angle);
                    es[i].polys = getEdgePolys(es[i]);
                    es.splice(i,1);
                    i--;
                }
            }
        }
    }
}

function tessellate33344() {
    placePoly(v, '4', deg2rad(0));
    placePoly(v, '4', deg2rad(90));
    placePoly(v, '3', deg2rad(180));
    placePoly(v, '3', deg2rad(240));
    placePoly(v, '3', deg2rad(300));
    
    for (var i=0; i<iter; i++) {
        expandBoard33344();
    }
}
