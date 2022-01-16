function NoteShifter(ps) {
    this.ps = ps;
    
    function shiftAndExtend(input, audioCtx, sampleRate, baseFreq, toFreq, extendBy, extendPos/*, freqWobble, ampWobble*/) {
        const shiftedFM = [];
        const shiftedBuffer = audioCtx.createBuffer(1, input.length+extendBy, sampleRate);
        
        let maxMag = 0;
        let mainFreq = 0;
        /*let frameBegin = 0;
        let reachedMark = false;*/
        let N = 0;
        
        // empirical window to search for the main frequency of our "note"
        const binLo = baseFreq*0.8*ps.FRAME_SIZE/sampleRate;
        const binHi = baseFreq*1.5*ps.FRAME_SIZE/sampleRate;
        
        //const freqWobbleBase = 1-freqWobble/2;
        //const ampWobbleBase = 1-ampWobble/2;
        
        for (let i=0; i<input.length; i += ps.FRAME_SIZE) {
            let fm = ps.getFrameFreqMag(input, i);
            shiftedFM.push(fm);
            /*if (!reachedMark) {
                frameBegin++;
            }*/
            if (extendPos >= i && extendPos <= i+ps.FRAME_SIZE) {
                //reachedMark = true;
                N = Math.floor(extendBy/ps.FRAME_SIZE);
                for (let j=0; j<=N; j++) {
                    const nfm = [];
                    for (let k=0; k<fm.length; k++) {
                        if (fm[k][0] > binLo && fm[k][0] < binHi && fm[k][1] > maxMag) {
                            maxMag = fm[k][1];
                            mainFreq = fm[k][0];
                        }
                        nfm[k] = fm[k].slice(0);
                        /*nfm[k] = [fm[k][0]*(freqWobble*Math.random()+freqWobbleBase), 
                                  fm[k][1]*(ampWobble*Math.random()+ampWobbleBase), 
                                  fm[k][2]]; // what is after freq and magnitude?
                        */
                    }
                    shiftedFM.push(nfm);
                }
            }
        }
        
        const mainFreqBin = mainFreq;
        mainFreq *= sampleRate/ps.FRAME_SIZE;
        
        /*let lastNonZero = shiftedFM.length-1;
        for (; lastNonZero >= 0; lastNonZero--) {
            if (shiftedFM[lastNonZero].length !== 0) {
                break;
            }
        }*/
        
        const mult = toFreq/mainFreq;
        
        for (let i=0; i<shiftedFM.length; i++) {
            for (let j=0; j<shiftedFM[i].length; j++) {
                // shift so dominant frequency is note
                shiftedFM[i][j][0] *= mult;
                // fade out slightly
                /*if (i >= frameBegin) {
                    shiftedFM[i][j][1] *= Math.exp((lastNonZero-i)/((lastNonZero-frameBegin)/1.2)-1);
                }*/
            }
        }
        ps.reconstruct(shiftedBuffer.getChannelData(0), shiftedFM, mult);
        
        return shiftedBuffer;
    }
    
    this.shiftAndExtend = shiftAndExtend;
}