/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function expandBoard3636() {
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
            // we may use up two edges (actually possibly more) with one polygon
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
                // place hexagon on edge
                var angle = edgeGetStartAngle(es[i], '6');
                placePoly(es[i].va, '6', angle);
                es[i].polys = getEdgePolys(es[i]);
                es.splice(i,1);
                i--;
            } // edge is hexagon edge
            else if (edgeIsPolygonEdge(es[i], '6')) {
                // place triangle on edge
                var angle = edgeGetStartAngle(es[i], '3');
                placePoly(es[i].va, '3', angle);
                es[i].polys = getEdgePolys(es[i]);
                es.splice(i,1);
                i--;
            } else {
                console.log("Unknown edge in 3.6.3.6");
                console.log(es[i]);
            }
        }
    }
}

function tessellate3636() {
    placePoly(v, '3', deg2rad(0));
    placePoly(v, '6', deg2rad(60));
    placePoly(v, '3', deg2rad(180));
    placePoly(v, '6', deg2rad(240));
 
    for (var i=0; i<iter; i++) {
        expandBoard3636();
    }
}

