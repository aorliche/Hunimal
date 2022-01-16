window.addEventListener('load', e => {
	const digitSel = document.querySelector('#digit-form select#digit');
	for (let tens=0; tens<10; tens++) {
		for (let ones=0; ones<10; ones++) {
			let hunStr = String.fromCodePoint(0x5500 + tens*16 + ones);
			let opt = document.createElement('option');
			opt.value = hunStr;
			opt.innerText = hunStr;
			digitSel.appendChild(opt);
		}
	}
}, false);
