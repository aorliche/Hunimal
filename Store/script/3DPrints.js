let getCost;
let cartJson;
let setCost = 50;
let digitCost = 1;
	
function decimalToHunimal(dec) {
	let wholePart, fracPart;
	[wholePart, fracPart] = dec.toString().split('.');
	wholePart = wholePart.split('').reverse();
	if (wholePart.length % 2 === 1) {
		wholePart.push('0');
	}
	const wholeDigits = [];
	for (let i=0; i<wholePart.length; i+=2) {
		wholeDigits[i/2] = wholePart.slice(i,i+2).reverse().join('');
	}
	wholePart = wholeDigits.reverse();
	if (fracPart) {
		fracPart = fracPart.split('');
		if (fracPart.length % 2 === 1) {
			fracPart.push('0');
		}
		const fracDigits = [];
		for (let i=0; i<fracPart.length; i+=2) {
			fracDigits[i/2] = fracPart.slice(i,i+2).join('');
		}
		fracPart = fracDigits;
	}
	return [wholePart, fracPart];
}

function decimalToHunimalString(dec) {
	let digits = decimalToHunimal(dec);
	digits[0] = digits[0].map(digit => String.fromCodePoint(0x5500 + Number.parseInt(digit, 16)));
	if (digits[1]) {
		digits[1] = digits[1].map(digit => String.fromCodePoint(0x5500 + Number.parseInt(digit, 16)));
		digits = digits[0].join('') + '.' + digits[1].join('');
	} else {
		digits = digits[0].join('');
	}
	return digits;
}

window.addEventListener('load', e => {
	const digitSel = document.querySelector('#digitSelect');
	for (let tens=0; tens<10; tens++) {
		for (let ones=0; ones<10; ones++) {
			let hunStr = String.fromCodePoint(0x5500 + tens*16 + ones);
			let opt = document.createElement('option');
			opt.value = hunStr;
			opt.innerText = hunStr;
			opt.value = 'DodgerBlue';
			digitSel.appendChild(opt);
		}
	}

	function randomHun() {
		return String.fromCodePoint(0x5500 + Number.parseInt(Math.floor(99*Math.random()).toString(), 16));
	}

	function randomKey() {
		return (Math.random() + 1).toString(36).substring(7);
	}

	const setSelect = document.querySelector('#setSelect');
	const digitSelect = document.querySelector('#digitSelect');
	const digitColorSelect = document.querySelector('#digitColorSelect');
	const cartDiv = document.querySelector('#cartDiv');
	const cartDivInner = document.querySelector('#cartDivInner');
	const costSpan = document.querySelector('#costSpan');
	const cartInput = document.querySelector('#cartInput');
	const errorDiv = document.querySelector('#errorDiv');
	let cost = 0;
	let key = null;

	getCost = function() {
		return cost;
	}

	cartJson = function(orderData) {
		if (!orderData) {
			key = randomKey();
			orderData = null; // not 'undefined'
		}
		const cart = [];
		cartDivInner.querySelectorAll('span').forEach(span => {
			const item = `${span.innerText}=${span.style.backgroundColor}`;
			cart.push(item);
		});
		return JSON.stringify({cart: cart, cost: cost, key: key, orderData: orderData});
	}

	document.querySelectorAll('.custom-select-color,.custom-select-digit').forEach(div => colorizeSelect(div));

	document.querySelector('#addSetButton').addEventListener('click', addListener);
	document.querySelector('#addDigitButton').addEventListener('click', addListener);

	function addListener(e) {
		e.preventDefault();	
		if (e.target.id === 'addSetButton' && setSelect.selectedIndex === 0) return;
		if (e.target.id === 'addDigitButton' && 
			(digitSelect.selectedIndex === 0 || digitColorSelect.selectedIndex === 0)) return;
		cartDiv.style.display = 'block';
		cartDivInner.appendChild(function() {
			const span = document.createElement('span');
			if (e.target.id === 'addSetButton') {
				setContents(span, setSelect.options[setSelect.selectedIndex]);
				span.innerHTML = 'Set';
			} else {
				setContents(span, digitColorSelect.options[digitColorSelect.selectedIndex]);
				span.innerHTML = digitSelect.options[digitSelect.selectedIndex].innerHTML;
			}
			span.classList.add('cartHunPrintItem');
			span.addEventListener('click', f => {
				f.target.parentNode.removeChild(f.target);
				if (e.target.id === 'addSetButton') cost -= setCost;
				else cost -= digitCost;
				updateCostSpan();
				if (cost === 0) {
					cartDiv.style.display = 'none';
				}
			});
			if (e.target.id === 'addSetButton') cost += setCost;
			else cost += digitCost;
			updateCostSpan();
			return span;
		}());
	}
	
	function updateCostSpan() {
		const hunCost = decimalToHunimalString(cost);
		costSpan.innerHTML = `${hunCost} (${cost} USD)`;
	}

}, false);
