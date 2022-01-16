window.addEventListener('load', e => {
	const avail = document.querySelectorAll(".item[data-available]");
	for (let i=0; i<avail.length; i++) {
		avail[i].addEventListener("click", e => {
			const a = avail[i].querySelector('.title a');
			a.click();
		}, true);
	}
}, false);
