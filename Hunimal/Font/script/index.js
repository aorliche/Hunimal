window.addEventListener("load", e => {

	let hunNum2Words = null;
	const hunimalListTable = document.querySelector("#hunimal-list-table-font");

    async function fetchWordsAndStart() {
        
        await fetch("../words/hun.txt")
            .then(res => res.text())
            .then(data => hunNum2Words = data.split('\r\n'));
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
				td1.innerHTML = "&#x55" + numStr + ";";
				td1.className = "hunimal-font";
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
    
	fetchWordsAndStart();

}, false);
