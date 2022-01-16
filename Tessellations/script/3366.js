
// return a two-element array of parallel arrays
// first element is an array of neighboring polygons (that share at least one vertex with poly)
// second element is an array where each element is either [v1] or [v1, v2]
// i.e. the vertices shared by neighbor with poly
// two shared vertices mean an edge is shared
function getPolyNeighbors(poly) {
    let neighborPolys = [];
    let neighborVs = [];
    for (let i=0; i<poly.vs.length; i++) {
        let v = poly.vs[i];
        let polyAngles = v.polys;
        for (let j=0; j<polyAngles.length; j++) {
            let neighbor = polyAngles[j].poly;
            if (neighbor === poly) {
                continue;
            }
            let nIndx = neighborPolys.indexOf(neighbor);
            if (nIndx === -1) {
                neighborPolys.push(neighbor);
                neighborVs.push([v]);
            } else {
                neighborVs[nIndx].push(v);
            }
        }
    }
    return [neighborPolys, neighborVs];
}

// returns true if poly shares edge with a poly of otherPolyType
// otherPolyType must be an integer (i.e. 3 for triangle, 4 for square, etc.)
function polySharesEdgeWithPolyType(poly, otherPolyType) {
    let npnv = getPolyNeighbors(poly);
    let np = npnv[0];
    let nv = npnv[1];
    for (let i=0; i<np.length; i++) {
        if (nv[i].length === 2) {
            if (np[i].vs.length === otherPolyType) {
                return true;
            }
        }
    }
    return false;
}

// returns the type of the polygon opposite this edge
// this edge must have only one polygon (an outer edge)
// works only for squares, hexagons, and dodecagons
// returns 3 for triangle, 4 for square, 6 for hexagon, and 12 for dodecagon
// returns 0 if opposite edge is an outer edge
function getOppositeEdgePolyType(e) {
    return getOppositeEdgePoly(e).vs.length;
}

// return the polygon on the opposite edge from this edge
// returns null if opposite edge is empty (an outer edge)
function getOppositeEdgePoly(e) {
    assert(e.polys.length === 1, "edge is not an outer edge");
    let poly = e.polys[0];
    let oe = getPolyEdgeOppositeEdge(poly, e);
    let oePolys = getEdgePolys(oe);
    // opposite edge is outer edge
    if (oePolys.length === 1) {
        assert(oePolys[0] === poly, "polygon edges don't share common poly 1");
        return null;
    }
    // opposite edge is not an outer edge
    if (oePolys[0] === poly) {
        return oePolys[1];
    } else if (oePolys[1] === poly) {
        return oePolys[0];
    } 
    assert(false, "polygon edges don't share common poly 2");
}

// return a new point object at the center of the polygon
// two separate cases for even and odd number of sides
function getPolyCenterPoint(poly) {
    let n = poly.vs.length;
    let ax, ay, bx, by, c, d;
    if (n%2 === 1) {
        ax = (poly.vs[0].p.x + poly.vs[1].p.x)/2;
        ay = (poly.vs[0].p.y + poly.vs[1].p.y)/2;
        bx = (poly.vs[1].p.x + poly.vs[2].p.x)/2;
        by = (poly.vs[1].p.y + poly.vs[2].p.y)/2;
        c = poly.vs[Math.floor(n/2)+1].p;
        d = poly.vs[Math.floor(n/2+2)%n].p;
    } else {
        ax = poly.vs[0].p.x;
        ay = poly.vs[0].p.y;
        bx = poly.vs[1].p.x;
        by = poly.vs[1].p.y;
        c = poly.vs[n/2].p;
        d = poly.vs[n/2+1].p;
    }
    let cx = c.x;
    let cy = c.y;
    let dx = d.x;
    let dy = d.y;
    let m1 = (cy-ay)/(cx-ax);
    let m2 = (dy-by)/(dx-bx);
    let ix, iy;
    if (!isFinite(m1)) {
        assert(isFinite(m2), "parallel lines 1");
        ix = cx;
        iy = m2*(ix-bx)+by;
    } else if (!isFinite(m2)) {
        assert(isFinite(m1), "parallel lines 2");
        ix = dx;
        iy = m1*(ix-ax)+ay;
    } else if (approxEqual(m1, 0)) {
        assert(!approxEqual(m2, 0), "parallel lines 3");
        iy = cy;
        ix = (iy-by)/m2+bx;
    } else if (approxEqual(m2, 0)) {
        assert(!approxEqual(m1, 0), "parallel lines 4");
        iy = dy;
        ix = (iy-ay)/m1+ax;
    } else {
        ix = (m1*ax-ay-m2*bx+by)/(m1-m2);
        iy = m1*(ix-ax)+ay;
    }
    return new Point(ix, iy);
}

// reflect point across the specified center
function reflectPoint(toReflect, center) {
    let dx = center.x - toReflect.x;
    let dy = center.y - toReflect.y;
    return new Point(center.x + dx, center.y + dy);
}

// find vertex of polygon which has approximately the same coordinates as point
// returns null if there is no vertex at the specified point
function getPolyVertexAtPoint(poly, p) {
    for (let i=0; i<poly.vs.length; i++) {
        if (equivPoints(p, poly.vs[i].p)) {
            return poly.vs[i];
        }
    }
    return null;
}

// returns the edge opposite the given edge
// does not work for triangles and other polygons with an odd number of sides
// (throws an exception in this case)
function getPolyEdgeOppositeEdge(poly, e) {
    assert(poly.vs.length % 2 === 0, "poly has odd number of sides");
    let cp = getPolyCenterPoint(poly);
    let pa = reflectPoint(e.va.p, cp);
    let pb = reflectPoint(e.vb.p, cp);
    let va = getPolyVertexAtPoint(poly, pa);
    let vb = getPolyVertexAtPoint(poly, pb);
    assert(va && vb, "failed to find opposite edge of polygon");
    return new Edge(va, vb);
}

// returns the point in the middle of an edge
function getEdgeMidpoint(e) {
    let pa = e.va.p;
    let pb = e.vb.p;
    return new Point((pa.x+pb.x)/2, (pa.y+pb.y)/2);
}

// return a unit vector from point a to point b
function getUnitVector(pa, pb) {
    let d = distance(pa, pb);
    let dx = (pb.x-pa.x)/d;
    let dy = (pb.y-pa.y)/d;
    return {x: dx, y: dy};
}

// return a new vector scaled by the factor a
function scaleVector(v, a) {
    return {x: v.x*a, y: v.y*a};
}

// return a new point that is point p translated by v
function addVectorToPoint(p, v) {
    return {x: p.x+v.x, y: p.y+v.y};
}

// returns vertex opposite the given edge
// only works for polygons with an odd number of sides
// throws an exception if poly has even number of sides
function getPolyVertexOppositeEdge(poly, e) {
    assert(poly.vs.length % 2 === 1, "poly has an even number of sides");
    let cp = getPolyCenterPoint(poly);
    let mp = getEdgeMidpoint(e);
    let rp = reflectPoint(mp, cp);
    let uv = getUnitVector(cp, rp);
    let r = distance(cp, poly.vs[0].p);
    let vv = scaleVector(uv, r);
    let op = addVectorToPoint(cp, vv);
    let v = getPolyVertexAtPoint(poly, op);
    assert(v, "failed to find point opposite edge");
    return v;
}

// returns the edge opposite a given vertex
// only works for polygons with an odd number of sides
// throws an exception if poly has even number of sides
function getEdgeOppositePolyVertex(poly, v) {
    assert(poly.vs.length % 2 === 1, "poly has an even number of sides");
    let cp = getPolyCenterPoint(poly);
    let rp = reflectPoint(v.p, cp);
    let evs = [];
    let minDist = Number.POSITIVE_INFINITY;
    for (let i=0; i<poly.vs.length; i++) {
        let cv = poly.vs[i];
        let d = distance(cv.p, rp);
        if (approxEqual(d, minDist)) {
            evs.push(cv);
        } else if (d < minDist) {
            minDist = d;
            evs = [cv];
        }
    }
    assert(evs.length === 2, "did not correctly find edge");
    return new Edge(evs[0], evs[1]);
}

function placeTriangleOnTriangleEdge_3366(e) {
    let poly = e.polys[0];
    let ov = getPolyVertexOppositeEdge(poly, e);
    let poly2 = null;
    for (let i=0; i<ov.polys.length; i++) {
        let cpoly = ov.polys[i].poly;
        if (cpoly.vs.length === 3 && cpoly !== poly) {
            poly2 = cpoly;
            break;
        }
    }
    assert(poly2, "failed to find other triangle");
    let oe = getEdgeOppositePolyVertex(poly2, ov);
    oe.polys = getEdgePolys(oe);
    return oe.polys.length === 2 && oe.polys[0].vs.length === 3 && oe.polys[1].vs.length === 3;
}

function expandBoard3366() {
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
            if (edgeIsPolygonEdge(es[i], '6')) {
                let oep = getOppositeEdgePoly(es[i]);
                // place hexagon on edge
                if (oep && oep.vs.length === 6) {
                    var angle = edgeGetStartAngle(es[i], '6');
                    placePoly(es[i].va, '6', angle);
                    es[i].polys = getEdgePolys(es[i]);
                    es.splice(i,1);
                    i--;
                }
                // place a triangle on edge
                else {
                    var angle = edgeGetStartAngle(es[i], '3');
                    placePoly(es[i].va, '3', angle);
                    es[i].polys = getEdgePolys(es[i]);
                    es.splice(i,1);
                    i--;
                }
            }
            // place a hexagon or triangle on edge
            else if (edgeIsPolygonEdge(es[i], '3')) {
                // place a hexagon
                if (polySharesEdgeWithPolyType(es[i].polys[0], 3)) {
                    var angle = edgeGetStartAngle(es[i], '6');
                    placePoly(es[i].va, '6', angle);
                    es[i].polys = getEdgePolys(es[i]);
                    es.splice(i,1);
                    i--;
                } // place a triangle 
                else if (placeTriangleOnTriangleEdge_3366(es[i])) {
                    var angle = edgeGetStartAngle(es[i], '3');
                    placePoly(es[i].va, '3', angle);
                    es[i].polys = getEdgePolys(es[i]);
                    es.splice(i,1);
                    i--;
                }
            } else {
                console.log("Unknown edge in 3.3.6.6");
                console.log(es[i]);
            }
        }
    }
}

function tessellate3366() {
    placePoly(v, '3', deg2rad(0));
    placePoly(v, '3', deg2rad(60));
    placePoly(v, '6', deg2rad(120));
    placePoly(v, '6', deg2rad(240));
    
    for (var i=0; i<iter; i++) {
        expandBoard3366();
    }
}
