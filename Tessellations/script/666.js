
function expandBoard666() {
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
            // place hexagon on edge
            var angle = edgeGetStartAngle(es[i], '6');
            placePoly(es[i].va, '6', angle);
            es[i].polys = getEdgePolys(es[i]);
            es.splice(i,1);
            i--;
        }
    }
}

function tessellate666() {
    placePoly(v, '6', deg2rad(0));
    placePoly(v, '6', deg2rad(120));
    placePoly(v, '6', deg2rad(240));
    
    for (var i=0; i<iter; i++) {
        expandBoard666();
    }
}
