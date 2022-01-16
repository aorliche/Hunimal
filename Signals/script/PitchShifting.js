// DOM
let infoP;
let timeCanvas;
let freqCanvas;
let bufferLengthSpan;
let samplingRateSpan;
let numChannelsSpan;
let cursorSpan;
let soundFileSelect;
let pitchShiftFactorRange;
let pitchShiftFactorSpan;

// WebAudio
let audioCtx;

// FFT
const fft = new FFT();
const ps = new PitchShifter(fft);

// Pitch shift
let originalBuffer = null;
let shiftedBuffer = null;

// Canvas
let maxCursor;
let cursor = 0;

const FRAME_SIZE = ps.FRAME_SIZE;

function moveToStart() {
    const buf = originalBuffer.getChannelData(0);
    for (let i=0; i<buf.length-FRAME_SIZE; i++) {
        if (buf[i] > 0.01) {
            cursor = i;
            cursorSpan.innerText = cursor;
            repaintTimeCanvas();
            repaintFreqCanvas();
            break;
        }
    }
}

function scrollTimeCanvas(dx) {
    cursor += dx;
    if (cursor >= maxCursor-FRAME_SIZE) {
        cursor = maxCursor-FRAME_SIZE;
    } else if (cursor <= 0) {
        cursor = 0;
    }
    cursorSpan.innerText = cursor;
    repaintTimeCanvas();
    repaintFreqCanvas();
}

function repaintTimeCanvas() {
    const buf = originalBuffer.getChannelData(0);
    const ctx = timeCanvas.getContext("2d");
    const w = timeCanvas.width;
    const h = timeCanvas.height;
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,w,h);
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(0,buf[cursor]*h/2+h/2);
    for (let i=1, j=cursor; i<FRAME_SIZE; i++, j++) {
        let x = i*w/FRAME_SIZE;
        let y = buf[j]*h/2+h/2;
        ctx.lineTo(x,y);
    }
    ctx.stroke();
    const buf2 = shiftedBuffer.getChannelData(0);
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(0,buf2[cursor]*h/2+h/2);
    for (let i=1, j=cursor; i<FRAME_SIZE; i++, j++) {
        let x = i*w/FRAME_SIZE;
        let y = buf2[j]*h/2+h/2;
        ctx.lineTo(x,y);
    }
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.fillText(1, 5, 15);
    ctx.fillText(-1, 5, h-5);
}

const MAX_BIN = 80;
const MAX_MAG = 0.2;

function repaintFreqCanvas() {
    const buf = fft.toMagPhase(
            fft.fft(
            fft.applyHannWindow(getFrame()))).mag;
    const fm = ps.getFrameFreqMagSimple(buf);
    const ctx = freqCanvas.getContext("2d");
    const w = freqCanvas.width;
    const h = freqCanvas.height;
    const h2 = h-20;
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,w,h);
    ctx.strokeStyle = "purple";
    ctx.beginPath();
    ctx.moveTo(0,-buf[0]/MAX_MAG*h2+h-20);
    for (let i=1; i<MAX_BIN; i++) {
        let x = i*w/MAX_BIN;
        let y = -buf[i]/MAX_MAG*h2+h-20;
        ctx.lineTo(x,y);
    }
    ctx.stroke();
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(0,h-20);
    ctx.lineTo(w,h-20);
    ctx.stroke();
    for (let i=5; i<MAX_BIN; i+= 5) {
        ctx.fillText(i, i*w/MAX_BIN-5, h-10);
    }
    for (let i=0; i<5; i++) {
        ctx.fillText(((5-i)*MAX_MAG/5).toFixed(2), 5, i*h2/5+10);
    }
    for (let i=0; i<fm.length; i++) {
        drawFreq(fm[i], ctx, w, h);
    }
}

function drawFreq(fm, ctx, w, h) {
    ctx.strokeStyle = "red";
    const tipX = fm[0]*w/MAX_BIN;
    const tipY = -fm[1]/MAX_MAG*(h-20)+h-20;
    ctx.beginPath();
    ctx.moveTo(tipX, h-20);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(tipX-5, tipY+5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(tipX+5, tipY+5);
    ctx.stroke();
}

function init() {
    infoP = document.getElementById("info-p");
    timeCanvas = document.getElementById("time-canvas");
    freqCanvas = document.getElementById("freq-canvas");
    bufferLengthSpan = document.getElementById("buffer-length-span");
    samplingRateSpan = document.getElementById("sampling-rate-span");
    numChannelsSpan = document.getElementById("num-channels-span");
    cursorSpan = document.getElementById("cursor-span");
    soundFileSelect = document.getElementById("sound-file-select");
    pitchShiftFactorRange =
            document.getElementById("pitch-shift-factor-range");
    pitchShiftFactorSpan = 
            document.getElementById("pitch-shift-factor-span");   
            
    pitchShiftFactorRange.addEventListener("input", function(e) {
        let db = pitchShiftFactorRange.value;
        pitchShiftFactorSpan.innerText = Math.pow(10, db/50).toFixed(2);
    }, false);
    
    // build soundFileSelect
    for (let i=0; i<26; i++) {
        const wavName = String.fromCharCode(0x41+i) + ".wav";
        const opt = document.createElement("option");
        opt.innerText = wavName;
        soundFileSelect.appendChild(opt);
    }
    
    let opt = document.createElement("option");
    opt.innerText = "W-double.wav";
    soundFileSelect.appendChild(opt);
    
    opt = document.createElement("option");
    opt.innerText = "W-you.wav";
    soundFileSelect.appendChild(opt);
    
    audioCtx = new AudioContext();
    
    try {
        loadSound();
    } catch (err) {
        displayError(err);
    }
    
    let prevX = null;
    
    timeCanvas.addEventListener("mousedown", function (e) {
        prevX = e.clientX;
    }, false);
    
    timeCanvas.addEventListener("mouseup", function (e) {
        prevX = null;
    }, false);
    
    timeCanvas.addEventListener("mouseleave", function (e) {
        prevX = null;
    }, false);
    
    timeCanvas.addEventListener("mousemove", function (e) {
        if (!prevX && prevX !== 0) {
            return;
        }
        nextX = e.clientX;
        const dx = prevX - nextX;
        if (dx != 0) {
            scrollTimeCanvas(dx);
        }
        prevX = nextX;
    }, false);
}

function loadSound() {
    const fileName = soundFileSelect.value;
    const req = new XMLHttpRequest();
    req.onload = function() {
        let respBuffer = req.response;
        audioCtx.decodeAudioData(respBuffer, 
            function (buf) {
                originalBuffer = buf;
                maxCursor = originalBuffer.getChannelData(0).length;
                shiftedBuffer = audioCtx.createBuffer(1, originalBuffer.length, originalBuffer.sampleRate);
                bufferLengthSpan.innerText = originalBuffer.getChannelData(0).length;
                samplingRateSpan.innerText = originalBuffer.sampleRate;
                numChannelsSpan.innerText = originalBuffer.numberOfChannels;
                moveToStart();
                displayMessage("Loaded " + soundFileSelect.value + ".");
            }, 
            function (err) {displayError(err);}
        );
    }
    req.open("GET", "sound/audio-alphabet/" + fileName);
    req.responseType = "arraybuffer";
    req.send();
}

function displayError(err) {
    displayMessage(err, true);
}

function displayMessage(msg, isErr) {
    const text = document.createTextNode(msg + " ");
    const span = document.createElement("span");
    const link = document.createElement("a");
    link.innerText = "Clear";
    link.href = "#";
    link.onclick = function(e) {
        e.preventDefault();
        infoP.style.display = "none";
    };
    span.appendChild(text);
    if (isErr) {
        span.style.color = "red";
        span.style.fontWeight = "bold";
    }
    infoP.innerHTML = "";
    infoP.appendChild(span);
    infoP.appendChild(link);
    infoP.style.display = "block";
}

function getFrame() {
    const buf = originalBuffer.getChannelData(0);
    const frame = new Float32Array(FRAME_SIZE);
    for (let i=0, j=cursor; i<FRAME_SIZE; i++, j++) {
        frame[i] = buf[j];
    }
    return frame;
}

function pitchShift() {
    ps.pitchShift(
            originalBuffer.getChannelData(0), 
            shiftedBuffer.getChannelData(0), 
            pitchShiftFactorSpan.innerText);
    repaintTimeCanvas();
}

function playOriginal() {
    const source = audioCtx.createBufferSource();
    source.buffer = originalBuffer;
    source.connect(audioCtx.destination);
    source.start(0);
}

function playShifted() {
    const source = audioCtx.createBufferSource();
    source.buffer = shiftedBuffer;
    source.connect(audioCtx.destination);
    source.start(0);
}