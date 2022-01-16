/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



function expandBoard4444() {
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
            var angle = edgeGetStartAngle(es[i], '4');
            placePoly(es[i].va, '4', angle);
            es[i].polys = getEdgePolys(es[i]);
            es.splice(i,1);
            i--;
        }
    }
}

function tessellate4444() {
    placePoly(v, '4', deg2rad(0));
    placePoly(v, '4', deg2rad(90));
    placePoly(v, '4', deg2rad(180));
    placePoly(v, '4', deg2rad(270));
    
    for (var i=0; i<iter; i++) {
        expandBoard4444();
    }
}
