/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Edge(va, vb) {
    this.va = va;
    this.vb = vb;
    this.polys = Array();
}

function equivEdge(ea, eb) {
    return isEdge(ea, eb.va.vIdx, eb.vb.vIdx);
}

function pointIsOnEdge(e, p) {
    return equivPoints(e.va.p, p) || equivPoints(e.vb.p, p);
}

function getEdgeIdx(es, e) {
    for (var i=0; i<es.length; i++) {
        if (equivEdge(es[i], e)) {
            return i;
        }
    }
    return -1;
}

function isEdge(e, vaIdx, vbIdx) {
    return (e.va.vIdx === vaIdx && e.vb.vIdx === vbIdx) 
                || (e.va.vIdx === vbIdx && e.vb.vIdx === vaIdx);
}

function findEdge(es, vaIdx, vbIdx) {
    for (var i=0; i<es.length; i++) {
        if (isEdge(es[i], vaIdx, vbIdx)) {
            return es[i];
        }
    }
}

function getEdgePolys(e) {
    var cand = null;
    var polys = [];
    for (var i=0; i<vs.length; i++) {
        if (vs[i] !== e.va && vs[i] !== e.vb) {
            continue;
        }
        if (cand === null) {
            cand = vs[i].polys;
        } else {
            for (var j=0; j<cand.length; j++) {
                for (var k=0; k<vs[i].polys.length; k++) {
                    if (cand[j].poly === vs[i].polys[k].poly) {
                        polys.push(cand[j].poly);
//                        var eIdx = getEdgeIdx(cand[j].poly.es, e);
//                        if (eIdx === -1) {
//                            cand[j].poly.es.push(e);
//                        } else {
//                            cand[j].poly.es[eIdx] = e;
//                        }
                    }
                }
            } 
        }
    }
    return polys;
}

function vsAreConnected(va, vb) {
    for (var i=0; i<va.polys.length; i++) {
        for (var j=0; j<vb.polys.length; j++) {
            if (va.polys[i].poly === vb.polys[j].poly) {
                return true;
            }
        }
    }
    return false;
}

function getEdges() {
    if (polys.length === 0) {
        return;
    }
    var sl = distance(polys[0].vs[0].p, polys[0].vs[1].p);
    var edges = Array();
    for (var i=0; i<vs.length; i++) {
        for (var j=i+1; j<vs.length; j++) {
            if (approxEqual(distance(vs[i].p, vs[j].p), sl)
                    && vsAreConnected(vs[i], vs[j])) {
                var e = new Edge(vs[i], vs[j]);
                edges.push(e);
                e.polys = getEdgePolys(e);
            }
        }
    }
    return edges;
}

function getOuterEdges() {
    var es = getEdges();
    var outes = Array();
    
    for (var i=0; i<es.length; i++) {
        if (es[i].polys.length < 2) {
            outes.push(es[i]);
        }
    } 
    
    return outes;
}

// does this triangle have two common vertices with another triangle
function isTriPaired(tri) {
    var vs = tri.vs;
    for (var i=0; i<polys.length; i++) {
        if (polys[i] === tri || polys[i].vs.length !== 3) {
            continue;
        }
        var ovs = polys[i].vs;
        var nCommonVs = 0;
        for (var j=0; j<ovs.length; j++) {
            for (var k=0; k<vs.length; k++) {
                if (ovs[j] === vs[k]) {
                    nCommonVs++;
                }
            }
        }
        if (nCommonVs === 2) {
            return true;
        }
    }
    return false;
}

function edgeHasPairedTriangle(e) {
    if (e.polys[0].vs.length !== 3) {
        return false;
    }
    return isTriPaired(e.polys[0]);
}

function edgeIsPolygonEdge(e, typeStr) {
    var nSides = parseInt(typeStr);
    for (var i=0; i<e.polys.length; i++) {
        if (e.polys[i].vs.length === nSides) {
            return true;
        }
    }
    return false;
}

function addToPolyCount(pc, poly) {
    for (var i=0; i<pc.length; i++) {
        if (pc[i][0] === poly) {
            pc[i][1]++;
            return;
        }
    }
    pc.push([poly, 1]);
}

function getEdgeAdjacentPolys(poly) {
    // edge adjacent polys will show up twice because they share two vertices
    var pc = [];
    for (var i=0; i<poly.vs.length; i++) {
        var vpolys = poly.vs[i].polys;
        for (var j=0; j<vpolys.length; j++) {
            if (vpolys[j].poly === poly) {
                continue;
            }
            addToPolyCount(pc, vpolys[j].poly);
        }
    }
    // get all polys that show up twice
    var polys = [];
    for (var i=0; i<pc.length; i++) {
        assert(pc[i][1] < 3, "getAdjacentPolys: poly shows up more than twice");
        if (pc[i][1] === 2) {
            polys.push(pc[i][0]);
        }
    }
    return polys;
}

function triHasTwoSquares(tri) {
    var nSq = 0;
    var polys = getEdgeAdjacentPolys(tri);
    for (var i=0; i<polys.length; i++) {
        if (getNumSides(polys[i]) === 4) {
            nSq++;
        }
    }
//    for (var i=0; i<tri.es.length; i++) {
//        var e = tri.es[i];
//        for (var j=0; j<e.polys.length; j++) {
//            if (e.polys[j] !== tri 
//                    && e.polys[j].vs.length === 4) {
//                nSq++;
//            }
//        }
//    }
    return nSq === 2;
}

function edgeHasTriangleWithTwoSquares(e) {
    if (e.polys[0].vs.length !== 3) {
        return false;
    }
    return triHasTwoSquares(e.polys[0]);
}

function edgeGetStartAngle(e, typeStr) {
    var poly = e.polys[0];
    var vc;
    for (var i=0; i<poly.vs.length; i++) {
        if (poly.vs[i] !== e.va && poly.vs[i] !== e.vb) {
            vc = poly.vs[i];
            break;
        }
    }
    var angle = getAngle(e.va.p, e.vb.p);
    if (clockwise(e.va, e.vb, vc)) {
        angle -= getPolyAngle(typeStr);
    }
    return angle;
}

function distanceFromEdge(e, p) {
    var lx,gx,ly,gy;
    var v1 = e.va.p;
    var v2 = e.vb.p;
    if (v1.x > v2.x) {
        lx = v2.x;
        gx = v1.x;
    } else {
        lx = v1.x;
        gx = v2.x;
    }
    if (v1.y > v2.y) {
        ly = v2.y;
        gy = v1.y;
    } else {
        ly = v1.y;
        gy = v2.y;
    }
    if (gx-lx < 5) {
        gx += 5;
        lx -= 5;
    }
    if (gy-ly < 5) {
        gy += 5;
        ly -= 5;
    }
    if (p.x < lx || p.x > gx) {
        return Number.POSITIVE_INFINITY;
    }
    if (p.y < ly || p.y > gy) {
        return Number.POSITIVE_INFINITY;
    }
    var m = (v1.y - v2.y) / (v1.x - v2.x);
    // if line is a vertical line, we only need to measure the distance in
    // the x coordinate
    if (Math.abs(m) > 200) {
        var d = Math.abs(v1.x-p.x);
        if (d < 5) {
            return d;
        }
        return Number.POSITIVE_INFINITY;
    }
    var a = -m; 
    var b = 1;
    var c = m*v1.x-v1.y;
    var d = Math.abs(a*p.x + b*p.y+c)/Math.sqrt(a*a + b*b);
    return d;
}

function selectEdge(es, p) {
    var cande = [];
    for (var i=0; i<es.length; i++) {
        var d = distanceFromEdge(es[i], p);
        if (d < 5) {
            cande.push([es[i], d]);
        }
    }
    cande.sort(function (a,b) {return a[1]-b[1];});
    if (cande.length > 0) {
        return cande[0][0];
    } 
    return null;
}

function drawEdge(e, ctx, color) {
    ctx.strokeStyle = (color) ? color : 'red';
    ctx.lineWidth = '3';
    ctx.beginPath();
    ctx.moveTo(e.va.p.x, e.va.p.y);
    ctx.lineTo(e.vb.p.x, e.vb.p.y);
    ctx.stroke();
    ctx.lineWidth = '1';
}