/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function beginStroke() {
    stroking = true;
    strokeParts = [];
}

function endStroke() {
    stroking = false;
}

function displayStroke() {
//    if (!stroking) {
//        return;
//    }
    if (!strokeParts || strokeParts.length === 0) {
        return;
    }
    var ctx = canvas.getContext('2d');
    var lineWidthSav = ctx.lineWidth;
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#f00';
    for (var i=0; i<strokeParts.length; i++) {
        var stroke = strokeParts[i];
        for (var j=0; j<stroke.length-1; j++) {
            ctx.beginPath();
            ctx.moveTo(stroke[j].x, stroke[j].y);
            ctx.lineTo(stroke[j+1].x, stroke[j+1].y);
            ctx.stroke();
        }
    }
    ctx.lineWidth = lineWidthSav;
}

function applyStroke() {
    if (!strokeParts || strokeParts.length === 0) {
        return;
    }
    if (!selectedMSP) {
        return;
    }
    for (var i=0; i<strokeParts.length; i++) {
        var stroke = strokeParts[i];
        for (var j=0; j<stroke.length; j++) {
            var r = getPolyAtCoords(selectedMSP, stroke[j]);
            if (r) {
                r.selectedForColoring = true;
            }
        }
    }
    repaint();
}

function invertStroke() {
    if (!strokeParts) {
        return;
    }
    if (!selectedMSP) {
        return;
    }
    var selectedPolys = [];
    for (var i=0; i<strokeParts.length; i++) {
        var stroke = strokeParts[i];
        for (var j=0; j<stroke.length; j++) {
            var r = getPolyAtCoords(selectedMSP, stroke[j]);
            if (r) {
                selectedPolys.push(r);
            }
        }
    }
    for (var i=0; i<selectedPolys.length; i++) {
        var r = selectedPolys[i];
        r.selectedForColoring = false;
    }
    for (var i=0; i<selectedMSP.polys.length; i++) {
        var r = selectedMSP.polys[i];
        if (!selectedPolys.includes(r)) {
            r.selectedForColoring = true;
        }
    }
    repaint();
}

function copyStroke(strokeParts) {
    var strokePartsCopy = JSON.parse(JSON.stringify(strokeParts));
    return strokePartsCopy;
}

function saveStroke() {
    var strokePartsCopy = copyStroke(strokeParts);
    
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    var a = document.createElement("a");
    
    a.appendChild(document.createTextNode("Saved Stroke " + (savedStrokeIdx++)));
    a.addEventListener("click", createRestoreSavedStrokeFunction(strokePartsCopy), false);
    
    td.appendChild(a);
    tr.appendChild(td);
    
    td = document.createElement("td");
    a = document.createElement("a");
    
    a.appendChild(document.createTextNode("Remove"));
    a.addEventListener("click", createRemoveSavedStrokeTableRowFunction(tr), false);
    
    td.appendChild(a);
    tr.appendChild(td);
    
     td = document.createElement("td");
    a = document.createElement("a");
    
    a.appendChild(document.createTextNode("Save to File"));
    a.addEventListener("click", createSaveStrokeToFileFunction(strokePartsCopy), false);
    
    td.appendChild(a);
    tr.appendChild(td);
    
    savedStrokeTable.appendChild(tr);
}

function createRestoreSavedStrokeFunction(strokePartsCopy) {
    return function() {
        strokeParts = strokePartsCopy;
        repaint();
        stroking = true;
        displayStroke();
    };
}

function createRemoveSavedStrokeTableRowFunction(tr) {
    return function() {
        savedStrokeTable.removeChild(tr);
    };
}

function createSaveStrokeToFileFunction(strokePartsCopy) {
    return function() {
        var text = JSON.stringify(strokePartsCopy);
        var file = new Blob([text], {type: "application/octet-stream"});
        var a = document.createElement("a");
        var url = URL.createObjectURL(file);
        a.href = url;
        a.download = "stroke.stk";
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    };
}

