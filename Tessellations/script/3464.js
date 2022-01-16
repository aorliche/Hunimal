/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// given an edge, get the other two vertices
function getOtherTwoSquareVertices(e) {
    assert(e.polys.length === 1, "getOtherTwoSquareVertices: more than one poly");
    assert(e.polys[0].vs.length === 4, "getOtherTwoSquareVertices: not a square");
    
    var vs = e.polys[0].vs;
    var othervs = [];
    for (var i=0; i<vs.length; i++) {
        if (!pointIsOnEdge(e, vs[i].p)) {
            othervs.push(vs[i]);
        }
    }
    assert(othervs.length === 2, "getOtherTwoSquareVertices: not two other vs");
    
    return othervs;
}

function edgeIsOppositeHexagonEdge(e) {
    var othervs = getOtherTwoSquareVertices(e);
    var polys = getCommonPolygons(othervs[0], othervs[1]);
    if (polys.length === 2) {
        return polys[0].vs.length === 6 || polys[1].vs.length === 6;
    }
    return false;
}

function expandBoard3464() {
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
            // place a square on edge
            if (edgeIsPolygonEdge(es[i], '6')) {
                var angle = edgeGetStartAngle(es[i], '4');
                placePoly(es[i].va, '4', angle);
                es[i].polys = getEdgePolys(es[i]);
                es.splice(i,1);
                i--;
            }
            // place a square on edge
            else if (edgeIsPolygonEdge(es[i], '3')) {
                var angle = edgeGetStartAngle(es[i], '4');
                placePoly(es[i].va, '4', angle);
                es[i].polys = getEdgePolys(es[i]);
                es.splice(i,1);
                i--;
            }
            // place a hexagon or triangle on edge
            else if (edgeIsPolygonEdge(es[i], '4')) {
                // place a hexagon
                if (edgeIsOppositeHexagonEdge(es[i])) {
                    var angle = edgeGetStartAngle(es[i], '6');
                    placePoly(es[i].va, '6', angle);
                    es[i].polys = getEdgePolys(es[i]);
                    es.splice(i,1);
                    i--;
                } // place a triangle 
                else {
                    var angle = edgeGetStartAngle(es[i], '3');
                    placePoly(es[i].va, '3', angle);
                    es[i].polys = getEdgePolys(es[i]);
                    es.splice(i,1);
                    i--;
                }
            } else {
                console.log("Unknown edge in 3.4.6.4");
                console.log(es[i]);
            }
        }
    }
}

function tessellate3464() {
    placePoly(v, '3', deg2rad(30));
    placePoly(v, '4', deg2rad(90));
    placePoly(v, '6', deg2rad(180));
    placePoly(v, '4', deg2rad(300));
    
    for (var i=0; i<iter; i++) {
        expandBoard3464();
    }
}
