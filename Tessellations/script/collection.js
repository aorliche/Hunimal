const TC_POLY_COLOR = "red";
let debugPoints = [];

function collectionFromSelected(polys, symType) {
    function vsConnectOneSelectedPolygons(vprev, vnext) {
        const ps1 = vprev.polys;
        const ps2 = vnext.polys;
        let count = 0;
        for (let i=0; i<ps1.length; i++) {
            for (let j=0; j<ps2.length; j++) {
                const p1 = ps1[i].poly;
                const p2 = ps2[j].poly;
                if (p1.selected && p2.selected && p1 === p2) {
                    if (++count === 2) {
                        return false;
                    }
                }
            }
        }
        return count === 1;
    }
    
    // get all vertices in polys as well as
    // the top left vertex
    const vs = [];
    let topLeft = null;
    let minLeft = Infinity;
    
    for (let i=0; i<polys.length; i++) {
        for (let j=0; j<polys[i].vs.length; j++) {
            const v = polys[i].vs[j];
            if (!vs.includes(v)) {
                vs.push(v);
                const min = v.p.x + v.p.y;
                if (min < minLeft) {
                    topLeft = v;
                    minLeft = min;
                }
            }
        }
    }
    
    // make ordered array of vertices that go around 
    // the collection (no inside vertices)
    const ovs = [topLeft];
    const d = distance(polys[0].vs[0].p, polys[0].vs[1].p);
    let vnext = null;
        
    while (true) {
        for (let i=0; i<vs.length; i++) {
            // don't go backward
            if (vs[i] === ovs[ovs.length-2]) {
                continue;
            }
            if (approxEqual(d, distance(ovs[ovs.length-1].p, vs[i].p))) {
                if (vsConnectOneSelectedPolygons(ovs[ovs.length-1], vs[i])) {
                    vnext = vs[i];
                    break;
                }
            }
        }
        if (ovs.includes(vnext)) {
            break;
        }
        ovs.push(vnext);
    }
    
    assert(ovs.length > 1, "Ordered vertices length of 1");
    assert(vnext === topLeft, "Did not get back to top left");
    assert(ovs.length % 2 === 0, "Odd number of ordered vertices");
    
    // hex symmetry first, then try rectangular symmetry
    
    // for hex symmetry, express things in max number of sides, this is simpler than max vertices
    const maxAsides = (ovs.length - 4) / 2;
    
    function makeVector(ovs, a, b) {
        return {
            x: ovs[a%ovs.length].p.x - ovs[b%ovs.length].p.x,
            y: ovs[a%ovs.length].p.y - ovs[b%ovs.length].p.y
        }
    }
    
    function negateVector(v) {
        return {x: -v.x, y: -v.y};
    }
    
    function addVectors(v1, v2) {
        return {x: v1.x+v2.x, y: v1.y+v2.y};
    }
    
    // hex symmetry
    for (let i=0; i<ovs.length && (!symType || symType === "hex"); i++) {
        for (let a=1; a<=maxAsides; a++) {
            const maxBsides = (ovs.length - 2*a - 2) / 2;
            nextB:
            for (let b=1; b<=maxBsides; b++) {
                const c = (ovs.length - 2*a - 2*b) / 2;
                // now do things in terms of vertices
                // side 1 and 4 (a and opposite of a):
                // go forward along side 1 and backward along side 4
                for (let x=i, y=i+2*a+b+c; x<i+a; x++, y--) {
                    if (!similar(ovs, x, y)) {
                        continue nextB;
                    }
                }
                // side 2 and 5 (b and opposite of b):
                for (let x=i+a, y=i+2*a+2*b+c; x<i+a+b; x++, y--) {
                    if (!similar(ovs, x, y)) {
                        continue nextB;
                    }
                }
                // side 3 and 6 (c and opposite of c):
                for (let x=i+a+b, y=i+ovs.length; x<i+a+b+c; x++, y--) {
                    if (!similar(ovs, x, y)) {
                        continue nextB;
                    }
                }
                // we get here if we found a hexagonal boundary
                // instead of creating the six sides, we just calculate
                // the offsets to the six surrounding unit cells
                
                //const sides6 = [[],[],[],[],[],[]];
                const vecs = [];
                vecs[0] = makeVector(ovs, i, i+a+b);
                vecs[1] = makeVector(ovs, i, i+2*a+b+c);
                vecs[2] = negateVector(vecs[0]);
                vecs[3] = negateVector(vecs[1]);
                vecs[4] = addVectors(vecs[0], vecs[3]);
                vecs[5] = addVectors(vecs[2], vecs[1]);
                
                return new Collection3(vecs, ovs[i].p, polys);
            }
        }
    }
    
    // rectangular symmetry was done first and is more confusing and less elegant than it should be
    // create North, West, South, East sides
    const maxA = ovs.length/2;
    
    /*function slope(v1, v2) {
        assert(v1 !== v2, "Equiv vertices in slope");
        var m = (v1.p.y-v2.p.y)/(v1.p.x-v2.p.x);
        if (m > 100) {
            m = Infinity;
        } else if (m < -100) {
            m = -Infinity;
        }
        return m;
    }*/
    
    function similar(ovs, k, l) {
        const va1 = ovs[k%ovs.length];
        const va2 = ovs[(k+1)%ovs.length];
        const vb1 = ovs[l%ovs.length];
        const vb2 = ovs[(l-1)%ovs.length];
        return approxEqual(va1.p.x-va2.p.x, vb1.p.x-vb2.p.x) && 
                approxEqual(va1.p.y-va2.p.y, vb1.p.y-vb2.p.y);
    }
    
    // rectangular symmetry
    for (let i=0; i<ovs.length && (!symType || symType === "square"); i++) {
        nextA:
        for (let a=2; a<=maxA; a++) {
            const b = (ovs.length+4-2*a)/2;
            for (let j=0, k=i, l=i+2*a+b-3; j<a-1; j++, k++, l--) {
                if (!similar(ovs, k, l)) {
                    continue nextA;
                }
            }
            for (let j=0, k=i+a-1, l=i+2*a+2*b-4; j<b-1; j++, k++, l--) {
                if (!similar(ovs, k, l)) {
                    continue nextA;
                }
            }
            const en = [];
            const ew = [];
            const es = [];
            const ee = [];
            for (let j=0, k=i, l=i+a+b-2; j<a; j++, k++, l++) {
                en[j] = ovs[k%ovs.length];
                es[j] = ovs[l%ovs.length];
            }
            for (let j=0, k=i+a-1, l=i+2*a+b-3; j<b; j++, k++, l++) {
                ee[j] = ovs[k%ovs.length];
                ew[j] = ovs[l%ovs.length];
            }
            return new Collection2(en, es, ee, ew, polys);
        }
    }
    
    assert(false, "Did not find collection");
}

function tessellateCollectionHexSymmetry(col, nIter) {
    const orig = col.orig;
    let points = [orig];
    const placedPoints = [];
    
    function inPlacedPoints(p) {
        for (let i=0; i<placedPoints.length; i++) {
            if (equivPoints(placedPoints[i], p)) {
                return true;
            }
        }
        return false;
    }
    
    function expandPoints() {
        const newPoints = [];
        for (let i=0; i<points.length; i++) {
            const p = points[i];
            for (let j=0; j<col.vecs.length; j++) {
                const np = new Point(p.x+col.vecs[j].x, p.y+col.vecs[j].y);
                if (!inPlacedPoints(np)) {
                    newPoints.push(np);
                    placedPoints.push(np);
                }
            }
            placedPoints.push(p);
        }
        points = newPoints;
    }
    
    function placeCopy(poly, point) {
        const dx = point.x-orig.x;
        const dy = point.y-orig.y;
        const ov = poly.vs[0];
        let angle;
        for (let i=0; i<ov.polys.length; i++) {
            if (ov.polys[i].poly === poly) {
                angle = ov.polys[i].angle;
            }
        }
        assert(angle || angle === 0, "Failed to find angle for poly");
        const v = new Vertex(new Point(ov.p.x+dx, ov.p.y+dy));
        placePoly(v, poly.vs.length, angle);
    }
    
    for (let i=0; i<nIter; i++) {
        expandPoints();
        //debugPoints = debugPoints.concat(points);
        for (let j=0; j<points.length; j++) {
            for (let k=0; k<col.polys.length; k++) {
                placeCopy(col.polys[k], points[j]);
            }
        }
    }
    //console.log(debugPoints);
    repaint();
}

function tessellateCollection(col, nIter) {
    // remove all polys not part of the collection
    const polysCopy = shallowCopyArray(polys);
    for (let i=0; i<polysCopy.length; i++) {
        if (!col.polys.includes(polysCopy[i])) {
            deletePoly(polysCopy[i]);
        }
    }
    
    if (col.hexSymmetry) {
        tessellateCollectionHexSymmetry(col, nIter);
        return;
    }
    
    const NSdx = col.boundary.nSide[0].p.x - col.boundary.wSide[0].p.x;
    const NSdy = col.boundary.nSide[0].p.y - col.boundary.wSide[0].p.y;
    const WEdx = col.boundary.nSide[0].p.x - col.boundary.eSide[0].p.x;
    const WEdy = col.boundary.nSide[0].p.y - col.boundary.eSide[0].p.y;
    
    const orig = new Point(col.boundary.nSide[0].p.x, col.boundary.nSide[0].p.y);
    let points = [orig];
    const placedPoints = [];
    
    function inPlacedPoints(p) {
        for (let i=0; i<placedPoints.length; i++) {
            if (equivPoints(placedPoints[i], p)) {
                return true;
            }
        }
        return false;
    }
    
    function expandPoints() {
        const newPoints = [];
        for (let i=0; i<points.length; i++) {
            const p = points[i];
            const pN = new Point(p.x-NSdx, p.y-NSdy);
            const pS = new Point(p.x+NSdx, p.y+NSdy);
            const pE = new Point(p.x-WEdx, p.y-WEdy);
            const pW = new Point(p.x+WEdx, p.y+WEdy);
            if (!inPlacedPoints(pN)) {
                newPoints.push(pN);
                placedPoints.push(pN);
            }
            if (!inPlacedPoints(pS)) {
                newPoints.push(pS);
                placedPoints.push(pS);
            }
            if (!inPlacedPoints(pE)) {
                newPoints.push(pE);
                placedPoints.push(pE);
            }
            if (!inPlacedPoints(pW)) {
                newPoints.push(pW);
                placedPoints.push(pW);
            }
            placedPoints.push(p);
        }
        points = newPoints;
    }
    
    function placeCopy(poly, point) {
        const dx = point.x-orig.x;
        const dy = point.y-orig.y;
        const ov = poly.vs[0];
        let angle;
        for (let i=0; i<ov.polys.length; i++) {
            if (ov.polys[i].poly === poly) {
                angle = ov.polys[i].angle;
            }
        }
        assert(angle || angle === 0, "Failed to find angle for poly");
        const v = new Vertex(new Point(ov.p.x+dx, ov.p.y+dy));
        placePoly(v, poly.vs.length, angle);
    }
    
    for (let i=0; i<nIter; i++) {
        expandPoints();
        //debugPoints = debugPoints.concat(points);
        for (let j=0; j<points.length; j++) {
            for (let k=0; k<col.polys.length; k++) {
                placeCopy(col.polys[k], points[j]);
            }
        }
    }
    //console.log(debugPoints);
    repaint();
}

function Collection2(en, es, ee, ew, polys) {
    this.boundary = {
        nSide: en,
        sSide: es,
        eSide: ee,
        wSide: ew
    };
    this.polys = polys;
    this.hexSymmetry = false;
}

function Collection3(vecs, orig, polys) {
    this.vecs = vecs;
    this.orig = orig;
    this.polys = polys;
    this.hexSymmetry = true;
}

function Collection(en, es, ee, ew) {
    this.boundary = new CollectionBoundary(en, es, ee, ew);
    this.polys = [];
    for (let i=0; i<polys.length; i++) {
        const polyvs = polys[i].vs;
        let part = true;
        for (let j=0; j<polyvs.length; j++) {
            if (!contains(this.boundary, polyvs[j].p) 
                    && !onBoundary(this.boundary, polyvs[j])) {
                part = false;
                break;
            }
        }
        if (part) {
            //polys[i].color = TC_POLY_COLOR;
            this.polys.push(polys[i]);
        }
    }
    //repaint();
}

function onBoundary(boundary, v) {
    for (let i=0; i<boundary.vs.length; i++) {
        if (v === boundary.vs[i]) {
            return true;
        }
    }
    return false;
}

function CollectionBoundary(en, es, ee, ew) {
    this.nSide = makeBoundarySide(en);
    this.sSide = makeBoundarySide(es);
    this.eSide = makeBoundarySide(ee);
    this.wSide = makeBoundarySide(ew);
    
    assert(this.nSide.length === this.sSide.length, "North and south side lengths differ");
    assert(this.eSide.length === this.wSide.length, "East and west side lengths differ");
    
    // north side left-to-right
    if (this.nSide[0].p.x > this.nSide[this.nSide.length-1].p.x) {
        this.nSide.reverse();
    }
    // east side top-to-bottom
    if (this.eSide[0].p.y > this.eSide[this.eSide.length-1].p.y) {
        this.eSide.reverse();
    }
    // south side right-to-left
    if (this.sSide[0].p.x < this.sSide[this.sSide.length-1].p.x) {
        this.sSide.reverse();
    }
    // west side bottom-to-top
    if (this.wSide[0].p.y < this.wSide[this.wSide.length-1].p.y) {
        this.wSide.reverse();
    }
    
    // all connected
    assert(this.nSide[this.nSide.length-1] === this.eSide[0], "North and east side connection");
    assert(this.eSide[this.eSide.length-1] === this.sSide[0], "East and south side connection");
    assert(this.sSide[this.sSide.length-1] === this.wSide[0], "South and west side connection");
    assert(this.wSide[this.wSide.length-1] === this.nSide[0], "West and north side connection");
    
    const sides = [this.nSide, this.eSide, this.sSide, this.wSide];
    
    this.vs = [];
    
    for (let i=0; i<sides.length; i++) {
        for (let j=0; j<sides[i].length-1; j++) {
            this.vs.push(sides[i][j]);
        }
    }
}

function makeBoundarySide(es) {
    const eps = getSideEndpoints(es);
    const side = [eps[0]];
    const esCopy = shallowCopyArray(es);
    while (esCopy.length > 0) {
        let found = false;
        for (let i=0; i<esCopy.length; i++) {
            if (esCopy[i].va === side[side.length-1]) {
                side.push(esCopy[i].vb);
                esCopy.splice(i,1);
                found = true;
                break;
            }
            if (esCopy[i].vb === side[side.length-1]) {
                side.push(esCopy[i].va);
                esCopy.splice(i,1);
                found = true;
                break;
            }
        }
        assert(found, "Unconnected boundary side");
    }
    assert(side[side.length-1] === eps[1], "Bad final endpoint for boundary side");
    return side;
}

function getSideEndpoints(es) {
    const eps = [];
    for (let i=0; i<es.length; i++) {
        let foundA = false;
        let foundB = false;
        for (let j=0; j<es.length; j++) {
            if (i !== j) {
                if (es[i].va === es[j].va || es[i].va === es[j].vb) {
                    foundA = true;
                }
                if (es[i].vb === es[j].va || es[i].vb === es[j].vb) {
                    foundB = true;
                }
                if (foundA && foundB) {
                    break;
                }
            }
        }
        if (!foundA) {
            eps.push(es[i].va);
        }
        if (!foundB) {
            eps.push(es[i].vb);
        }
    }
    assert(eps.length === 2, "More than two endpoints for boundary side");
    return eps;
}