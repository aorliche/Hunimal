
let checkAnswer = null;
let reload = null;
let displayCorrect = null;

window.addEventListener("load", e => {
    const allowedMods = {
        decimal: ['digits', 'words'],
        hunimal: ['digits', 'words'],
		cienimal: ['digits', 'words'],
		sotimal: ['digits', 'words'],
        hex: ['digits'],
        octal: ['digits'],
        binary: ['digits']
    };
    
    const cbRepRight = document.querySelectorAll('check-button[name="right-option"]');
    const cbRepLeft = document.querySelectorAll('check-button[name="left-option"]');
    const cbModRight = document.querySelectorAll('check-button[name="right-mod-option"]');
    const cbModLeft = document.querySelectorAll('check-button[name="left-mod-option"]');
    
    const qDiv = document.querySelector('#question-div');
    const answerInput = document.querySelector('#answer-input');
    const correctDiv = document.querySelector('#feedback-correct');
    const incorrectDiv = document.querySelector('#feedback-incorrect');
	const correctionDiv = document.querySelector('#correction-div');
	
	document.body.addEventListener("click", e => {
		hideFeedback();
	}, false);

	incorrectDiv.addEventListener("click", e => {
		e.stopPropagation();
	}, false);
    
    let prevModL = null;
    let prevModR = null;
    
    function changeMod(mod, allowed) {
        let firstAllowed = null;
        let changeAllowed = false;
        let changedPrev = false;
        for (let i=0; i<mod.length; i++) {
            let found = false;
            for (let j=0; j<allowed.length; j++) {
                if (mod[i].innerText.toLowerCase() === allowed[j]) {
                    found = true;
                    if (!firstAllowed) {
                        firstAllowed = mod[i];
                    }
                    break;
                }
            }
            if (!found) {
                if (mod[i].checked) {
                    changeAllowed = true;
                    if (mod === cbModLeft) {
                        prevModL = mod[i];
                    } else {
                        prevModR = mod[i];
                    }
                }
                mod[i].checked = false;
                mod[i].disabled = true;
            } else {
                let prevMod = (mod === cbModLeft) ? prevModL : prevModR;
                if (prevMod === mod[i]) {
                    mod[i].disabled = false;
                    mod[i].checked = true;
                    prevMod = null;
                    changedPrev = true;
                }
                mod[i].disabled = false;
            }
        }
        if (changeAllowed && !changedPrev) {
            firstAllowed.checked = true;
        }
    }
    
    let qNum = null;
    let decNum2Words = null;
    let hunNum2Words = null;
	let cienNum2Words = null;
	let sotNum2Words = null;
	let dertNum2Words = null;
    
    function hideFeedback() {
        correctDiv.style.display = 'none';
        incorrectDiv.style.display = 'none';
    }
    
    reload = function () {
        let n = qNum;        
        while (n === qNum) {
            qNum = Math.floor(101*Math.random());
        }
        changeQMod();
        answerInput.value = "";
    }

	displayCorrect = function() {
		correctionDiv.innerText = getCorrectAnswer();
	}
    
    function findChecked(boxes) {
        for (let i=0; i<boxes.length; i++) {
            if (boxes[i].checked) {
                return boxes[i];
            }
        }
    }
    
    function changeQMod() {
        const rep = findChecked(cbRepLeft).innerText.toLowerCase();
        const mod = findChecked(cbModLeft).innerText.toLowerCase();
        if (rep === 'decimal' && mod === 'digits') {
            qDiv.innerText = qNum;
        } else if (rep === 'decimal' && mod === 'words') {
            qDiv.innerText = decNum2Words[qNum];
        } else if (rep === 'hunimal' && mod === 'digits') {
            qDiv.innerText = qNum;
        } else if (rep === 'hunimal' && mod === 'words') {
            qDiv.innerText = hunNum2Words[qNum];
        } else if (rep === 'cienimal' && mod === 'digits') {
            qDiv.innerText = qNum;
        } else if (rep === 'cienimal' && mod === 'words') {
            qDiv.innerText = cienNum2Words[qNum];
        } else if (rep === 'sotimal' && mod === 'digits') {
            qDiv.innerText = qNum;
        } else if (rep === 'sotimal' && mod === 'words') {
            qDiv.innerText = sotNum2Words[qNum];
        } else if (rep === 'hex') {
            qDiv.innerText = qNum.toString(16);
        } else if (rep === 'octal') {
            qDiv.innerText = qNum.toString(8);
        } else if (rep === 'binary') {
            qDiv.innerText = qNum.toString(2);
        }
        hideFeedback();
    }
    
    function displayFeedback(correct) {
        if (correct) {
            correctDiv.style.display = 'inline-block';
            incorrectDiv.style.display = 'none';
        } else {
            correctDiv.style.display = 'none';
            incorrectDiv.style.display = 'inline-block';
        }
    }

	function getCorrectAnswer() {
        const rep = findChecked(cbRepRight).innerText.toLowerCase();
        const mod = findChecked(cbModRight).innerText.toLowerCase();
		if (
			['decimal','hunimal','cienimal','sotimal'].includes(rep)
				&& mod === 'digits') {
			return qNum.toString();
        } else if (rep === 'decimal' && mod === 'words') {
            let cAns = decNum2Words[qNum].toLowerCase();
            return cAns.replace(/[-\s]/g, '');
        } else if (rep === 'hunimal' && mod === 'words') {
            let cAns = hunNum2Words[qNum].toLowerCase();
            return cAns.replace(/[-\s]/g, '');
        } else if (rep === 'cienimal' && mod === 'words') {
            let cAns = cienNum2Words[qNum].toLowerCase();
            return cAns.replace(/[-\s]/g, '');
        } else if (rep === 'sotimal' && mod === 'words') {
            let cAns = sotNum2Words[qNum].toLowerCase();
            return cAns.replace(/[-\s]/g, '');
        } else if (rep === 'hex') {
            return qNum.toString(16);
        } else if (rep === 'octal') {
			return qNum.toString(8);
        } else if (rep === 'binary') {
			return qNum.toString(2);
        }
	}
    
    checkAnswer = function () {
        const rep = findChecked(cbRepRight).innerText.toLowerCase();
        const mod = findChecked(cbModRight).innerText.toLowerCase();
		const correct = getCorrectAnswer();
        const ans = answerInput.value.toLowerCase();
        if (
			['decimal','hunimal','cienimal','sotimal'].includes(rep)
				&& mod === 'digits') {
            displayFeedback(parseInt(ans, 10) === qNum);
        } else if (
			['decimal','hunimal','cienimal','sotimal'].includes(rep)
				&& mod === 'words') {
            displayFeedback(ans.replace(/[-\s]/g, '') === correct);
        } else if (rep === 'hex') {
            displayFeedback(parseInt(ans, 16) === qNum);
        } else if (rep === 'octal') {
            displayFeedback(parseInt(ans, 8) === qNum);
        } else if (rep === 'binary') {
            displayFeedback(parseInt(ans, 2) === qNum);
        }
    }
    
    for (let i=0; i<cbRepRight.length; i++) {
        cbRepRight[i].addEventListener("change", e => {
            const allowed = allowedMods[e.srcElement.innerText.toLowerCase()];
            changeMod(cbModRight, allowed);
            hideFeedback();
        }, false);
    }
    
    for (let i=0; i<cbRepLeft.length; i++) {
        cbRepLeft[i].addEventListener("change", e => {
            const allowed = allowedMods[e.srcElement.innerText.toLowerCase()];
            changeMod(cbModLeft, allowed);
            changeQMod();
        }, false);
    }
    
    for (let i=0; i<cbModLeft.length; i++) {
        cbModLeft[i].addEventListener("change", e => {
            changeQMod();
        }, false);
    }

	// Hunimal list cheat sheet
	const hunimalListButton = document.querySelector("#hunimal-list-a");
	const hunimalListTable = document.querySelector("#hunimal-list-table");
	const cienimalListButton = document.querySelector("#cienimal-list-a");
	const cienimalListTable = document.querySelector("#cienimal-list-table");
	const sotimalListButton = document.querySelector("#sotimal-list-a");
	const sotimalListTable = document.querySelector("#sotimal-list-table");
	const dertimalListButton = document.querySelector("#dertimal-list-a");
	const dertimalListTable = document.querySelector("#dertimal-list-table");
	
	function viewHide(button, table, name) {
		if (button.innerText === "View " + name) {
			button.innerText = "Hide " + name;
			table.style.display = "table";
		} else {
			button.innerText = "View " + name;
			table.style.display = "none";
		}
	}

	hunimalListButton.addEventListener("click", e => {
		viewHide(hunimalListButton, hunimalListTable, "Hunimals");
	}, false);
	
	cienimalListButton.addEventListener("click", e => {
		viewHide(cienimalListButton, cienimalListTable, "Cienimals");
	}, false);
	
	sotimalListButton.addEventListener("click", e => {
		viewHide(sotimalListButton, sotimalListTable, "Sotimals");
	}, false);
    
	dertimalListButton.addEventListener("click", e => {
		viewHide(dertimalListButton, dertimalListTable, "Dertimals");
	}, false);

	function buildTable(table, dict) {
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
				td2.innerText = dict[num];
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
			table.appendChild(tr);
		}
	}
    
    async function fetchWordsAndStart() {
        
		await fetch("words/cienimal.txt")
			.then(res => res.text())
			.then(data => cienNum2Words = data.split('\r\n'));
		await fetch("words/sotimal_cyrillic.txt")
			.then(res => res.text())
			.then(data => sotNum2Words = data.split('\n'));
        await fetch("words/hun.txt")
            .then(res => res.text())
            .then(data => hunNum2Words = data.split('\r\n'));
        await fetch("words/decimal.txt")
            .then(res => res.text())
            .then(data => decNum2Words = data.split('\r\n'));
        await fetch("words/Dertimal.txt")
            .then(res => res.text())
            .then(data => dertNum2Words = data.split('\n'));

		const color1 = "#6d9eeb";
		const color2 = "#6aa84f";

		buildTable(hunimalListTable, hunNum2Words);
		buildTable(cienimalListTable, cienNum2Words);
		buildTable(sotimalListTable, sotNum2Words);
		buildTable(dertimalListTable, dertNum2Words);
            
        reload();
    }
    
    // Allow enter submit while typing in the input
    answerInput.addEventListener("keydown", e => {
        if (e.keyCode === 13) {
			correctionDiv.innerText = "Incorrect!";
            checkAnswer();
        }
    }, false);
    
    fetchWordsAndStart();
    
}, false);
