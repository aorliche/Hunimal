
var hexagonTopLeftPoints_33336;
var hexagonOutsideTopLeftPoints_33336;

// returns the top left points of the hexagons surrounding this hexagon
function getSurroundingHexagonTopLeftPoints_33336(pTopLeft) {
    let ix = pTopLeft.x;
    let iy = pTopLeft.y;
    let triHeight = Math.sqrt(3)/2*sideLength;
    return [
            {x: ix-0.5*sideLength, y: iy-3*triHeight},
            {x: ix+2*sideLength, y: iy-2*triHeight},
            {x: ix+2.5*sideLength, y: iy+triHeight},
            {x: ix+0.5*sideLength, y: iy+3*triHeight},
            {x: ix-2*sideLength, y: iy+2*triHeight},
            {x: ix-2.5*sideLength, y: iy-triHeight}];
}

// return true or false if point is in array
function pointInArray(p, arr) {
    for (let i=0; i<arr.length; i++) {
        if (equivPoints(p, arr[i])) {
            return true;
        }
    }
    return false;
}

// updates the outside top left points and top left points
function updateHexagonTopLeftPoints_33336() {
    let htlp = hexagonTopLeftPoints_33336;
    let hotlp = hexagonOutsideTopLeftPoints_33336;
    let allnp = [];
    
    for (let i=0; i<hotlp.length; i++) {
        let np = getSurroundingHexagonTopLeftPoints_33336(hotlp[i]);
        for (let j=0; j<np.length; j++) {
            if (!pointInArray(np[j], htlp)) {
                htlp.push(np[j]);
                allnp.push(np[j]);
            }
        }
    }
    
    hexagonOutsideTopLeftPoints_33336 = allnp;
}

// place hexagons at outside top left points
function placeHexagonsAtOutsideTopLeftPoints_33336() {
    let hotlp = hexagonOutsideTopLeftPoints_33336;
    
    for (let i=0; i<hotlp.length; i++) {
        let v = new Vertex(hotlp[i]);
        placePoly(v, '6', deg2rad(0));
    }
}

function expandBoard33336() {
    updateHexagonTopLeftPoints_33336();
    placeHexagonsAtOutsideTopLeftPoints_33336();
    
    for (let n=0; n<2; n++) {
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
                // place triangle on edge
                var angle = edgeGetStartAngle(es[i], '3');
                placePoly(es[i].va, '3', angle);
                es[i].polys = getEdgePolys(es[i]);
                es.splice(i,1);
                i--;
            }
        }
    }
}

function tessellate33336() {
    placePoly(v, '6', deg2rad(0));
    
    let p = copyPoint(v.p);
    
    hexagonTopLeftPoints_33336 = [p];
    hexagonOutsideTopLeftPoints_33336 = [p];

    
    for (var i=0; i<iter; i++) {
        expandBoard33336();
    }
}
