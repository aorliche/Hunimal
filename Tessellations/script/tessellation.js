/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var canvas;

var xField;
var yField;
var sideLengthField;
var iterField;
var numSidesField;

var selectPolygonRadio;
var selectEdgeRadio;
var selectStrokeRadio;

var placeTriangleRadio;
var placeSquareRadio;
var placeHexagonRadio;
var placeDodecagonRadio;
var placeOtherRadio;

var displayVerticesCheckbox;
var displayVertexNumbersCheckbox;
var displayLinesCheckbox;

var allowTranslationCheckbox;
var allowZoomCheckbox;

var savedTessellationsTable;
var fileInput;

let northTcEdgeRadio;
let southTcEdgeRadio;
let eastTcEdgeRadio;
let westTcEdgeRadio;

var polys = Array();
var vs = Array();
var p;
var v;
var sideLength;
var iter;
var selectedEdge;
let tcEdges;
let tc;

var translating = false;
var prevPosition;
var selecting = false;
var strokeParts = [];

function initTcEdges() {
    tcEdges = {
        north: [], south: [], east: [], west: []
    }
}

function start() {
    canvas = document.getElementById("canvas");
    
    xField = document.getElementById('x-field');
    yField = document.getElementById('y-field');
    sideLengthField = document.getElementById('side-length-field');
    iterField = document.getElementById('iter-field');
    numSidesField = document.getElementById('num-sides-field');

    selectPolygonRadio = document.getElementById('select-polygon-radio');
    selectEdgeRadio = document.getElementById('select-edge-radio');
    selectStrokeRadio = document.getElementById('select-stroke-radio');

    placeTriangleRadio = document.getElementById('place-triangle-radio');
    placeSquareRadio = document.getElementById('place-square-radio');
    placeHexagonRadio = document.getElementById('place-hexagon-radio');
    placeDodecagonRadio = document.getElementById('place-dodecagon-radio');
    placeOtherRadio = document.getElementById('place-other-radio');
    
    displayVerticesCheckbox = document.getElementById('display-vertices-checkbox');
    displayVertexNumbersCheckbox = document.getElementById('display-vertex-numbers-checkbox');
    displayLinesCheckbox = document.getElementById('display-lines-checkbox');
    
    allowTranslationCheckbox = document.getElementById('allow-translation-checkbox');
    allowZoomCheckbox = document.getElementById('allow-zoom-checkbox');
    
    savedTessellationsTable = document.getElementById('saved-tessellations-table');
    fileInput = document.getElementById('file-input');
    
    northTcEdgeRadio = document.getElementById('north-tc-edge-radio');
    southTcEdgeRadio = document.getElementById('south-tc-edge-radio');
    eastTcEdgeRadio = document.getElementById('east-tc-edge-radio');
    westTcEdgeRadio = document.getElementById('west-tc-edge-radio');
    
    initTcEdges();
    
    // add listeners
    canvas.addEventListener('click', canvasClick, false);
    canvas.addEventListener('mousemove', canvasMove, false);
    
    displayVerticesCheckbox.addEventListener('change', function (e) {
        repaint();
    }, false);
    
    displayVertexNumbersCheckbox.addEventListener('change', function (e) {
        repaint();
    }, false);
    
    displayLinesCheckbox.addEventListener('change', function (e) {
        repaint();
    }, false);
    
    fileInput.addEventListener("change", function (e) {
        var file = e.target.files[0];
        if (!file) {
            return;
        }
        var r = new FileReader();
        r.onload = function(e) {
            parse(e.target.result);
            repaint();
        };
        r.readAsText(file);
    }, false);
    
    canvas.addEventListener("keydown", function(e) {
        e.preventDefault();
        keyDown(e);
    }, false);
    
    canvas.addEventListener("mousedown", function (e) {
        if (selectStrokeRadio.checked) {
            selecting = true;
        } else if (allowTranslationCheckbox.checked) {
            translating = true;
        }
        prevPosition = convertToElementCoords(e);
    }, false);
    
    canvas.addEventListener("mouseup", function (e) {
        translating = false;
        selecting = false;
    }, false);
    
    canvas.addEventListener("mouseleave", function (e) {
        translating = false;
        selecting = false;
    }, false);
    
    canvas.addEventListener("mousemove", function (e) {
        var p = convertToElementCoords(e);
        if (translating) {
            var dx = p.x-prevPosition.x;
            var dy = p.y-prevPosition.y;
            translate(dx, dy);
            repaint();
            prevPosition = p;
        } else if (selecting) {
            for (let i=0; i<polys.length; i++) {
                if (contains(polys[i], p)) {
                    polys[i].selected = true;
                    repaint();
                    return;
                }
            }
        }
    }, false);
    
    canvas.addEventListener("wheel", function(e) {
        e.preventDefault();
        if (!allowZoomCheckbox.checked) {
            return;
        }
        var p = convertToElementCoords(e);
        var scale = 1;
        if (/*e.wheelDelta > 0 ||*/ e.deltaY < 0) {
            scale = 1.03;
        } else {
            scale = 0.97;
        }
        zoom(p, scale);
        repaint();
    }, false);
    
    canvas.addEventListener("keydown", function (e) {
        e.preventDefault();
        switch (e.keyCode) {
            case 32: // spacebar
                doPlacePoly(); 
                break;
            case 84: // T
                placeTriangleRadio.checked = true;
                doPlacePoly();
                break;
            case 83: // S
                placeSquareRadio.checked = true;
                doPlacePoly();
                break;
            case 72: // H
                placeHexagonRadio.checked = true;
                doPlacePoly();
                break;
            case 68: // D
                placeDodecagonRadio.checked = true;
                doPlacePoly();
                break;
        }
    }, false);
}

function canvasClick(e) {
    var p = convertToElementCoords(e);
    if (selectPolygonRadio.checked) {
        for (var i=0; i<polys.length; i++) {
            if (contains(polys[i], p)) {
                polys[i].selected = !polys[i].selected;
                repaint();
                return;
            }
        }
        return;
    } else if (selectEdgeRadio.checked) {
        var es = getEdges();
        selectedEdge = selectEdge(es, p);
        repaint();
    }
}

function canvasMove(e) {
    var p = convertToElementCoords(e);
    xField.value = Math.round(p.x);
    yField.value = Math.round(p.y);
}

function keyDown(e) {
    if (e.key === 't' || e.key === 'T') {
        placeTriangleRadio.checked = true;
        doPlacePoly();
    } else if (e.key === 's' || e.key === 'S') {
        placeSquareRadio.checked = true;
        doPlacePoly();
    } else if (e.key === 'h' || e.key === 'H') {
        placeHexagonRadio.checked = true;
        doPlacePoly();
    } else if (e.key === 'd' || e.key === 'D') {
        placeDodecagonRadio.checked = true;
        doPlacePoly();
    }
}

function doPlacePoly() {
    if (!selectedEdge) {
        return;
    }
    selectedEdge.polys = getEdgePolys(selectedEdge);
    if (selectedEdge.polys.length > 1) {
        return;
    }
    var nSides = numSidesField.value;
    if (placeTriangleRadio.checked) {
        nSides = '3';
    } else if (placeSquareRadio.checked) {
        nSides = '4';
    } else if (placeHexagonRadio.checked) {
        nSides = '6';
    } else if (placeDodecagonRadio.checked) {
        nSides = '12';
    } 
    var angle = edgeGetStartAngle(selectedEdge, nSides);
    placePoly(selectedEdge.va, nSides, angle);
    selectedEdge.polys = getEdgePolys(selectedEdge);
    repaint();
}

// have a separate toDelete array because deleting a poly
// changes poly array
function doDeletePolys() {
    var toDelete = [];
    for (var i=0; i<polys.length; i++) {
        if (polys[i].selected) {
            toDelete.push(polys[i]);
        }
    }
    for (var i=0; i<toDelete.length; i++) {
        deletePoly(toDelete[i]);
    }
    if (toDelete.length > 0) {
        repaint();
    }
}

function findExistingV(v) {
    for (var i=0; i<vs.length; i++) {
        if (equivPoints(v.p, vs[i].p)) {
            return vs[i];
        }
    }
    return v;
}

function polyExists(v, typeStr, startAngle) {
    var nSides = parseInt(typeStr);
    for (var i=0; i<v.polys.length; i++) {
        if (v.polys[i].poly.vs.length === nSides
                && v.polys[i].angle === startAngle) {
            return true;
        }
    }
    return false;
}

function isBetween(eStart, eStop, angle) {
    if (approxEqual(eStart, angle) || approxEqual(eStop, angle)) {
        return true;
    } else if (eStop > eStart) {
        return angle >= eStart && angle <= eStop;
    } else {
        return angle >= eStart || angle <= eStop;
    }
}

function polyCanBePlaced(v, typeStr, startAngle) {
    if (v.polys.length === 0) {
        return true;
    }
    var prev = v.polys[v.polys.length-1];
    var next = v.polys[0];
    for (var i=0; i<v.polys.length; i++) {
        if (v.polys[i].angle > startAngle) {
            next = v.polys[i];
            break;
        }
        prev = v.polys[i];
    }
    var eStart = normalizeAngle(prev.angle + getPolyAngle(prev.poly));
    var eStop = normalizeAngle(next.angle);
    var stopAngle = normalizeAngle(startAngle + getPolyAngle(typeStr));
    var result = isBetween(eStart, eStop, startAngle) 
            && isBetween(eStart, eStop, stopAngle);
    if (!result) {
        console.log(v);
        console.log("eStart: " + eStart + " eStop: " + eStop);
        console.log("startAngle: " + startAngle + " stopAngle: " + stopAngle); 
    }
    return result;
    
}

function createPolyUnchecked(v, typeStr, startAngle) {
    let sideLength;
    if (polys[0]) {
        const dx = polys[0].vs[0].p.x-polys[0].vs[1].p.x;
        const dy = polys[0].vs[0].p.y-polys[0].vs[1].p.y;
        sideLength = Math.sqrt(dx*dx + dy*dy);
    } else {
        sideLength = parseInt(sideLengthField.value);
    }
    return new Polygon(v, startAngle, sideLength, parseInt(typeStr));
}

function findNextCwV(ov, vs) {
    for (var i=0; i<vs.length; i++) {
        var iscw = true;
        for (var j=0; j<vs.length; j++) {
            if (i === j) {
                continue;
            }
            if (!clockwise(ov, vs[i], vs[j])) {
                iscw = false;
                break;
            }
        }
        if (iscw) {
            return vs[i];
        }
    }
}

function getPolyStartAngle(ov, polyvs) {
    var hullvs = Array();
    for (var i=0; i<polyvs.length; i++) {
        if (!equivPoints(ov.p, polyvs[i].p)) {
            hullvs.push(polyvs[i]);
        }
    }
    var nv = findNextCwV(ov, hullvs);
    var angle = getAngle(ov.p, nv.p);
    return angle;
}

function deletePoly(poly) {
    // remove from polys array
    var i = polys.indexOf(poly);
    polys.splice(i,1);
    
    // remove from vertices which make up poly
    // note poly in vs is actually a PolyAngle
    for (var i=0; i<poly.vs.length; i++) {
        var keepPolys = [];
        var ps = poly.vs[i].polys;
        for (var j=0; j<ps.length; j++) {
            if (ps[j].poly !== poly) {
                keepPolys.push(ps[j]);
            }
        }
        if (keepPolys.length !== ps.length) {
            //console.log("Removed poly: vertex: " + poly.vs[i].vIdx);
            poly.vs[i].polys = keepPolys;
        }
    }
        
    // get rid of vertices which now contain zero polys
    var keepVs = [];
    for (var i=0; i<vs.length; i++) {
        if (vs[i].polys.length > 0) {
            keepVs.push(vs[i]);
        } /*else {
            //console.log("Removed vertex: " + vs[i].vIdx);
        }*/
    }
    vs = keepVs;
}

function placePoly(v, typeStr, startAngle) {
    // check if v exists
    v = findExistingV(v);
    
    // check if poly already exists at v
    if (polyExists(v, typeStr, startAngle)) {
        console.log("poly exists");
        return;
    }
    
    // check if poly can be placed at v (looking only at v, not other vs)
    if (!polyCanBePlaced(v, typeStr, startAngle)) {
        console.log("poly cannot be placed at v");
        return;
    }
    
    // create polygon and provisional vs
    var poly = createPolyUnchecked(v, typeStr, startAngle);
    
    // check if any already existing vs would be inside polygon
    for (var i=0; i<vs.length; i++) {
        var sameVertex = false;
        for (var j=0; j<poly.vs.length; j++) {
            if (equivPoints(vs[i].p, poly.vs[j].p)) {
                sameVertex = true;
                break;
            }
        }
        if (sameVertex) {
            continue;
        }
        if (contains(poly, vs[i].p)) {
			console.log(vs[i]);
            console.log("new poly contains existing vertex");
            return;
        }
    }
    
    // check if any already existing polygons would contain any of our vs
    var testvs = Array();
    var existvs = Array();
    for (var i=0; i<poly.vs.length; i++) {
        var sameVertex = false;
        for (var j=0; j<vs.length; j++) {
            if (equivPoints(vs[j].p, poly.vs[i].p)) {
                sameVertex = true;
                break;
            }
        }
        if (!sameVertex) {
            testvs.push(poly.vs[i]);
        } else {
            existvs.push(poly.vs[i]);
        }
    }
    
    for (var i=0; i<polys.length; i++) {
        for (var j=0; j<testvs.length; j++) {
            if (contains(polys[i], testvs[j].p)) {
                console.log("an existing poly contains new vertex");
                return;
            }
        }
    }
    
    // flatten vs with existing vs
    // 3) change vs referenced by polygon
    for (var i=0; i<poly.vs.length; i++) {
        for (var j=0; j<vs.length; j++) {
            if (equivPoints(poly.vs[i].p, vs[j].p)) {
                poly.vs[i] = vs[j];
            }
        }
    }
    
    // 1) include polygon in existing vs
    for (var i=0; i<existvs.length; i++) {
        for (var j=0; j<vs.length; j++) {
            if (equivPoints(existvs[i].p, vs[j].p)) {
                var angle = getPolyStartAngle(existvs[i], poly.vs);
                vs[j].polys.push(new PolyAngle(angle, poly));
                sortPolys(vs[j].polys);
                break;
            }
        }
    }
    
    // 2) include polygon in new vs
    for (var i=0; i<testvs.length; i++) {
        var angle = getPolyStartAngle(testvs[i], poly.vs);
        testvs[i].polys.push(new PolyAngle(angle, poly));
    }
    
    // add new vs to vs array
    for (var i=0; i<testvs.length; i++) {
        vs.push(testvs[i]);
    }
    
    // color polygon
    colorPoly(poly);
    
    // add polygon to poly array
    polys.push(poly);
}


function tessellate() {
    // get new starting vertex
    p = new Point(canvas.width/2, canvas.height/2);
    v = new Vertex(p);
    
    // clear vs and polys
    vs = [];
    polys = [];
    
    // tessellation parameters
    sideLength = parseInt(sideLengthField.value);
    if (sideLength < 1) {
        sideLength = 50;
    }
    
    iter = parseInt(iterField.value);
    if (iter < 0) {
        iter = 10;
    }
    
    // choose which tessellation to do
    var rb333333 = document.getElementById('3.3.3.3.3.3');
    var rb33434 = document.getElementById('3.3.4.3.4');
    var rb33344 = document.getElementById('3.3.3.4.4');
    var rb4444 = document.getElementById('4.4.4.4');
    var rb3464 = document.getElementById('3.4.6.4');
    var rb4612 = document.getElementById('4.6.12');
    let rb3636 = document.getElementById('3.6.3.6');
    let rb3366 = document.getElementById('3.3.6.6');
    let rb666 = document.getElementById('6.6.6');
    let rb33336 = document.getElementById('3.3.3.3.6');
    let rb31212 = document.getElementById('3.12.12');
    
    // biform vertex types
    let rb333333_33336_1 = document.getElementById('3.3.3.3.3.3_3.3.3.3.6_1');
    let rb333333_33336_2 = document.getElementById('3.3.3.3.3.3_3.3.3.3.6_2');
    let rb333333_3366 = document.getElementById('3.3.3.3.3.3_3.3.6.6');
    
    if (rb333333.checked) {
        tessellate333333();
    } else if (rb33434.checked) {
        tessellate33434();
    } else if (rb33344.checked) {
        tessellate33344();
    } else if (rb4444.checked) {
        tessellate4444();  
    } else if (rb3464.checked) {
        tessellate3464();
    } else if (rb4612.checked) {
        tessellate4612();
    } else if (rb3636.checked) {
        tessellate3636();
    } else if (rb3366.checked) {
        tessellate3366();
    } else if (rb666.checked) {
        tessellate666();
    } else if (rb33336.checked) {
        tessellate33336();
    } else if (rb31212.checked) {
        tessellate31212();
    } else if (rb333333_33336_1.checked) {
        tessellate333333_33336();           
    } else if (rb333333_33336_2.checked) {
        tessellate333333_33336(true);       
    } else if (rb333333_3366.checked) {
        tessellate333333_3366();           
        // all of the other tessellations are made by
        // loading a collection and tessellating that
    } else if (document.getElementById("3.3.3.3.3.3_3.3.4.12").checked) {
        tessellateOther("3.3.3.3.3.3_3.3.4.12");
    } else if (document.getElementById("3.4.6.4_3.3.3.4.4").checked) {
        tessellateOther("3.4.6.4_3.3.3.4.4");
    } else if (document.getElementById("3.3.6.6_3.3.3.3.6").checked) {
        tessellateOther("3.3.6.6_3.3.3.3.6");
    } else if (document.getElementById("3.4.4.6_3.4.6.4").checked) {
        tessellateOther("3.4.4.6_3.4.6.4");
    } else if (document.getElementById("3.4.3.3.4_3.4.6.4").checked) {
        tessellateOther("3.4.3.3.4_3.4.6.4");
    } else if (document.getElementById("3.12.12_3.4.3.12").checked) {
        tessellateOther("3.12.12_3.4.3.12");
    } else if (document.getElementById("3.4.6.4_4.12.6").checked) {
        tessellateOther("3.4.6.4_4.12.6");
    } else if (document.getElementById("4.4.4.4_3.3.3.4.4_1").checked) {
        tessellateOther("4.4.4.4_3.3.3.4.4_1");
    } else if (document.getElementById("4.4.4.4_3.3.3.4.4_2").checked) {
        tessellateOther("4.4.4.4_3.3.3.4.4_2");
    } else if (document.getElementById("3.3.3.3.3.3_3.3.3.4.4_1").checked) {
        tessellateOther("3.3.3.3.3.3_3.3.3.4.4_1");
    } else if (document.getElementById("3.3.3.3.3.3_3.3.3.4.4_2").checked) {
        tessellateOther("3.3.3.3.3.3_3.3.3.4.4_2");
    } else if (document.getElementById("3.3.3.3.3.3_3.3.4.3.4").checked) {
        tessellateOther("3.3.3.3.3.3_3.3.4.3.4");
    } else if (document.getElementById("3.3.3.4.4_3.3.4.3.4_1").checked) {
        tessellateOther("3.3.3.4.4_3.3.4.3.4_1");
    } else if (document.getElementById("4.4.3.6_6.3.6.3_1").checked) {
        tessellateOther("4.4.3.6_6.3.6.3", "square");
    } else if (document.getElementById("4.4.3.6_6.3.6.3_2").checked) {
        tessellateOther("4.4.3.6_6.3.6.3", "hex");
    } else if (document.getElementById("3.3.6.6_6.3.6.3").checked) {
        tessellateOther("3.3.6.6_6.3.6.3", "square");
    } else if (document.getElementById("3.3.3.4.4_3.3.4.3.4_2").checked) {
        tessellateOther("3.3.3.4.4_3.3.4.3.4_2");
    } 
    
    repaint();
}

function selectPolygonType(deselect) {
    const sel = document.getElementById("polygon-color-select");
    let allPolys = false;
    let ns = 0;
    
    if (sel.value === "Triangle") {
        ns = 3;
    } else if (sel.value === "Square") {
        ns = 4;
    } else if (sel.value === "Hexagon") {
        ns = 6;
    } else if (sel.value === "Dodecagon") {
        ns = 12;
    } else if (sel.value === "All Polys") {
        allPolys = true;
    } else {
        throw new Error("Unknown select value in applyColor()");
    }
    
    for (let i=0; i<polys.length; i++) {
        if (deselect) {
            polys[i].selected = false;
        } else if (allPolys || polys[i].vs.length === ns) {
            polys[i].selected = true;
        }
    }
    
    repaint();
}

function applyColor(randomColors) {
    const col = document.getElementById("polygon-color-input");
    const colVal = (randomColors) ? null : col.value;
    
    const alpha = document.getElementById("polygon-alpha-input");
    const alphaVal = (randomColors) ? null : alpha.value;
    
    const colCheckbox = document.getElementById("apply-color-checkbox");
    const alphaCheckbox = document.getElementById("apply-alpha-checkbox");
    
    const noApplyColor = !colCheckbox.checked;
    const noApplyAlpha = !alphaCheckbox.checked;
    
    for (let i=0; i<polys.length; i++) {
        if (polys[i].selected) {
            colorPoly(polys[i], colVal, alphaVal, noApplyColor, noApplyAlpha);
            polys[i].selected = false;
        }
    }
    repaint();
}

function addTcEdge() {
    if (!selectedEdge) {
        return;
    }
    let arr = null;
    if (northTcEdgeRadio.checked) {
        arr = tcEdges.north;
    } else if (southTcEdgeRadio.checked) {
        arr = tcEdges.south;
    } else if (eastTcEdgeRadio.checked) {
        arr = tcEdges.east;
    } else {
        arr = tcEdges.west;
    }
    if (!edgeInTcEdges(selectedEdge)) {
        arr.push(selectedEdge);
    }
    repaint();
}

function edgeInTcEdges(e) {
    const arrs = [tcEdges.north, tcEdges.south, tcEdges.east, tcEdges.west];
    for (let i=0; i<arrs.length; i++) {
        const arr = arrs[i];
        for (let j=0; j<arr.length; j++) {
            if (equivEdge(arr[j], e)) {
                return true;
            }
        }
    }
    return false;
}

function checkTc() {
    const n = document.getElementById("tc-iter-field").value;
    assert(n > 0, "Bad number of iterations for collection tessellation");
    const tc = new Collection(tcEdges.north, tcEdges.south, tcEdges.east, tcEdges.west);
    tessellateCollection(tc, 3);
}

function tessellateSelection(symType) {
    const selPol = [];
    for (let i=0; i<polys.length; i++) {
        if (polys[i].selected) {
            selPol.push(polys[i]);
        }
    }
    const n = document.getElementById("tc-iter-field").value;
    try {
        assert(n > 0, "Bad number of iterations for collection tessellation");
        tessellateCollection(collectionFromSelected(selPol, symType), n);
    } catch (err) {
        alert(err);
    }
}

function repaint() {
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    for (var i=0; i<polys.length; i++) {
        drawPoly(polys[i], ctx);
    }
    
    if (displayVerticesCheckbox.checked) {
        for (var i=0; i<vs.length; i++) {
            drawVertex(vs[i], ctx);
        }
    }
    
    for (let i=0; i<tcEdges.north.length; i++) {
        drawEdge(tcEdges.north[i], ctx, 'blue');
    }
    for (let i=0; i<tcEdges.south.length; i++) {
        drawEdge(tcEdges.south[i], ctx, 'brown');
    }
    for (let i=0; i<tcEdges.east.length; i++) {
        drawEdge(tcEdges.east[i], ctx, 'green');
    }
    for (let i=0; i<tcEdges.west.length; i++) {
        drawEdge(tcEdges.west[i], ctx, 'purple');
    }
    
    if (selectedEdge) {
        drawEdge(selectedEdge, ctx);
    }
    
    if (debugPoints) {
        for (let i=0; i<debugPoints.length; i++) {
            drawPoint(debugPoints[i], ctx, "green");
        }
    }
    
//    drawPoint(p, ctx, "green");
}
