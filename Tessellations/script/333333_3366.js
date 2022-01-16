
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
function tessellate333333_3366() {
    tessellate666();
    
    assert(polys[0]);
    
    const sl = getSideLength(polys[0]);
    const centers = [getPolyCenterPoint(polys[0])];
    const hexs = [polys[0]];
    const degs = [60, 120, 180, 240, 300, 360];
    const d = 3*sl;
    
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
    
    for (let i=0; i<hexs.length; i++) {
        splitPoly(hexs[i]);
    }
}
