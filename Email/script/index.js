let mySpecialVar = false;

function unlock() {
	mySpecialVar = true;
}

window.addEventListener('load', e => {
	const submitRequestDiv = document.querySelector('#submit-request-div');
	const submitResetDiv = document.querySelector('#submit-reset-div');
	const submitDeleteDiv = document.querySelector('#submit-delete-div');

	const submitRequest = document.createElement('input');
	const submitReset = document.createElement('input');
	const submitDelete = document.createElement('input');

	submitRequest.type = 'submit';
	submitReset.type = 'submit';
	submitDelete.type = 'submit';

	submitRequestDiv.appendChild(submitRequest);
	submitRequestDiv.appendChild(document.createElement('br'));
	submitResetDiv.appendChild(submitReset);
	submitResetDiv.appendChild(document.createElement('br'));
	submitDeleteDiv.appendChild(submitDelete);
	submitDeleteDiv.appendChild(document.createElement('br'));

	const emailInputs = document.querySelectorAll('input[type="text"][name="email"]');

	for (let i=0; i<emailInputs.length; i++) {
		emailInputs[i].addEventListener('focusout', e => {
			const src = e.target;
			let text = src.value.toLowerCase(); 
			if (!text.endsWith("@hunimal.org")) {
				text += "@hunimal.org";
			}
			src.value = text;
		}, false);
	}
	
	const forms = document.querySelectorAll('form');
	for (let i=0; i<forms.length; i++) {
		forms[i].addEventListener('submit', e => {
			if (!mySpecialVar) {
				alert('Please complete the reCAPTCHA');
				e.preventDefault();
			}
		}, false);
	}
}, false);
