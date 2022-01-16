/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Point(x, y) {
    this.x = x;
    this.y = y;
}

function distance(p1, p2) {
    return Math.hypot(p1.x-p2.x, p1.y-p2.y);
}

function copyPoint(p) {
    return new Point(p.x, p.y);
}

function drawPoint(p, ctx, color) {
    if (color) {
        ctx.fillStyle = color;
    } else {
        ctx.fillStyle = 'black';
    }
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
}

function getEquivVertices(vs1, vs2) {
    var vs = [];
    for (var i=0; i<vs1.length; i++) {
        for (var j=0; j<vs2.length; j++) {
            if (vs1[i] === vs2[j]) {
                vs.push(vs1[i]);
            }
        }
    }
    return vs;
}

function equivPoints(p1, p2) {
    if (Math.abs(p1.x-p2.x) < 1e-2 && Math.abs(p1.y-p2.y) < 1e-2) {
        return true;
    }
    return false;
}

function nearPoints(p1, p2) {
    if (Math.abs(p1.x-p2.x) < 20 && Math.abs(p1.y-p2.y) < 20) {
        return true;
    }
    return false;
}

function PolyAngle(angle, poly) {
    this.poly = poly;
    this.angle = angle;
}

var vIdx = 0;

function Vertex(p) {
    this.vIdx = vIdx++;
    this.p = p;
    this.polys = Array();
//    this.startAngle = 0;
//    this.type = null;
}

// get the two common polygons of two vertices
// don't forget that v1.polys[i] is actually a PolyAngle
// need v1.polys[i].poly to access polygon
function getCommonPolygons(v1, v2) {
    var polys = [];
    for (var i=0; i<v1.polys.length; i++) {
        var poly = v1.polys[i].poly;
        for (var j=0; j<v2.polys.length; j++) {
            if (poly === v2.polys[j].poly) {
                if (!polys.includes(poly)) {
                    polys.push(poly);
                }
            }
        }
    }
    return polys;
}

function sortPolys(polys) {
    polys.sort(function (a,b) {
       return a.angle - b.angle;
    });
}

function drawVertex(v, ctx) {
    drawPoint(v.p, ctx);
    if (displayVertexNumbersCheckbox.checked) {
        ctx.fillStyle = 'black';
        if (v.vIdx || v.vIdx === 0) {
            ctx.fillText(v.vIdx, v.p.x+10, v.p.y);
        }
    }
}