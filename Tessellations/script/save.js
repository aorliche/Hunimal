/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var savedTesIdx = 0;

function save() {
    var json = stringify();
    
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    var a = document.createElement("a");
    
    a.appendChild(document.createTextNode("Saved Tessellation " + (savedTesIdx++)));
    a.addEventListener("click", createRestoreSavedTesFunction(json), false);
    
    td.appendChild(a);
    tr.appendChild(td);
    
    td = document.createElement("td");
    a = document.createElement("a");
    
    a.appendChild(document.createTextNode("Remove"));
    a.addEventListener("click", createRemoveSavedTesTableRowFunction(tr), false);
    
    td.appendChild(a);
    tr.appendChild(td);
    
    td = document.createElement("td");
    a = document.createElement("a");
    
    a.appendChild(document.createTextNode("Save to File"));
    a.addEventListener("click", createSaveToFileFunction(json), false);
    
    td.appendChild(a);
    tr.appendChild(td);
    
    savedTessellationsTable.appendChild(tr);
}

function createRestoreSavedTesFunction(json) {
    return function() {
        parse(json);
        repaint();
    }
}

function createRemoveSavedTesTableRowFunction(tr) {
    return function() {
        savedTessellationsTable.removeChild(tr);
    };
}

function createSaveToFileFunction(json) {
    return function() {
        var file = new Blob([json], {type: "application/octet-stream"});
        var a = document.createElement("a");
        var url = URL.createObjectURL(file);
        a.href = url;
        a.download = "tc.tes";
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    };
}

function replaceVsPoly(poly) {
    var nvs = [];
    for (var i=0; i<poly.vs.length; i++) {
        nvs.push(poly.vs[i].vIdx);
    }
    poly.vs = nvs;
}

function restoreVsPoly(poly, vs) {
    for (var i=0; i<poly.vs.length; i++) {
        for (var j=0; j<vs.length; j++) {
            if (poly.vs[i] === vs[j].vIdx) {
                poly.vs[i] = vs[j];
            }
        }
    }
}

function fixupPolysVs() {
    // restore vs in polys
    for (var i=0; i<polys.length; i++) {
        restoreVsPoly(polys[i], vs);
    }
    // restore consistency in vs[i].polys[j].poly with poly[k]
    for (var i=0; i<vs.length; i++) {
        var polyAngles = vs[i].polys;
        for (var j=0; j<polyAngles.length; j++) {
            for (var k=0; k<polys.length; k++) {
                if (polyAngles[j].poly.polyIdx === polys[k].polyIdx) {
                    polyAngles[j].poly = polys[k];
                    break;
                }
            }
        }
    }
}

function stringify() {
    for (var i=0; i<polys.length; i++) {
        replaceVsPoly(polys[i]);
    }
    var res = JSON.stringify({polys: polys, vs: vs});
    fixupPolysVs();
    return res;
}

function parse(json) {
    var tes = JSON.parse(json);
    polys = tes.polys;
    vs = tes.vs;
    // make sure polyIdx and vIdx are unique
    for (let i=0; i<polys.length; i++) {
        if (polys[i].polyIdx >= polyIdx) {
            polyIdx = polys[i].polyIdx + 1;
        }
    }
    for (let i=0; i<vs.length; i++) {
        if (vs[i].vIdx >= vIdx) {
            vIdx = vs[i].vIdx + 1;
        }
    }
    fixupPolysVs();
}