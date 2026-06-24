const $ = q => document.querySelector(q);
const $$ = q => [...document.querySelectorAll(q)];

function rebuildTimesTable(div, showAnswers) {
	div.innerHTML = '';
	for (let i=0; i<100; i += 10) {
		for (let k=0; k<100; k += 10) {
			// Is this part of table all empty (below main diagonal)?
			if (i < k) {
				continue;
			}
			let table = document.createElement('table');
			// Make header
			let tr = document.createElement('tr');
			// Empty cell
			let th = document.createElement('th');
			tr.appendChild(th);
			// Filled cells
			for (let j=i; j<i+10; j++) {
				th = document.createElement('th');
				const j0 = j%10;
				const j1 = Math.floor(j/10);
				th.innerText = String.fromCharCode(0x5500 + j1*16 + j0);
				tr.appendChild(th);
			}
			table.appendChild(tr);
			// Make rows
			for (let kk=k; kk<k+10 && kk<100; kk++) {
				tr = document.createElement('tr');
				// Filled cell
				td = document.createElement('td');
				const k0 = kk%10;
				const k1 = Math.floor(kk/10);
				td.innerText = String.fromCharCode(0x5500 + k1*16 + k0);
				tr.appendChild(td);
				// Empty cells
				for (let j=i; j<i+10; j++) {
					td = document.createElement('td');
					// No fill in below diagonal
					if (j < kk) {
						td.style.border = 'none';
					} else if (showAnswers) {
						const ans = kk*j;
						const a0 = ans%10;
						const a1 = Math.floor(ans/10)%10;
						const a2 = Math.floor(ans/100)%10;
						const a3 = Math.floor(ans/1000);
						if (a2 > 0 || a3 > 0) {
							td.innerText = String.fromCharCode(0x5500 + a3*16 + a2)
								+ String.fromCharCode(0x5500 + a1*16 + a0);
						} else {
							td.innerText = String.fromCharCode(0x5500 + a1*16 + a0);
						}
					}
					tr.appendChild(td);
				}
				table.appendChild(tr);
			}
			div.appendChild(table);
		}
	}
}

window.addEventListener('load', e => {
	const div = $('#times-tables');
	$('#show-answers').addEventListener('change', ee => {
		rebuildTimesTable(div, $('#show-answers').checked);
	});
	rebuildTimesTable(div);
});
