/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var polyIdx = 0;

function getNumSides(poly) {
    return poly.vs.length;
}

// sum of interior angles = (n-2)*180
function getPolyAngle(poly) {
    var nSides;
    if (typeof poly === "string" || poly instanceof String) {
        nSides = parseInt(poly);
    } else if (poly.vs) {
        nSides = getNumSides(poly);
    } else {
        nSides = poly;
    }
    assert(nSides && nSides > 0, "getPolyAngle: nSides is NaN or nSides <= 0");
    return (nSides-2)*Math.PI/nSides;
}

function Polygon(v, angle, sideLength, nSides) {
    this.polyIdx = polyIdx++;
    this.vs = [v];
    
    assert(nSides > 0, "Polygon: nSides <= 0");
    assert(sideLength > 0, "Polygon: sideLength <= 0");
    
    var x = v.p.x;
    var y = v.p.y;
    
    var angleInc = Math.PI-getPolyAngle(nSides);
    
    for (var i=0; i<nSides-1; i++) {
        x = x + sideLength*Math.cos(angle+i*angleInc);
        y = y + sideLength*Math.sin(angle+i*angleInc);
        
        var nv = new Vertex(new Point(x,y));
        
        this.vs.push(nv);
    }
}

function drawPoly(poly, ctx) {
    if (poly.type === "EmptySpace") { 
        return;
    } 
    ctx.strokeStyle = '#000';
    if (poly.selected) {
        ctx.fillStyle = '#00f';
    } else {
        ctx.fillStyle = poly.color;
    }
    ctx.beginPath();
    ctx.moveTo(poly.vs[0].p.x, poly.vs[0].p.y);
    for (var i=1; i<poly.vs.length; i++) {
        ctx.lineTo(poly.vs[i].p.x, poly.vs[i].p.y);
    }
    ctx.closePath();
    if (!poly.selected && poly.alpha || poly.alpha === 0) {
        ctx.globalAlpha = poly.alpha;
    }
    if (displayLinesCheckbox.checked) {
        ctx.stroke();
    }
    ctx.fill();
    ctx.globalAlpha = 1.0;
}

function contains(poly, p) {
    var x = p.x, y = p.y;

    var inside = false;
    var vs = poly.vs;
    
//    console.log("x: " + x + " y: " + y + "\nVs:");
//    for (var i=0; i<vs.length; i++) {
//        console.log("   x: " + vs[i].p.)
//    }
//    return;
    
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i].p.x, yi = vs[i].p.y;
        var xj = vs[j].p.x, yj = vs[j].p.y;

        var intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}
