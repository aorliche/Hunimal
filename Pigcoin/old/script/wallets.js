

window.addEventListener("load", function() {
	function shortenPubKey(pubKey, span, link) {
		span.innerHTML = "";
		span.innerText = pubKey.substring(44,70) + "...";
		link.innerText = "View Full";
	}

	function expandPubKey(pubKey, span, link) {
		span.innerHTML = "";
		span.appendChild(document.createTextNode(pubKey));
		span.appendChild(document.createElement('br'));
		link.innerText = "Hide";
	}

	function initPubKeyTd(td) {
		const span = td.querySelector("span");
		const link = td.querySelector("a");
		const pubKey = span.innerText;
		let isShort = true;
		shortenPubKey(pubKey, span, link);
		link.addEventListener("click", function() {
			if (isShort)
				expandPubKey(pubKey, span, link);
			else 
				shortenPubKey(pubKey, span, link);
			isShort = !isShort;
		}, false);
	}

	const pubKeyTds = document.querySelectorAll(".pub-key-column");
	for (let i=0; i<pubKeyTds.length; i++) {
		initPubKeyTd(pubKeyTds[i]);
	}

	const clearFormA = document.querySelector("#clear-form-a");
	clearFormA.addEventListener("click", function() {
		texts = document.querySelectorAll("input[type='text']");
		for (let i=0; i<texts.length; i++) {
			texts[i].value = "";
		}
		checks = document.querySelectorAll("input[type='checkbox']");
		for (let i=0; i<checks.length; i++) {
			checks[i].removeAttribute("checked");
		}
	}, false);

	// Not header row
	const trs = [...document.querySelectorAll("tr")];
	const descA = document.querySelector("#sort-desc-a");
	const ascA = document.querySelector("#sort-asc-a");
	const tbody = trs[0].parentNode;
	const trh = trs[0];
	const tro = trs.slice(1);

	function sortTrs(tbody, trh, tro, dsc) {
		tro.sort((a,b) => {
			const atd = a.querySelector(".balance-column");
			const aa = parseFloat(atd.innerText);
			const btd = b.querySelector(".balance-column");
			const bb = parseFloat(btd.innerText);
			if (dsc) {
				return bb-aa;
			} else {
				return aa-bb;
			}
		});
		while (tbody.firstChild) {
			tbody.removeChild(tbody.firstChild);
		}
		tbody.appendChild(trh);
		for (let i=0; i<tro.length; i++) {
			tbody.appendChild(tro[i]);
		}
	}

	descA.addEventListener("click", () => {
		sortTrs(tbody, trh, tro, true);	
	}, false);
	
	ascA.addEventListener("click", () => {
		sortTrs(tbody, trh, tro, false);	
	}, false);
}, false);
