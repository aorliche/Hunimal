function tessellateOther(fileName, symType) {
    const req = new XMLHttpRequest();
    req.onload = function() {
        parse(req.response);
        for (let i=0; i<polys.length; i++) {
            polys[i].selected = true;
        }
        const tcIterField = document.getElementById("tc-iter-field");
        const iterField = document.getElementById("iter-field");
        const sav = tcIterField.value;
        tcIterField.value = iterField.value;
        try {
            tessellateSelection(symType);
        } catch (err) {
            alert(err);
        } finally {
            tcIterField.value = sav;
            for (let i=0; i<polys.length; i++) {
                polys[i].selected = false;
            }
        }
        repaint();
    }
    req.open("GET", "tessellation/" + fileName + ".tes");
    req.responseType = "text";
    req.send();
}