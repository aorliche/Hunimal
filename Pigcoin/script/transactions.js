window.addEventListener("load", function() {
	const clearFormRegA = document.querySelector("#clear-form-reg-a");
	clearFormRegA.addEventListener("click", function() {
		texts = document.querySelectorAll("input[type='text']");
		for (let i=0; i<texts.length; i++) {
			texts[i].value = "";
		}
		dates = document.querySelectorAll("input[type='date']");
		for (let i=0; i<dates.length; i++) {
			dates[i].value = "";
		}
	}, false);

	// Not header row
	const trsReg = [...document.querySelectorAll("#reg-table tr")];
	const descAAmountReg = document.querySelector("#sort-desc-reg-amount-a");
	const ascAAmountReg = document.querySelector("#sort-asc-reg-amount-a");
	const descATsReg = document.querySelector("#sort-desc-reg-ts-a");
	const ascATsReg = document.querySelector("#sort-asc-reg-ts-a");
	const tbodyReg = trsReg[0].parentNode;
	const trhReg = trsReg[0];
	const troReg = trsReg.slice(1);

	function strIntComp(a,b) {
		if (a<b) {
			return -1;
		} else if (a>b) {
			return 1;
		} else {
			return 0;
		}
	}

	function sortTrs(tbody, trh, tro, dsc, col, str) {
		tro.sort((a,b) => {
			const atd = a.querySelector(col);
			const aa = (str) ? atd.innerText : parseFloat(atd.innerText);
			const btd = b.querySelector(col);
			const bb = (str) ? btd.innerText : parseFloat(btd.innerText);
			if (dsc) {
				return strIntComp(bb,aa);
			} else {
				return strIntComp(aa,bb);
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

	descAAmountReg.addEventListener("click", () => {
		sortTrs(tbodyReg, trhReg, troReg, true, ".amount-column");	
	}, false);
	
	ascAAmountReg.addEventListener("click", () => {
		sortTrs(tbodyReg, trhReg, troReg, false, ".amount-column");	
	}, false);
	
	descATsReg.addEventListener("click", () => {
		sortTrs(tbodyReg, trhReg, troReg, true, ".ts-column", true);	
	}, false);
	
	ascATsReg.addEventListener("click", () => {
		sortTrs(tbodyReg, trhReg, troReg, false, ".ts-column", true);	
	}, false);

	const hideRegTxnA = document.querySelector("#hide-reg-txn-a");
	const regTable = document.querySelector("#reg-table");
	let isRegHidden = false;
	hideRegTxnA.addEventListener("click", () => {
		if (isRegHidden) {
			regTable.style.display = "";
			hideRegTxnA.innerText = "Hide regular transactions";
		} else {
			regTable.style.display = "none";
			hideRegTxnA.innerText = "Show regular transactions";
		}
		isRegHidden = !isRegHidden; 
	}, false);
	
	const hideGenTxnA = document.querySelector("#hide-gen-txn-a");
	const genTable = document.querySelector("#gen-table");
	let isGenHidden = false;
	hideGenTxnA.addEventListener("click", () => {
		if (isGenHidden) {
			genTable.style.display = "";
			hideGenTxnA.innerText = "Hide genesis transactions";
		} else {
			genTable.style.display = "none";
			hideGenTxnA.innerText = "Show genesis transactions";
		}
		isGenHidden = !isGenHidden; 
	}, false);
	
	// Not header row
	const trsGen = [...document.querySelectorAll("#gen-table tr")];
	const descAAmountGen = document.querySelector("#sort-desc-gen-amount-a");
	const ascAAmountGen = document.querySelector("#sort-asc-gen-amount-a");
	const descATsGen = document.querySelector("#sort-desc-gen-ts-a");
	const ascATsGen = document.querySelector("#sort-asc-gen-ts-a");
	const tbodyGen = trsGen[0].parentNode;
	const trhGen = trsGen[0];
	const troGen = trsGen.slice(1);
	
	descAAmountGen.addEventListener("click", () => {
		sortTrs(tbodyGen, trhGen, troGen, true, ".amount-column");	
	}, false);
	
	ascAAmountGen.addEventListener("click", () => {
		sortTrs(tbodyGen, trhGen, troGen, false, ".amount-column");	
	}, false);
	
	descATsGen.addEventListener("click", () => {
		sortTrs(tbodyGen, trhGen, troGen, true, ".ts-column", true);	
	}, false);
	
	ascATsGen.addEventListener("click", () => {
		sortTrs(tbodyGen, trhGen, troGen, false, ".ts-column", true);	
	}, false);
}, false);
