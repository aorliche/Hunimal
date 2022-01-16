window.addEventListener("load", e => {
	const formRemove = document.querySelector("#form-remove");
	const buttonsSet = document.querySelectorAll("button[data-set-idx]");
	const buttonsDigit = document.querySelectorAll("button[data-digit-idx]");
	for (let i=0; i<buttonsDigit.length; i++) {
		buttonsDigit[i].addEventListener("click", e => {
			formRemove.elements['digit-idx'].value = buttonsDigit[i].getAttribute('data-digit-idx');
			formRemove.submit();
		}, false);
	}
	for (let i=0; i<buttonsSet.length; i++) {
		buttonsSet[i].addEventListener("click", e => {
			formRemove.elements['set-idx'].value = buttonsSet[i].getAttribute('data-set-idx');
			formRemove.submit();
		}, false);
	}
}, false);
