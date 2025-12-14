const $ = q => document.querySelector(q);
const $$ = q => [...document.querySelectorAll(q)];

window.addEventListener('load', e => {
	const div = $('#times-tables');

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
					}
					tr.appendChild(td);
				}
				table.appendChild(tr);
			}
			div.appendChild(table);
		}
	}
});
