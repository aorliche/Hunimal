function PitchShifter(fft) {
    
    const MIN_MAG = 0.001; // so low for "ss" sound
    const MAX_BIN = 100;
    const FRAME_SIZE = 1024;
    
    this.MIN_MAG = MIN_MAG;
    this.MAX_BIN = MAX_BIN;
    this.FRAME_SIZE = FRAME_SIZE;
    
    function getFrameFreqMagSimple(mag) {
        return fft.findTrueFreqMag(mag, MIN_MAG, MAX_BIN);
    }
    
    this.getFrameFreqMagSimple = getFrameFreqMagSimple;
    
    function getFrameFreqMag(sig, frameStart) {
        const frame = new Float32Array(FRAME_SIZE);
        let frameEnd = frameStart+FRAME_SIZE;
        if (frameEnd > sig.length) {
            frameEnd = sig.length;
        }
        for (let i=0, j=frameStart; j<frameEnd; i++, j++) {
            frame[i] = sig[j];
        }
        fft.applyHannWindow(frame);
        
        const fm = fft.findTrueFreqMag(
                fft.toMagPhase(fft.fft(frame)).mag, 
                MIN_MAG, MAX_BIN);
        //console.log(fm);
        return fm;
        
    }
    
    this.getFrameFreqMag = getFrameFreqMag;
    
    function findPairs(prevFM, curFM, mult) {
        if (!mult) { 
            mult = 1;
        }
        prevFM = prevFM.slice();
        curFM = curFM.slice();
        const pairs = [];
        for (let i=0; i<prevFM.length; i++) {
            for (let j=0; j<curFM.length; j++) {
                if (Math.abs(prevFM[i][0] - curFM[j][0]) < 1.5*mult) {
                    pairs.push(
                            [prevFM[i][0], prevFM[i][1], 
                            curFM[j][0], curFM[j][1]]);
                    prevFM.splice(i--,1);
                    curFM.splice(j--,1);
                    break;
                }
            }
        }
        for (let i=0; i<prevFM.length; i++) {
            pairs.push([prevFM[i][0], prevFM[i][1], prevFM[i][0], 0]);
        }
        for (let i=0; i<curFM.length; i++) {
            pairs.push([curFM[i][0], 0, curFM[i][0], curFM[i][1]]);
        }
        return pairs;
    }
    
    this.findPairs = findPairs;
    
    function findAllPairs(sig) {
        const freqMags = [];
        for (let i=0; i<sig.length; i+=FRAME_SIZE) {
            freqMags.push(getFrameFreqMag(sig, i));
        }
        const allPairs = [];
        for (let i=0; i<freqMags.length; i++) {
            const prevFM = (i === 0) ? [] : freqMags[i-1];
            const curFM = freqMags[i];
            allPairs.push(findPairs(prevFM, freqMags[i]));
        }
        return allPairs;
    }
    
    this.findAllPairs = findAllPairs;
    
    function findAllPairs2(freqMags, mult) {
        const allPairs = [];
        for (let i=0; i<freqMags.length; i++) {
            const prevFM = (i === 0) ? [] : freqMags[i-1];
            const curFM = freqMags[i];
            allPairs.push(findPairs(prevFM, freqMags[i], mult));
        }
        return allPairs;
    }
    
    function reconstruct(sig2, freqMags, mult) {
        const allPairs = findAllPairs2(freqMags, mult);
        let phases = {};
        for (let i=0; i<allPairs.length; i++) {
            const pairs = allPairs[i];
            const newPhases = {};
            for (let j=i*FRAME_SIZE-FRAME_SIZE/2, k=0; 
                    k<FRAME_SIZE && j<sig2.length; j++, k++) {
                if (j < 0) {
                    continue;
                }
                sig2[j] = 0;
                const FS = FRAME_SIZE-1;
                for (let l=0; l<pairs.length; l++) {
                    const fs = pairs[l][0];
                    const ms = pairs[l][1];
                    const fe = pairs[l][2];
                    const me = pairs[l][3];
                    let phase = 0;
                    if (ms !== 0) {
                        const phaseInc = 2*Math.PI*fs;
                        phase += phaseInc;
                        if (phases[""+fs]) {
                            phase += phases[""+fs];
                        }
                        newPhases[""+fe] = phase;
                    }
                    sig2[j] += ((ms*(FS-k)+(me*k))/FS)
                            *Math.sin(2*Math.PI*(fs*(FS-k)+(fe*k))/FS*k/FRAME_SIZE+phase);
                }
            }
            phases = newPhases;
        }
    }
    
    this.reconstruct = reconstruct;
    
    function pitchShift(sig, sig2, factor) {
        for (let i=0; i<sig2.length; i++) {
            sig2[i] = 0;
        }
        const allPairs = findAllPairs(sig);
        let phases = {};
        for (let i=0; i<allPairs.length; i++) {
            const pairs = allPairs[i];
            const newPhases = {};
            for (let j=i*FRAME_SIZE-FRAME_SIZE/2, k=0; 
                    k<FRAME_SIZE && j<sig.length; j++, k++) {
                if (j < 0) {
                    continue;
                }
                const FS = FRAME_SIZE-1;
                for (let l=0; l<pairs.length; l++) {
                    const fs = pairs[l][0]*factor;
                    const ms = pairs[l][1];
                    const fe = pairs[l][2]*factor;
                    const me = pairs[l][3];
                    let phase = 0;
                    if (ms !== 0) {
                        const phaseInc = 2*Math.PI*fs;
                        phase += phaseInc;
                        if (phases[""+fs]) {
                            phase += phases[""+fs];
                        }
                        newPhases[""+fe] = phase;
                    }
                    sig2[j] += ((ms*(FS-k)+(me*k))/FS)
                            *Math.sin(2*Math.PI*(fs*(FS-k)+(fe*k))/FS*k/FRAME_SIZE+phase);
                }
            }
            phases = newPhases;
        }
    }
    
    this.pitchShift = pitchShift;
}