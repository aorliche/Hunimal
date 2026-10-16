const $ = q => document.querySelector(q);
const $$ = q => [...document.querySelectorAll(q)];

function getCost() {
    const n = parseInt($('#number-sets').value);
    return n*10 + 15;
}

function cartJson(orderData) {
    const n = parseInt($('#number-sets').value);
    const cost = getCost();
    return JSON.stringify({n, cost, orderData});
}

window.addEventListener('load', e => {
    const numSetsInput = $('#number-sets');
    let prevNumSets = 1;

    function updateTotalCost() {
        const cost = getCost();
        const costHuns = Math.floor(cost/100);
        const costTens = Math.floor((cost%100)/10);
        const costOnes = cost % 10;
        if (costHuns > 0) {
            $('#total-cost').innerText = String.fromCharCode(0x5500 + costHuns)
                + String.fromCharCode(0x5500 + costTens*16 + costOnes) 
                + '.' 
                + String.fromCharCode(0x5500);
            
        } else {
            $('#total-cost').innerText = String.fromCharCode(0x5500 + costTens*16 + costOnes) 
                + '.' + String.fromCharCode(0x5500);
        }
    }

    numSetsInput.addEventListener('focus', e => {
        prevNumSets = parseInt(numSetsInput.value);
    });

    numSetsInput.addEventListener('change', e => {
        const n = parseInt(numSetsInput.value);
        if (!n || n < 1 || n > 10) {
            numSetsInput.value = prevNumSets;
            updateTotalCost();
        } else {
            prevNumSets = n;
            numSetsInput.value = n;
            updateTotalCost();
        }
    });

    $('#inc').addEventListener('click', e => {
        numSetsInput.value = parseInt(numSetsInput.value) + 1;
        const ev = new Event('change');
        numSetsInput.dispatchEvent(ev);
    });

    $('#dec').addEventListener('click', e => {
        numSetsInput.value = parseInt(numSetsInput.value) - 1;
        const ev = new Event('change');
        numSetsInput.dispatchEvent(ev);
    });
});
