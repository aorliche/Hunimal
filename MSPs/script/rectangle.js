/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Rectangle(lx,ly,gx,gy) {
    this.x = lx;
    this.y = ly;
    this.w = gx-lx;
    this.h = gy-ly;
}

function copyRectangle(r) {
    return new Rectangle(r.x, r.y, r.x+r.w, r.y+r.h);
}

function rectangleContainsPoint(r, p) {
    return p.x >= r.x 
            && p.x <= r.x+r.w 
            && p.y >= r.y 
            && p.y <= r.y+r.h;
}

function getBoundingRectangle(polys) {
    var lx = Number.POSITIVE_INFINITY;
    var ly = Number.POSITIVE_INFINITY;
    var gx = 0;
    var gy = 0;
    for (var i=0; i<polys.length; i++) {
        var vs = polys[i].vs;
        for (var j=0; j<vs.length; j++) {
            var x = vs[j].x;
            var y = vs[j].y;
            if (x < lx) {
                lx = x;
            } 
            if (x > gx) {
                gx = x;
            }
            if (y < ly) {
                ly = y;
            }
            if (y > gy) {
                gy = y;
            }
        }
    }
    return new Rectangle(lx, ly, gx, gy);
}

function padRectangle(r, px) {
    return new Rectangle(r.x-px, r.y-px, r.x+r.w+px, r.y+r.h+px);
}

function zoomRectangle(r, o, scale) {
    var otherCorner = new Vertex(r.x+r.w, r.y+r.h);
    zoomPoint(r, o, scale);
    zoomPoint(otherCorner, o, scale);
    r.w = otherCorner.x-r.x;
    r.h = otherCorner.y-r.y;
}