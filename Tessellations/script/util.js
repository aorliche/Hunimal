/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function convertToElementCoords(e) {
    var rect = e.target.getBoundingClientRect();
    var p = new Point(e.clientX-rect.left, e.clientY-rect.top);
    return p;
}

/*function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}*/
function shuffle(a) {
    for (let i=0; i<a.length; i++) {
         let j = Math.floor(Math.random() * a.length);
         let temp = a[i];
         a[i] = a[j];
         a[j] = temp;
    }
}

function assert(exp, message) {
    if (!exp) {
        throw "Assertion failed: " + message;
    }
}

function approxEqual(n1, n2) {
    if (isNaN(n1) || isNaN(n2)) {
        return false;
    }
    if (n1 === Number.POSITIVE_INFINITY && n2 === Number.POSITIVE_INFINITY) {
        return true;
    }
    if (n1 === Number.NEGATIVE_INFINITY && n2 === Number.NEGATIVE_INFINITY) {
        return true;
    }
    return Math.abs(n1-n2) < 1e-4;
}

function deg2rad(deg) {
    return Math.PI*deg/180;
}

function rad2deg(rad) {
    return 180*rad/Math.PI;
}

function normalizeAngle(rad) {
    while (rad < 0) {
        rad += 2*Math.PI;
    }
    while (rad >= 2*Math.PI) {
        rad -= 2*Math.PI;
    }
    if (approxEqual(rad, 2*Math.PI)) {
        rad = 0;
    }
    return rad;
}

// get the angle between p1 and p2
function getAngle(p1, p2) {
    var angle = Math.atan2(p2.y-p1.y, p2.x-p1.x);
    return normalizeAngle(angle);
}


function clockwise(p, q, r) {
    var val =   (q.p.y - p.p.y) * (r.p.x - q.p.x) - 
                (q.p.x - p.p.x) * (r.p.y - q.p.y);
    return val < 0;
}

function shallowCopyArray(arr) {
    const narr = new Array(arr.length);
    for (let i=0; i<arr.length; i++) {
        narr[i] = arr[i];
    }
    return narr;
}