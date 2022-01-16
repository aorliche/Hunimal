/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function partwayVertex(v1, v2, i, n) {
    var dx = v2.x-v1.x;
    var dy = v2.y-v1.y;
    var x = v1.x + (dx*i/n);
    var y = v1.y + (dy*i/n);
    return new Vertex(x,y);
}
//Splitting a rhombus by a power requires each rhombus to become powered up
//to 4,9,16 etc by being evenly split into parts that are then treated like rhombi 
//of their own.
//we'll need user input to be the square root of  how many new rhombi will be made.
//the rhombic split code goes here:
function splitRhombus(r, power) {
    assert(Number.isInteger(power) && power > 1, "splitRombus: bad power " + power);
    var side01 = Array();
//    var side12 = Array();
    var side23 = Array();
//    var side30 = Array();
    var dx01 = (r.vs[1].x-r.vs[0].x)/power;
    var dy01 = (r.vs[1].y-r.vs[0].y)/power;
//    var dx12 = (r.vs[2].x-r.vs[1].x)/power;
//    var dy12 = (r.vs[2].y-r.vs[1].y)/power;
    for (var i=0; i<=power; i++) {
        side01.push(new Vertex(r.vs[0].x+dx01*i, r.vs[0].y+dy01*i));
        side23.push(new Vertex(r.vs[3].x+dx01*i, r.vs[3].y+dy01*i));
//        side12.push(new Vertex(r.vs[1].x+dx12*i, r.vs[1].y+dy12*i));
//        side30.push(new Vertex(r.vs[0].x+dx12*i, r.vs[0].y+dy12*i));
    }
    var rs = Array();
    for (var i=0; i<power; i++) {
        for (var j=0; j<power; j++) {
            var v0 = partwayVertex(side01[i], side23[i], j, power);
            var v1 = partwayVertex(side01[i+1], side23[i+1], j, power);
            var v2 = partwayVertex(side01[i+1], side23[i+1], j+1, power);
            var v3 = partwayVertex(side01[i], side23[i], j+1, power);
            rs.push(new Rhombus([v0, v1, v2, v3], rIdx++));
        }
    }
    return rs;
}

// the number of points that have 
// 0: 4 common vertices
// 1: 2 common vertices
// 2: 1 common vertex (only one rhombus has that vertex)
function getCombineCategoryNumbers(power) {
    var n4 = 1;
    for (var i=2, diff = 3; i<power; i++) {
        n4 += diff;
        diff += 2;
    }
    return [n4, 4*(power-1), 4];
}

function combineHelperCategorize(v, vertexNumbers) {
    for (var i=0; i<vertexNumbers.length; i++) {
        if (equivVertices(v, vertexNumbers[i][0])) {
            vertexNumbers[i][1]++;
            return;
        }
    }
    vertexNumbers.push([v, 1]);
}

function combineHelperGetResults(vertexNumbers) {
    var res = [0,0,0];
    var singlets = [];
    for (var i=0; i<vertexNumbers.length; i++) {
        switch (vertexNumbers[i][1]) {
            case 4: res[0]++; break;
            case 2: res[1]++; break;
            case 1: res[2]++; singlets.push(vertexNumbers[i][0]); break;
        }
    }
    return [res, singlets];
}

// build a rhombus from 4 vertices
// convex hull algorithm
function combineHelperBuildRhombus(vs) {
    var rvs = [copyVertex(vs[0])];
    vs.splice(0,1);
    while (vs.length > 0) {
        var n = rvs.length;
        var lastr = rvs[n-1];
        outer:
        for (var i=0; i<vs.length; i++) {
            for (var j=0; j<vs.length; j++) {
                if (i === j) {
                    continue;
                }
                if (!clockwise(lastr, vs[i], vs[j])) {
                    continue outer;
                }
            }
            rvs.push(copyVertex(vs[i]));
            vs.splice(i,1);
            break;
        }
        assert(rvs.length > n, "combineHelperBuildRhombus 1");
    }
    return new Rhombus(rvs, rIdx++);
}

function combineHelper(rs) {
    var power = Math.sqrt(rs.length);
    if (power === 0 || Math.floor(power) !== power) {
        return null;
    }
    var cat = getCombineCategoryNumbers(power);
    var vertexNumbers = [];
    for (var i=0; i<rs.length; i++) {
        var vs = rs[i].vs;
        for (var j=0; j<vs.length; j++) {
            combineHelperCategorize(vs[j], vertexNumbers);
        }
    }
    var res = combineHelperGetResults(vertexNumbers);
    var resres = res[0];
    if (resres[0] === cat[0] && resres[1] === cat[1] && resres[2] === cat[2]) {
        assert(res[1].length === 4, "combineHelper 1");
        return combineHelperBuildRhombus(res[1]);
    }
    return null;
}
