
let alphaMainDiv;
let draggingDiv;
let dragChanged;
let movingDiv;

let loadLettersInput;
let loadPitchesLengthsInput;

let letterIdx = 0;

const SAMPLE_RATE = 48000;
const BASE_FREQ = 366;
const audioCtx = new AudioContext();
let source;
const ns = new NoteShifter(new PitchShifter(new FFT()));
let buf;

const LEN_BUFFER = 500;
const MIN_LEN = 22820 + 2*LEN_BUFFER;
let eighthLen = MIN_LEN;
const letters = {
    'A.wav': [10000, 7071, 24250],
    'B.wav': [8000, 3946, 22306],
    'C.wav': [9000+1000, 6368, 23146],
    'D.wav': [11000, 5936, 25007],
    'E.wav': [12000, 6988, 25408],
    'F.wav': [10000-1000, 7013, 25223],
    'G.wav': [10000+1000, 5626, 24064],
    'H.wav': [10000, 7040, 28543],
    'I.wav': [12000, 7021, 25763],
    'J.wav': [12000, 5575, 25931],
    'K.wav': [14000, 6972, 27220],
    'L.wav': [10000, 6994, 23566],
    'M.wav': [10000, 6847, 26272],
    'N.wav': [9000, 6787, 24994],
    'O.wav': [11000, 7081, 23866],
    'P.wav': [10000, 4196, 22168],
    'Q.wav': [13000, 2912, 23614],
    'R.wav': [10000, 6921, 23686],
    'S.wav': [9000, 7013, 18201],
    'T.wav': [10000, 2801, 22408],
    'U.wav': [12000, 6584, 26229],
    'V.wav': [15000, 5559, 28378],
    'wuh.mp3': [17000, 2358, 24963],
//    'W-double.wav': [9000, 223, 12058],
//    'W-you.wav': [12000, 6584, 26229], 
    'X.wav': [8000, 4196, 19699],
    'Y.wav': [15000, 6428, 28725],
    'and.wav': [5000, 0, 21887],
    'Z.wav': [12000+1000, 4550, 26938]
};

function toJSON() {
    const soundDivs = document.querySelectorAll("#alpha-main-div > div");
    const sounds = [];
    for (let i=0; i<soundDivs.length; i++) {
        let letter = soundDivs[i].id.split("-")[0];
        if (letter.match("rest")) {
            const len = parseInt(letter[4]);
            sounds.push({type: 'rest', length: len});
        } else {
            const len = soundDivs[i].params.lengthMult;
            const name = soundDivs[i].params.wavName;
            const freq = soundDivs[i].params.freqMult;
            sounds.push({type: 'sound', length: len, wavName: name, freqMult: freq});
        }
    }
    return JSON.stringify(sounds);
}

function save() {
    const json = toJSON();
    var file = new Blob([json], {type: "application/octet-stream"});
    var a = document.createElement("a");
    var url = URL.createObjectURL(file);
    a.href = url;
    a.download = "MySong.als";
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}

function reset() {
    alphaMainDiv.innerHTML = "";
    init(true);
}

function setDisplaySpanText(span, wavName) {
    span.innerText = wavName[0];
    if (wavName === "W-double.wav") {
        span.innerText = "Wd";
        span.style.padding = "0px";
    } else if (wavName === "W-you.wav") {
        span.innerText = "Wy";
        span.style.padding = "0px";
    } else if (wavName === "and.wav") {
        span.innerText = "and";
        span.style.padding = "0px";
    }
}

function createLetterDiv(wavName) {
    const letterDiv = document.createElement("div");
    const id = wavName + "-" + (letterIdx++) + "-div";
    
    let displaySpan = "<span class='letter'>" + wavName[0] + "</span>";
    if (wavName === "W-double.wav") {
        displaySpan = "<span class='letter' style='padding: 0px;'>Wd</span>";
    } else if (wavName === "W-you.wav") {
        displaySpan = "<span class='letter' style='padding: 0px;'>Wy</span>";
    } else if (wavName === "and.wav") {
        displaySpan = "<span class='letter' style='padding: 0px;'>and</span>";
    }
    
    letterDiv.id = id;
    letterDiv.className = "letter-div";
    letterDiv.innerHTML = 
        '<div class="note-length-div">' + 
        '    <img src="image/eighth.png" class="blue-border" width="20" onclick="setLength(this, \'' + id + '\',1)">' + 
        '    <img src="image/quarter.png" class="transparent-border" width="20" onclick="setLength(this, \'' + id + '\',2)">' +
        '    <img src="image/half.png" class="transparent-border" width="20" onclick="setLength(this, \'' + id + '\',4)">' +
        '</div>' + 
        '<a href="#' + id + '" class="js-a" onclick="remove(\'' + id + '\');">X</a><br>' +
        displaySpan +
        '<select class="letter-note-select">' +
        '    <option>C</option>' +
        '    <option>C#</option>' +
        '    <option>D</option>' +
        '    <option>D#</option>' +
        '    <option>E</option>' +
        '    <option>F</option>' +
        '    <option>F#</option>' +
        '    <option>G</option>' +
        '    <option>G#</option>' +
        '    <option>A</option>' +
        '    <option>A#</option>' +
        '    <option>B</option>' +
        '</select> <span id="' + id + '-ready-span"><img src="image/x.png" height="20" class="ready-img"></span>';
        
    makeDraggable(letterDiv);
    
    letterDiv.querySelector("select").addEventListener("change", function(e) {
        letterDiv.params.freqMult = Math.pow(2, e.target.selectedIndex/12);
        document.getElementById(id + '-ready-span').innerHTML = '<img src="image/x.png" height="20" class="ready-img">';
        setTimeout(function() {
            xformSound(letterDiv.params.wavName, id);
        }, 0);
    }, false);
    
    letterDiv.params = {
        'lengthMult': 1,
        'freqMult': 1,
        'wavName': wavName
    };
        
    return letterDiv;
}

let specialIdx = 0;

function init(again) {
    alphaMainDiv = document.getElementById("alpha-main-div");
    
    for (let wavName in letters) {
        const div = createLetterDiv(wavName);
        alphaMainDiv.appendChild(div);
        loadSound(wavName, div.id);
    }
    
    if (again) return;
    
    loadLettersInput = document.getElementById("load-letters-input");
    loadPitchesLengthsInput = document.getElementById("load-pitches-lengths-input");
    
    // build add node select options
    const sel = document.getElementById("add-note-select");
    for (let wavName in letters) {
        const opt = document.createElement("option");
        opt.innerText = wavName.split(".")[0];
        sel.appendChild(opt);
    }
    
    // end dragging
    document.body.addEventListener("mouseup", function (e) {
        if (draggingDiv) {
            if (dragChanged) {
                draggingDiv.style.backgroundColor = "rgba(255,255,255,0)";
                movingDiv = null;
                dragChanged = false;
            }
            draggingDiv = null;
        } else if (movingDiv) {
            movingDiv.style.backgroundColor = "rgba(255,255,255,0)";
            movingDiv = null;   
        }
    }, false);
    
    // listener to load an alphasong
    document.getElementById("file-input").addEventListener("change", function(e) {
        var file = e.target.files[0];
        if (!file) {
            return;
        }
        var r = new FileReader();
        r.onload = function(e) {
            const json = JSON.parse(e.target.result);
            if (loadLettersInput.checked || loadPitchesLengthsInput.checked) {
                const currentJson = JSON.parse(toJSON());
                // count all elements
                if (currentJson.length !== json.length) {
                    alert("Current elements = " + currentJson.length + ", loaded elements = " + json.length);
                    return;
                }
                // count rests
                let currentRests = 0;
                let rests = 0;
                for (let i=0; i<json.length; i++) {
                    if (json[i].type === "rest") {
                        rests++;
                    }
                }
                for (let i=0; i<currentJson.length; i++) {
                    if (currentJson[i].type === "rest") {
                        currentRests++;
                    }
                }
                if (currentRests !== rests) {
                    alert("Must have same number of rests");
                    return;
                }
                // update current divs
                const soundDivs = document.querySelectorAll("#alpha-main-div > div");
                if (loadLettersInput.checked) {
                    let j=0;
                    for (let i=0; i<soundDivs.length; i++) {
                        if (soundDivs[i].id.match("rest")) {
                            continue;
                        }
                        while (json[j].type === "rest") {
                            j++;
                        }
                        soundDivs[i].params.wavName = json[j].wavName;
                        const displaySpan = soundDivs[i].querySelector(".letter");
                        setDisplaySpanText(displaySpan, json[j].wavName);              
                        document.getElementById(soundDivs[i].id + '-ready-span').innerHTML = 
                                '<img src="image/x.png" height="20" class="ready-img">';
                        xformSound(json[j].wavName, soundDivs[i].id);
                        j++;
                    }
                } else if (loadPitchesLengthsInput.checked) {
                    let j=0;
                    for (let i=0; i<soundDivs.length; i++) {
                        if (soundDivs[i].id.match("rest")) {
                            continue;
                        }
                        while (json[j].type === "rest") {
                            j++;
                        }
                        setLengthHighLevel(soundDivs[i], json[j].length, true);
                        const sel = soundDivs[i].querySelector("select");
                        const idx = Math.round(12*Math.log(json[j].freqMult)/Math.log(2));
                        sel.selectedIndex = idx;
                        sel.dispatchEvent(new Event('change'));
                        j++;
                    }
                }
                return;
            }
            alphaMainDiv.innerHTML = "";
            for (let i=0; i<json.length; i++) {
                const entry = json[i];
                if (entry.type === 'rest') {
                    addRest(entry.length);
                } else if (entry.type === 'sound') {
                    const div = createLetterDiv(entry.wavName);
                    alphaMainDiv.appendChild(div);
                    setLengthHighLevel(div, entry.length, true);
                    const sel = div.querySelector("select");
                    const idx = Math.round(12*Math.log(entry.freqMult)/Math.log(2));
                    sel.selectedIndex = idx;   
                    sel.dispatchEvent(new Event('change'));
                }
            }
        };
        r.readAsText(file);
    }, false);
}

function buildRandomWavNames() {
    const wavNames = [];
    for (let key in letters) {
        wavNames.push(key);
    }
    for (let i=0; i<wavNames.length; i++) {
        const temp = wavNames[i];
        const idx = Math.floor(wavNames.length*Math.random());
        wavNames[i] = wavNames[idx];
        wavNames[idx] = temp;
    }
    return wavNames;
}

function randomizeLetters() {
    const soundDivs = document.querySelectorAll("#alpha-main-div > div");
    const wavNames = buildRandomWavNames();
    for (let i=0; i<soundDivs.length; i++) {
        if (soundDivs[i].id.match("rest")) {
            continue;
        }
        const displaySpan = soundDivs[i].querySelector(".letter");
        if (wavNames.length === 0) {
            wavNames = buildRandomWavNames();
        }
        const wavName = wavNames.pop();
        soundDivs[i].params.wavName = wavName;
        setDisplaySpanText(displaySpan, wavName);
        document.getElementById(soundDivs[i].id + '-ready-span').innerHTML = 
                '<img src="image/x.png" height="20" class="ready-img">';
        xformSound(wavName, soundDivs[i].id);
    }
}

function randomizePitches() {
    const soundDivs = document.querySelectorAll("#alpha-main-div > div");
    for (let i=0; i<soundDivs.length; i++) {
        if (soundDivs[i].id.match("rest")) {
            continue;
        }
        const sel = soundDivs[i].querySelector('select');
        sel.selectedIndex = Math.floor(12*Math.random());
        sel.dispatchEvent(new Event('change'));
    }
}

function randomizeLengths() {
    const soundDivs = document.querySelectorAll("#alpha-main-div > div");
    const lengths = [1, 2, 4];
    for (let i=0; i<soundDivs.length; i++) {
        if (soundDivs[i].id.match("rest")) {
            continue;
        }
        setLengthHighLevel(soundDivs[i], lengths[Math.floor(3*Math.random())]);
    }
}

function remove(id) {
    const elt = document.getElementById(id);
    elt.parentElement.removeChild(elt);
}

function move(id) {
    const elt = document.getElementById(id);
    movingDiv = elt;
    movingDiv.style.backgroundColor = "LightBlue";
}

function makeDraggable(letterDiv) {
    letterDiv.style.userSelect = "none";
    
    /*letterDiv.unselectable = "on";
    letterDiv.addEventListener("onselectstart", function () {
        return false;
    }, false);*/
    
    letterDiv.addEventListener("mousedown", function (e) {
        // switch elements without awkward dragging
        if (movingDiv) {
            if (movingDiv === letterDiv) {
                return;
            }
            // we can move before to
            // 1) before letterDiv 2) after letterDiv or 3) replace letterDiv
            const soundDivs = document.querySelectorAll("#alpha-main-div > div");
            let idx = 0;
            for (; idx < soundDivs.length; idx++) {
                if (soundDivs[idx] === letterDiv) {
                    break;
                }
            }
            if (document.getElementById("move-before-input").checked) {
                alphaMainDiv.removeChild(movingDiv);
                alphaMainDiv.insertBefore(movingDiv, soundDivs[idx]);
            } else if (document.getElementById("move-after-input").checked) {
                alphaMainDiv.removeChild(movingDiv);
                if (idx === soundDivs.length-1) {   // cannot be soundDivs.length
                    alphaMainDiv.appendChild(movingDiv);
                } else {
                    alphaMainDiv.insertBefore(movingDiv, soundDivs[idx+1]);
                }
            } else {
                let temp = document.createElement("div");
                alphaMainDiv.replaceChild(temp, movingDiv);
                alphaMainDiv.replaceChild(movingDiv, letterDiv);
                alphaMainDiv.replaceChild(letterDiv, temp);
            }
            return;
        }
        draggingDiv = letterDiv;
        movingDiv = letterDiv;
        draggingDiv.style.backgroundColor = "LightBlue";
    }, false);
    
    letterDiv.addEventListener("mouseover", function (e) {
        if (!draggingDiv) {
            return;
        }
        if (draggingDiv === letterDiv) {
            return;
        }
        
        let temp = document.createElement("div");
        alphaMainDiv.replaceChild(temp, draggingDiv);
        alphaMainDiv.replaceChild(draggingDiv, letterDiv);
        alphaMainDiv.replaceChild(letterDiv, temp);
        dragChanged = true;
    }, false);
}

function setLengthHighLevel(div, length, noXform) {
    const imgs = div.querySelectorAll("img");
    for (let j=0; j<imgs.length; j++) {
        if (length === 1 && imgs[j].src.match("eighth")) {
            setLength(imgs[j], div.id, length, noXform);
            break;
        } else if (length === 2 && imgs[j].src.match("quarter")) {
            setLength(imgs[j], div.id, length, noXform);
            break;
        } else if (length === 4 && imgs[j].src.match("half")) {
            setLength(imgs[j], div.id, length, noXform);
            break;
        }
    }
}

function setLength(img, wavId, lengthMult, noXform) {
    const div = document.getElementById(wavId);
    const imgs = div.querySelectorAll("img");
    for (let i=0; i<imgs.length; i++) {
        imgs[i].className = "transparent-border";
    }
    img.className = "blue-border";
    let wavName = wavId.split('\.')[0];
    if (wavId.match('mp3')) {
        wavName += '.mp3';
    } else {
        wavName += '.wav';
    }
    div.params.lengthMult = lengthMult;
    document.getElementById(wavId + '-ready-span').innerHTML = '<img src="image/x.png" height="20" class="ready-img">';
    if (noXform) {
        return;
    }
    setTimeout(function () {
        xformSound(wavName, wavId);
    }, 0);
}

function xformSound(wavName, wavId) {
    const params = document.getElementById(wavId).params;
    const letter = letters[wavName];
    const input = letter[3];
        
    let extendBy = params.lengthMult*eighthLen - input.length;
    if (extendBy < 0) {
        extendBy = 0;
    }
    
    let wuhMult = 1;
    if (wavName.match('wuh')) {
        wuhMult = 1.3;
    } else if (wavName.match('and')) {
        wuhMult = 1.2;
    }
    
    document.getElementById(wavId).sound = 
        ns.shiftAndExtend(input, audioCtx, SAMPLE_RATE, BASE_FREQ*wuhMult, BASE_FREQ*params.freqMult*wuhMult, 
        extendBy, letter[0] - letter[1] + LEN_BUFFER);
    
    document.getElementById(wavId + '-ready-span').innerHTML = '<img src="image/check.png" height="20" class="ready-img">';
}

function loadSound(wavName, wavId) {
    fetch('sound/audio-alphabet/' + wavName)
        .then(response => response.arrayBuffer())
        .then(data => {
            audioCtx.decodeAudioData(data, function(orig) {
                const letter = letters[wavName];
                const len = letter[2]-letter[1]+LEN_BUFFER;
                const input = new Float32Array(len+2*LEN_BUFFER);
                const chan0 = orig.getChannelData(0);
                
                let mult = 1;
                if (wavName === "O.wav") {
                    mult = 1.2;  
                } if (wavName === "Q.wav") {
                    mult = 1.4;
                } else if (wavName === "W-double.wav") {
                    mult = 1.2;
                } else if (wavName === "U.wav" || wavName === "W-you.wav") {
                    mult = 1.4;
                } else if (wavName === "V.wav") {
                    mult = 1.5;
                } else if (wavName === "X.wav") {
                    mult = 0.7;
                } else if (wavName === "B.wav") {
                    mult = 1.4;
                } else if (wavName === "C.wav") {
                    mult = 1.2;
                } else if (wavName === "and.wav") {
                    mult = 1.2;
                }
                
                for (let i=0, j=letter[1]-LEN_BUFFER; i<len; i++, j++) {
                    input[i] = mult*chan0[j];
                }
                
                letter.push(input);
                xformSound(wavName, wavId);
                
            }, function (err) {
                console.log(err);
            });
        });
}

function addNote() {
    const sel = document.getElementById("add-note-select");
    const wavName = sel.value + ((sel.value.match('wuh')) ? '.mp3' : ".wav");
    const div = createLetterDiv(wavName);
    alphaMainDiv.appendChild(div);
    loadSound(wavName, div.id); 
}

function addRest(len) {
    const r = document.createElement("div");
    r.id = "rest" + len + "-" + (letterIdx++) + "-div";
    r.className = "letter-div";
    let imgSrc;
    if (len === 1) {
        imgSrc = "eighth-rest.png";
    } else if (len === 2) {
        imgSrc = "quarter-rest.png";
    } else {
        imgSrc = "half-rest.png";
    }
    r.innerHTML = 
        '<a href="#' + r.id + '" class="js-a" onclick="remove(\'' + r.id + '\');">X</a><br>' +
        '<span class="letter"><img src="image/' + imgSrc + '" height="60"></span>';
    makeDraggable(r);
    alphaMainDiv.appendChild(r);
}

function play() {
    let totalLen = 0;
    const soundDivs = document.querySelectorAll("#alpha-main-div > div");
    const sounds = [];
    for (let i=0; i<soundDivs.length; i++) {
        let letter = soundDivs[i].id.split("-")[0];
        if (letter.match("rest")) {
            const len = parseInt(letter[4]);
            totalLen += len*eighthLen;
            sounds.push(len);
        } else {
            totalLen += soundDivs[i].sound.length;
            sounds.push(soundDivs[i].sound);
        }
    }
    buf = audioCtx.createBuffer(1, totalLen, SAMPLE_RATE);
    const bufChan0 = buf.getChannelData(0);
    let i = 0;
    for (let k=0; k<sounds.length; k++) {
        if (sounds[k] === 1 || sounds[k] === 2 || sounds[k] === 4) {
            i += sounds[k]*eighthLen;
            continue;
        }
        const letterChan0 = sounds[k].getChannelData(0);
        for (let j=0; j<letterChan0.length; j++, i++) {
            bufChan0[i] = letterChan0[j];
        }
    }
    source = audioCtx.createBufferSource();
    source.buffer = buf;
    source.connect(audioCtx.destination);
    source.start(0);
}

function down() {
    if (!buf) {
        alert('Must play song first');
        return;
    }
    //const file = new Blob([wav.getBuffer()], {type: "audio/wav"});
    const file = bufferToWave(buf, 0, buf.length);
    const a = document.createElement("a");
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = "MySong.wav";
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}

function stop() {
    if (!source) return;
    source.stop();
}