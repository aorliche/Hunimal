/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Quadrilateral(vs) {
    this.vs = vs;
    var x = (vs[0].x + vs[1].x + vs[2].x + vs[3].x)/4;
    var y = (vs[0].y + vs[1].y + vs[2].y + vs[3].y)/4;
    this.center = new Vertex(x, y);
}

function Triangle(vs) {
    this.vs = vs;
    var x = (vs[0].x + vs[1].x + vs[2].x)/3;
    var y = (vs[0].y + vs[1].y + vs[2].y)/3;
    this.center = new Vertex(x,y);
}

function makeQuadsFromChains(chains) {
    var quads = [];
    for (var i=0; i<chains.length; i++) {
        for (var j=1; j<chains[i].length; j++) {
            var vs = getTwoCommonVertices(chains[i][j-1], chains[i][j]);
            assert(vs.length <= 2, "makeQuadsFromChains");
            if (vs.length < 2) {
                continue;
            }
            quads.push(new Quadrilateral([
                copyVertex(vs[0]),
                copyVertex(chains[i][j-1].center),
                copyVertex(vs[1]),
                copyVertex(chains[i][j].center)
            ]));
        }
    }
    return quads;
}

function getTwoUncommonVertices(vs, vsCommon) {
    var vsUncommon = [];
    for (var i=0; i<vs.length; i++) {
        if (!equivVertices(vs[i], vsCommon[0]) 
                && !equivVertices(vs[i], vsCommon[1])) {
            vsUncommon.push(vs[i]);
        }
    }
    return vsUncommon;
} 

function makeTrianglesFromChains(chains) {
    var tris = [];
    var vsCommon, vsUncommon;
    for (var i=0; i<chains.length; i++) {
        assert(chains[i].length >= 2, "makeTrianglesFromChains 1");
        
        vsCommon = getTwoCommonVertices(chains[i][0], chains[i][1]);
        assert(vsCommon.length === 2, "makeTrianglesFromChains 2");
        
        vsUncommon = getTwoUncommonVertices(chains[i][0].vs, vsCommon);
        assert(vsUncommon.length === 2, "makeTrianglesFromChains 3");
        
        tris.push(new Triangle([
            copyVertex(chains[i][0].center),
            copyVertex(vsUncommon[0]),
            copyVertex(vsUncommon[1])
        ]));
        
        vsCommon = getTwoCommonVertices(chains[i][chains[i].length-2], 
                chains[i][chains[i].length-1]);
        assert(vsCommon.length === 2, "makeTrianglesFromChains 4");
        
        vsUncommon = getTwoUncommonVertices(chains[i][chains[i].length-1].vs, vsCommon);
        assert(vsUncommon.length === 2, "makeTrianglesFromChains 5");
        
        tris.push(new Triangle([
            copyVertex(chains[i][chains[i].length-1].center),
            copyVertex(vsUncommon[0]),
            copyVertex(vsUncommon[1])
        ]));
    }
    return tris;
}

function makeTrianglesFromMSP(msp) {
    var rhombi = msp.rhombi;
    var tris = [];
    for (var i=0; i<rhombi.length; i++) {
        var vs = rhombi[i].vs;
        var c = rhombi[i].center;
        for (var j=0; j<4; j++) {
            var i1 = j;
            var i2 = (j+1)%4;
            tris.push(new Triangle([
                copyVertex(vs[i1]),
                copyVertex(vs[i2]),
                copyVertex(c)
            ]));
        }
    }
    return tris;
}

