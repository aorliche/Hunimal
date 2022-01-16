function FFT() {
    function assert(exp, msg) {
        if (!exp) {
            throw new Error(msg);
        }
    }
    
    const bitReverseTables = [];
    this.bitReverseTables = bitReverseTables;
    
    function makeComplexBuffer(real, imag) {
        assert(real.length === imag.length, 
                "real and imag lengths different");
        const buf = {};
        buf.real = real;
        buf.imag = imag;
        buf.length = real.length;
        return buf;
    }
    
    this.makeComplexBuffer = makeComplexBuffer;
    
    function isComplexBuffer(arr) {
        return arr.real && arr.imag && arr.length;
    }
    
    function copyComplexBuffer(input, scale, bitRev) {
        const nbits = Math.log2(input.length);
        assert(nbits === Math.floor(nbits), "input length not a power of two");
        
        if (bitRev && !bitReverseTables[nbits]) {
            makeBitReverseTable(nbits);
        }
        const table = bitReverseTables[nbits];
        
        const real = new Float32Array(input.length);
        const imag = new Float32Array(input.length);
        
        if (!scale) {
            scale = 1;
        }
        for (let i=0; i<input.length; i++) {
            let j = (bitRev) ? table[i] : i;
            real[j] = input.real[i]*scale;
            imag[j] = input.imag[i]*scale;
        }
        return makeComplexBuffer(real, imag);
    }
    
    function ditfft2(input, idx, N, s, sign) {
        if (N === 1) {
            return [[input.real[idx], input.imag[idx]]];
        } else {
            const E = ditfft2(input, idx, N/2, 2*s, sign);
            const O = ditfft2(input, idx+s, N/2, 2*s, sign);
            const X = new Array(N);
            for (let k=0; k<N/2; k++) {
                const er = E[k][0];
                const ei = E[k][1];
                const or = O[k][0];
                const oi = O[k][1];
                const phi = 2*Math.PI*k/N;
                const fr = Math.cos(phi);
                const fi = sign*Math.sin(phi);
                const xr1 = er + fr*or - fi*oi;
                const xi1 = ei + fi*or + fr*oi;
                const xr2 = er - fr*or + fi*oi;
                const xi2 = ei - fi*or - fr*oi;
                X[k] = [xr1, xi1];
                X[k+N/2] = [xr2, xi2];
            }
            return X;
        }
    }
    
    function ditfft2_start(input, sign) {
        const N = input.length;
        assert(N > 0, "Zero input length");
        
        const log2N = Math.log2(N);
        assert(log2N === Math.round(log2N), "Input length not a power of 2");
        
        if (!isComplexBuffer(input)) {
            const imag = new Float32Array(N);
            input = makeComplexBuffer(input, imag);
        }
        
        if (sign === 1) {
            input = copyComplexBuffer(input, 1/N);
        }
        
        const oldbuf = ditfft2(input, 0, N, 1, sign);
        const real = new Float32Array(N);
        const imag = new Float32Array(N);
        for (let i=0; i<N; i++) {
            real[i] = oldbuf[i][0];
            imag[i] = oldbuf[i][1];
        }
        const buf = {};
        buf.real = real;
        buf.imag = imag;
        buf.length = N;
        return buf;
        
    }
    
    this.ditfft2 = function(input) {return ditfft2_start(input, -1);}
    this.iditfft2 = function(input) {return ditfft2_start(input, 1);}
    
    function bitReverse(n, N) {
        assert(n >= 0, "Negative argument");
        assert(Math.floor(n) === n, "Fractional argument");
        assert(Math.log2(n) <= N, "Insufficient number of bits N"); 
        if (n === 0) {
            return 0;
        }
        let r = 0;
        for (let i=0; i<N/2; i++) {
            let t = N-2*i-1;
            r |= ((n & (1 << (N-i-1))) >> t);
            r |= ((n & (1 << i)) << t);
        }
        return r;
    }
    
    this.bitReverse = bitReverse;
    
    function makeBitReverseTable(N) {
        assert(N > 0, "Number of bits is not positive");
        assert(N <= 16, "Too many bits (max is 16)");
        if (bitReverseTables[N]) {
            return;
        }
        const max = Math.pow(2,N);
        const table = [];
        for (let i=0; i<max; i++) {
            table[i] = bitReverse(i, N);
        }
        bitReverseTables[N] = table;
    }
    
    this.makeBitReverseTable = makeBitReverseTable;
    
    // input modified in place
    function fft(input, sign) {
        const n = input.length;
        const log2n = Math.log2(n);
        for (let s = 1; s <= log2n; s++) {
            const m = Math.pow(2,s);
            const phi = 2*Math.PI/m;
            const wmr = Math.cos(phi);
            const wmi = sign*Math.sin(phi);
            //console.log(`m ${m} phi ${phi} wmr ${wmr} wmi ${wmi}`);
            for (let k=0; k<n; k+=m) {
                let wr = 1;
                let wi = 0;
                for (let j=0; j<m/2; j++) {
                    const tr = wr*input.real[k+j+m/2] - wi*input.imag[k+j+m/2];
                    const ti = wr*input.imag[k+j+m/2] + wi*input.real[k+j+m/2];
                    const ur = input.real[k+j];
                    const ui = input.imag[k+j];
                    input.real[k+j] = ur + tr;
                    input.imag[k+j] = ui + ti;
                    input.real[k+j+m/2] = ur - tr;
                    input.imag[k+j+m/2] = ui - ti;
                    const wwmr = wr*wmr - wi*wmi;
                    const wwmi = wr*wmi + wi*wmr;
                    wr = wwmr;
                    wi = wwmi;
                }
            }
        }
        return input;
    }
    
    function fft_start(input, sign) {
        const N = input.length;
        assert(N > 0, "Zero input length");
        
        const log2N = Math.log2(N);
        assert(log2N === Math.round(log2N), "Input length not a power of 2");
        
        if (!isComplexBuffer(input)) {
            const imag = new Float32Array(N);
            input = makeComplexBuffer(input, imag);
        }
        
        if (sign === 1) {
            input = copyComplexBuffer(input, 1/N, true);
        } else {
            input = copyComplexBuffer(input, 1, true);
        }
        
        return fft(input, sign);
    }
    
    this.fft = function(input) {return normalize(fft_start(input, -1));}
    this.ifft = function(input) {return normalize(fft_start(input, 1));}
    
    function normalize(input) {
        const real = input.real;
        const imag = input.imag;
        for (let i=1; i<input.length/2; i++) {
            real[i] *= 2;
            imag[i] *= 2;
        }
        for (let i=Math.floor(input.length/2); i<input.length; i++) {
            real[i] = 0;
            imag[i] = 0;
        }
        return input;
    }
    
    function applyHannWindow(input) {
        const N = input.length;
        const c = 2*Math.PI/N;
        for (let i=0; i<N; i++) {
            const w = 0.5*(1-Math.cos(c*i));
            if (input.real) {
                input.real[i] *= w;
                input.imag[i] *= w;
            } else {
                input[i] *= w;
            }
        }
        return input;
    }
    
    this.applyHannWindow = applyHannWindow;
    
    function toMagPhase(input) {
        const mag = new Float32Array(input.length);
        const phase = new Float32Array(input.length);
        const re = input.real;
        const im = input.imag;
        for (let i=0; i<input.length; i++) {
            mag[i] = Math.sqrt(re[i]*re[i]+im[i]*im[i])/input.length;
            phase[i] = Math.atan2(im[i],re[i]);
        }
        const mp = {};
        mp.mag = mag;
        mp.phase = phase;
        mp.length = input.length;
        return mp;
    }
    
    this.toMagPhase = toMagPhase;
    
    function findPeaks(mag, minMag, maxBin) {
        const peaks = [];
        let savedMag = 0;
        let ascending = true;
        for (let i=0; i<maxBin; i++) {
            if (mag[i] > savedMag) {
                ascending = true;
            } else if (ascending && savedMag > minMag) {
                peaks.push([i-1, savedMag]);
                ascending = false;
            } else {
                ascending = false;
            }
            savedMag = mag[i];
        }
        return peaks;
    }
    
    this.findPeaks = findPeaks;
    
    function sinc(x) {
        const y = Math.sin(x)/x;
        return isNaN(y) ? 1 : y;
    }
    
    function createRectTable() {
        const getRectPoint = function (mag, x) {
            return mag*sinc(Math.PI*x);
        }
        const table = [];
        for (let x = 0.5; x <= 1.501; x += 0.5) {
            const row = [
                    getRectPoint(1, -x),
                    getRectPoint(1, 1-x),
                    getRectPoint(1, 2-x)];
            const max = Math.max(...row);
            row[0] /= max;
            row[1] /= max;
            row[2] /= max;
            table.push(row);
        }
        return table;
    }
    
    const rectTable = {max: 1, tab: createRectTable()};
    
    function createHannTable() {
        const getHannPoint = function (mag, x) {
            return mag*Math.abs(
                0.5*sinc(Math.PI*x)
                + 0.25*sinc(Math.PI*(x-1))
                + 0.25*sinc(Math.PI*(x+1)));
        }
        const table = [];
        for (let x = 0.5; x <= 1.501; x += 0.05) {
            const row = [
                    getHannPoint(1, -x),
                    getHannPoint(1, 1-x),
                    getHannPoint(1, 2-x)];
            const max = Math.max(...row);
            row[0] /= max;
            row[1] /= max;
            row[2] /= max;
            table.push(row);
        }
        return table;
    }
    
    const hannTable = {max: 0.5, tab: createHannTable()};
    
    function solvePoints(m1, m2, m3, tableObj) {
        const max = Math.max(m1, m2, m3);
        const table = tableObj.tab;
        const tableMax = tableObj.max;
        m1 /= max;
        m2 /= max;
        m3 /= max;
        let savX = -1;
        let savMag = -1;
        let savCost = Infinity;
        for (let i=0; i<table.length; i++) {
            const row = table[i];
            const a = row[0]-m1;
            const b = row[1]-m2;
            const c = row[2]-m3;
            const cost = a*a + b*b + c*c;
            if (cost < savCost) {
                savX = i*0.05+0.5;
                savMag = max/tableMax;
                savCost = cost;
            }
        }
        return [savX, savMag, savCost];
    }
    
    function findTrueFreqMag(mag, minMag, maxBin) {
        const peaks = findPeaks(mag, minMag, maxBin);
        const freqMag = [];
        for (let i=0; i<peaks.length; i++) {
            const bin = peaks[i][0];
            if (bin === 0) {
                continue;
            }
            const tri = solvePoints(mag[bin-1], mag[bin], mag[bin+1], 
                    hannTable);
            freqMag.push([tri[0]+bin-1, tri[1], tri[2]]);
        }
        return freqMag;
    }
    
    this.findTrueFreqMag = findTrueFreqMag;
}