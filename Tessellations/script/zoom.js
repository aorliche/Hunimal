/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function translate(dx, dy) {
    for (var i=0; i<vs.length; i++) {
        translateVertex(vs[i], dx, dy);
    }
}

function zoom(o, scale) {
	// we need to change the side length as well
	sideLength *= scale;
    for (var i=0; i<vs.length; i++) {
        zoomVertex(vs[i], o, scale);
    }
}

function zoomPoint(p, o, scale) {
    p.x = scale*(p.x-o.x)+o.x;
    p.y = scale*(p.y-o.y)+o.y;
}

// most vertices are in multiple polygons
// this would zoom them repeatedly
// same for translate
//function zoomPoly(poly, o, scale) {
//    for (var i=0; i<poly.vs.length; i++) {
//        zoomVertex(poly.vs[i], o, scale);
//    }
//}

function zoomVertex(v, o, scale) {
    zoomPoint(v.p, o, scale);
}

function translatePoint(p, dx, dy) {
    p.x += dx;
    p.y += dy;
}

function translateVertex(v, dx, dy) {
    translatePoint(v.p, dx, dy);
}