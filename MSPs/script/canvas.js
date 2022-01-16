/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function saveCanvas() {
    var text = JSON.stringify(msps);
    var file = new Blob([text], {type: "application/octet-stream"});
    var a = document.createElement("a");
    var url = URL.createObjectURL(file);
    a.href = url;
    a.download = "canvas.cnv";
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}

function loadCanvas(json) {
    msps = JSON.parse(json);
    for (var i=0; i<msps.length; i++) {
        restoreIntegrity(msps[i]);
    }
    selectedMSP = null;
}