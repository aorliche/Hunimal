/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


// note "polys" variable is actually polyAngle object
function edgeTouchesPolygon(e, polyStr) {
    var polys = e.va.polys.concat(e.vb.polys);
    for (var i=0; i<polys.length; i++) {
        if (polys[i].poly.vs.length === parseInt(polyStr)) {
            return true;
        }
    }
    return false;
}

function expandBoard4612() {
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
            // edge is square edge
            if (edgeIsPolygonEdge(es[i], '4')) {
                // place dodecagon on edge
                if (edgeTouchesPolygon(es[i], '6')) {
                    var angle = edgeGetStartAngle(es[i], '12');
                    placePoly(es[i].va, '12', angle);
                    es[i].polys = getEdgePolys(es[i]);
                    es.splice(i,1);
                    i--;
                } // place hexagon on edge
                else if (edgeTouchesPolygon(es[i], '12')) {
                    var angle = edgeGetStartAngle(es[i], '6');
                    placePoly(es[i].va, '6', angle);
                    es[i].polys = getEdgePolys(es[i]);
                    es.splice(i,1);
                    i--;
                } else {
                    console.log('4.6.12: square edge not next to Hex or Dodec');
                }
            } // edge is hexagon edge
            else if (edgeIsPolygonEdge(es[i], '6')) {
                // place dodecagon on edge
                if (edgeTouchesPolygon(es[i], '4')) {
                    var angle = edgeGetStartAngle(es[i], '12');
                    placePoly(es[i].va, '12', angle);
                    es[i].polys = getEdgePolys(es[i]);
                    es.splice(i,1);
                    i--;
                } // place square on edge
                else if (edgeTouchesPolygon(es[i], '12')) {
                    var angle = edgeGetStartAngle(es[i], '4');
                    placePoly(es[i].va, '4', angle);
                    es[i].polys = getEdgePolys(es[i]);
                    es.splice(i,1);
                    i--;
                } else {
                    console.log('4.6.12: hex edge not next to Square or Dodec');
                }
            } // edge is dodecagon edge
            else if (edgeIsPolygonEdge(es[i], '12')) {
                // place hexagon on edge
                if (edgeTouchesPolygon(es[i], '4')) {
                    var angle = edgeGetStartAngle(es[i], '6');
                    placePoly(es[i].va, '6', angle);
                    es[i].polys = getEdgePolys(es[i]);
                    es.splice(i,1);
                    i--;
                } // place square on edge
                else if (edgeTouchesPolygon(es[i], '6')) {
                    var angle = edgeGetStartAngle(es[i], '4');
                    placePoly(es[i].va, '4', angle);
                    es[i].polys = getEdgePolys(es[i]);
                    es.splice(i,1);
                    i--;
                } else {
                    console.log('4.6.12: dodec edge not next to Square or Hex');
                }
            } else {
                console.log("Unknown edge in 4.6.12");
                console.log(es[i]);
            }
        }
    }
}

function tessellate4612() {
    placePoly(v, '4', deg2rad(0));
    placePoly(v, '6', deg2rad(90));
    placePoly(v, '12', deg2rad(210));
    
    for (var i=0; i<iter; i++) {
        expandBoard4612();
    }
}

