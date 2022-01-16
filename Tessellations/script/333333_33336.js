
// strategy here is to tessellate with 666 then selectively split the hexagons
// so that there is no hexagon next to another hexagon

// polyType is number of sides or number of vertices
// getPolyNeighbors in 3366.js
/*function polyNumEdgesSharedWithPolyType(poly, polyType) {
    let npnv = getPolyNeighbors(poly);
    let np = npnv[0];
    let nv = npnv[1];
    let count = 0;
    for (let i=0; i<np.length; i++) {
        if (nv[i].length === 2 && np[i].vs.length === polyType) {
            count++;
        }
    }
    return count;
}*/

function getSideLength(poly) {
    return distance(poly.vs[0].p, poly.vs[1].p);
}

// getPolyCenterPoint in 3366.js
function tessellate333333_33336(ver2) {
    tessellate666();
    
    assert(polys[0]);
    const sl = getSideLength(polys[0]);
    const centers = [getPolyCenterPoint(polys[0])];
    const hexs = [polys[0]];
    let degs, d;
    
    if (ver2) {
        degs = [0, 60, 120, 180, 240, 300];
        d = 3*sl;
    } else {
        degs = [30, 90, 150, 210, 270, 330];
        d = 2*Math.sqrt(3)*sl;
    }
    
    function getPoint(center, angle) {
        return new Point(center.x + d*Math.cos(angle), center.y + d*Math.sin(angle));
    }
    
    let updateCentersIt = 0;
    
    function updateCenters(center) {
        if (updateCentersIt++ > 50) {
            throw new Error("Update centers recursion limit exceeded");
        }
        
        const cand = [];
        cand[0] = getPoint(center, deg2rad(degs[0]));
        cand[1] = getPoint(center, deg2rad(degs[1]));
        cand[2] = getPoint(center, deg2rad(degs[2]));
        cand[3] = getPoint(center, deg2rad(degs[3]));
        cand[4] = getPoint(center, deg2rad(degs[4]));
        cand[5] = getPoint(center, deg2rad(degs[5]));
outer:
        for (let i=0; i<6; i++) {
            for (let j=0; j<centers.length; j++) {
                if (equivPoints(cand[i], centers[j])) {
                    continue outer;
                }
            }
            for (let j=0; j<polys.length; j++) {
                if (contains(polys[j], cand[i])) {
                    hexs.push(polys[j]);
                    centers.push(cand[i]);
                    updateCenters(cand[i]);
                    break;
                }
            }
        }
    }
    
    updateCenters(centers[0]);
        
    const savPolys = shallowCopyArray(polys);
outer2:
    for (let i=0; i<savPolys.length; i++) {
        for (let j=0; j<hexs.length; j++) {
            if (savPolys[i] === hexs[j]) {
                continue outer2;
            }
        }
        splitPoly(savPolys[i]);
    }

    /*while (true) {
        let a = [];
        for (let i=0; i<polys.length; i++) {
            if (polys[i].vs.length === 6) {
                a.push([polys[i], polyNumEdgesSharedWithPolyType(polys[i], 6)]);
            }
        }
        if (a.length === 0) {
            break;
        }
        a.sort(function (a,b) {
            return b[1]-a[1]; // descending order
        });
        if (a[0][1] === 0) {
            break;
        }
        splitPoly(a[0][0]);
    }*/
}
