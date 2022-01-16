/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function vertexOnEdge(v, v1, v2) {
    var lx,gx,ly,gy;
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
    if (v.x < lx || v.x > gx) {
        return false;
    }
    if (v.y < ly || v.y > gy) {
        return false;
    }
    var m = (v1.y - v2.y) / (v1.x - v2.x);
    // if line is a vertical line, we only need to measure the distance in
    // the x coordinate
    if (Math.abs(m) > 100) {
        if (Math.abs(v1.x-v.x) < 5) {
            return true;
        }
        return false;
    }
    var a = -m; 
    var b = 1;
    var c = m*v1.x-v1.y;
    var d = Math.abs(a*v.x + b*v.y+c)/Math.sqrt(a*a + b*b);
    return d < 5;
}