/*let canSend = false;

function unlock() {
	canSend = true;
}

window.addEventListener('load', e => {
	const submitDiv = document.querySelector('#submit-div');
	const submit = document.createElement('input');
	submit.type = 'submit';
	submitDiv.appendChild(submit);
	//const submit = document.querySelector('input[type=submit]');
	const errP = document.querySelector('#js-contact-error-p');
	submit.addEventListener('click', e => {
		if (!canSend) {
			e.preventDefault();	
			errP.style.display = 'block';
		}
	}, true);
}, false);*/

function onSubmit(token) {
	document.querySelector('#contact-form').submit();
}
