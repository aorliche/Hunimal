window.addEventListener("load", e => {

	let hunNum2Words = null;
	const hunimalListTable = document.querySelector("#hunimal-list-table");
    const ver2 = document.querySelector('#hunimal-ver2');
	const centimal = document.querySelector('#hunimal-centimal');
    const spanish = document.querySelector("#hunimal-spanish");
    const russian = document.querySelector("#hunimal-russian");
    const german = document.querySelector("#hunimal-german");
    const korean = document.querySelector("#hunimal-korean");
    const swedish = document.querySelector('#hunimal-swedish');

    const alltables = [hunimalListTable, ver2, centimal, spanish, russian, german, korean, swedish];

    const henglish = document.querySelector('#english');
    const hver2 = document.querySelector('#ver2');
	const hcentimal = document.querySelector('#centimal');
    const hspanish = document.querySelector('#spanish');
    const hrussian = document.querySelector('#russian');
    const hgerman = document.querySelector('#german');
    const hkorean = document.querySelector('#korean');
    const hswedish = document.querySelector('#swedish');

    const allh = [henglish, hver2, hcentimal, hspanish, hrussian, hgerman, hkorean, hswedish];
    
    const aenglish = document.querySelector('#showenglish');
    const aver2 = document.querySelector('#showver2');
	const acentimal = document.querySelector('#showcentimal');
    const aspanish = document.querySelector('#showspanish');
    const arussian = document.querySelector('#showrussian');
    const agerman = document.querySelector('#showgerman');
    const akorean = document.querySelector('#showkorean');
    const aswedish = document.querySelector('#showswedish');

    function hideall() {
        alltables.forEach(tab => {
            tab.style.display = "none";
        });
        allh.forEach(h => {
            h.style.display = "none";
        });
		const centExp = document.querySelector('#centimal-exp');
		centExp.style.display = "none";
    }

    function show(tab, h) {
        tab.style.display = "table";
        h.style.display = "block";
    }

    aenglish.addEventListener("click", e => {
        e.preventDefault();
        hideall();
        show(hunimalListTable, henglish);
    });
    aver2.addEventListener("click", e => {
        e.preventDefault();
        hideall();
        show(ver2, hver2);
    });
	acentimal.addEventListener('click', e => {
		e.preventDefault();
		hideall();
		show(centimal, hcentimal);
		const centExp = document.querySelector('#centimal-exp');
		centExp.style.display = "block";
	});
    aspanish.addEventListener("click", e => {
        e.preventDefault();
        hideall();
        show(spanish, hspanish);
    });
    arussian.addEventListener("click", e => {
        e.preventDefault();
        hideall();
        show(russian, hrussian);
    });
    agerman.addEventListener("click", e => {
        e.preventDefault();
        hideall();
        show(german, hgerman);
    });
    akorean.addEventListener("click", e => {
        e.preventDefault();
        hideall();
        show(korean, hkorean);
    });
    aswedish.addEventListener("click", e => {
        e.preventDefault();
        hideall();
        show(swedish, hswedish);
    });

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
	fetchWordsAndStart(ver2, "words/hun2.txt", '\n');
	fetchWordsAndStart(centimal, "words/Centimal.txt", '\n');
	fetchWordsAndStart(spanish, "words/cienimal.txt", '\r\n');
	fetchWordsAndStart(russian, "words/sotimal_cyrillic.txt", '\n');
	fetchWordsAndStart(german, "words/Dertimal.txt", '\n');
	fetchWordsAndStart(korean, "words/Korimal.txt", '\n');
    fetchWordsAndStart(swedish, "words/swedish.txt", '\n');
    

}, false);
