window.addEventListener("load", e => {

	let hunNum2Words = null;
	const hunimalListTable = document.querySelector("#hunimal-list-table");
    const spanish = document.querySelector("#hunimal-spanish");
    const russian = document.querySelector("#hunimal-russian");
    const german = document.querySelector("#hunimal-german");
    const korean = document.querySelector("#hunimal-korean");

    async function fetchWordsAndStart(hunimalListTable, file, sep) {
       
        await fetch(file)
            .then(res => res.text())
            .then(data => hunNum2Words = data.split(sep));
/*        await fetch("words/decimal.txt")
            .then(res => res.text())
            .then(data => decNum2Words = data.split('\r\n'));*/

		const color1 = "#6d9eeb";
		const color2 = "#6aa84f";

		// Build cheat sheet table
		for (let i=0; i<10; i++) {
			const tr = document.createElement("tr");
			for (let j=0; j<10; j++) {
				const num = j*10+i;
				const td1 = document.createElement("td");
				const td2 = document.createElement("td");
				let numStr = num.toString();
				if (num < 10) {
					numStr = "0" + numStr;
				}
				td1.innerText = numStr;
				td2.innerText = hunNum2Words[num];
				tr.appendChild(td1);
				tr.appendChild(td2);
				if (j % 2 === 0) {
					td1.style.backgroundColor = color1;
					td2.style.backgroundColor = color1;
				} else {
					td1.style.backgroundColor = color2;
					td2.style.backgroundColor = color2;
				}
			}
			hunimalListTable.appendChild(tr);
		}
            
    }
    
	fetchWordsAndStart(hunimalListTable, "words/hun.txt", '\r\n');
	fetchWordsAndStart(spanish, "words/cienimal.txt", '\r\n');
	fetchWordsAndStart(russian, "words/sotimal_cyrillic.txt", '\n');
	fetchWordsAndStart(german, "words/Dertimal.txt", '\n');
	fetchWordsAndStart(korean, "words/Korimal.txt", '\n');

}, false);
