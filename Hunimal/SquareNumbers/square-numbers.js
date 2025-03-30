
const $ = q => document.querySelector(q);
const $$ = q => [...document.querySelectorAll(q)];

function convertToBase(num, base) {
	const digits = [];
	while (num > 0) {
		const dig = num % base;
		digits.push(dig);
		num = (num - dig) / base;
	}
	return digits;
}

function addToDigits(digits, num, pos, base) {
	while (num > 0) {
		const dig = num % base;
		num = (num - dig) / base;
		while (digits.length <= pos) {
			digits.push(0);
		}
		digits[pos] += dig;
		if (digits[pos] >= base) {
			digits[pos] = digits[pos] % base;
			num++;
		}
		pos++;
	}
}

function mulInBase(digits1, digits2, base) {
	const res = [];
	for (let bot = 0; bot < digits2.length; bot++) {
		for (let top = 0; top < digits1.length; top++) {
			const pos = top+bot;
			const prod = digits2[bot]*digits1[top];
			addToDigits(res, prod, pos, base);
		}
	}
	return res;
}

function resetTable(resTab) {
	resTab.innerHTML = `
			<tr>
				<th>Input</th>
				<th>Base Representation</th>
				<th>In Decimal</th>
			</tr>`;
}

function digitToHumber(d) {
    if (d < 100) {
        const ones = d%10;
        const tens = (d-ones)/10;
        return String.fromCharCode(0x5500 + 0x10*tens + ones);
    }
    if (d < 126) {
        return String.fromCharCode(0x61 + d - 100);
    }
    const rem = d%100;
    return digitToHumber((d - rem)/100) + digitToHumber(rem); 
}

window.addEventListener('load', e => {
	const baseInp = $('#base');	
	const genBut = $('#generate');
	const resTab = $('#results');

	resetTable(resTab);

	genBut.addEventListener('click', e => {
		e.preventDefault();
		const b = parseInt(baseInp.value);

		if (isNaN(b)) {
			alert('Input is not a number');
			return;
		}

		resetTable(resTab);

		for (let i=0; i<2*b; i++) {
			const ii = convertToBase(i, b);
			const res = mulInBase(ii, ii, b);
			const tr = document.createElement('tr');
			const td1 = document.createElement('td');
			const td2 = document.createElement('td');
			const td3 = document.createElement('td');
			td1.innerText = i;
			td2.innerText = res.toReversed().map(d => digitToHumber(d));
			td3.innerText = digitToHumber(i*i);
			tr.appendChild(td1);
			tr.appendChild(td2);
			tr.appendChild(td3);
			resTab.appendChild(tr);
		}
	});
});
