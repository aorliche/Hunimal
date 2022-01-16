window.addEventListener('load', e => {
	const addDigitSel = document.querySelector('select[name=digit][form=add-digit-form]');
	const rmDigitSel = document.querySelector('select[name=digit][form=remove-digit-form]');

	for (let i=0; i<10; i++) {
		for (let j=0; j<10; j++) {
			let hunDigit = String.fromCodePoint(0x5500 + i*16 + j);
			let eltAdd = document.createElement("option");
			eltAdd.value = i*10 + j;
			eltAdd.innerText = hunDigit;
			let eltRm = eltAdd.cloneNode(true);
			addDigitSel.appendChild(eltAdd);
			rmDigitSel.appendChild(eltRm);
		}
	}

	const setSentForm = document.querySelector('#set-sent-form');
	const setSentFormIdInput = setSentForm.querySelector('input[name="order-id"]');
	const setSentButtons = document.querySelectorAll('button[data-send-order]');

	for (let i=0; i<setSentButtons.length; i++) {
		setSentButtons[i].addEventListener("click", e => {
			setSentFormIdInput.value = setSentButtons[i].getAttribute("data-send-order");
			setSentForm.submit();
		}, false);
	}
}, false);
