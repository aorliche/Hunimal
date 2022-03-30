const lightColors = ['yellow', 'pink', 'orange'];

function setBgColor(elt, color) {
	elt.style.backgroundColor = color;
	if (lightColors.includes(color.toLowerCase())) {
		elt.style.color = 'black';
	} else {
		elt.style.color = 'white';
	}
}

function setContents(elt, opt) {
	elt.innerHTML = opt.innerHTML;
	setBgColor(elt, opt.value);
}

function colorizeSelect(div) {
	const sel = div.querySelector("select");
	const lbl = div.querySelector(`label[for=${sel.name}]`);
	const opt = document.createElement('option');
	sel.style.display = 'none';
	lbl.style.display = 'none';
	opt.value = 'DodgerBlue';
	opt.innerHTML = lbl.innerHTML;
	sel.add(opt,0);
	sel.selectedIndex = 0;
	/* For each element, create a new DIV that will act as the selected item: */
	const a = document.createElement("div");
	a.setAttribute('class', 'select-selected');
	setContents(a, sel.options[sel.selectedIndex]);
	div.appendChild(a);
	/* For each element, create a new DIV that will contain the option list: */
	const b = document.createElement("div");
	b.setAttribute("class", "select-items select-hide");
	for (let j = 1; j < sel.options.length; j++) {
		/* For each option in the original select element,
		   create a new DIV that will act as an option item: */
		let c = document.createElement("div");
		setContents(c, sel.options[j]);
		c.addEventListener("click", function(e) {
			/* When an item is clicked, update the original select box,
			   and the selected item: */
			let h = this.parentNode.previousSibling;
			for (let i = 0; i < sel.options.length; i++) {
				if (sel.options[i].innerHTML == this.innerHTML) {
					sel.selectedIndex = i;
					setContents(h, sel.options[sel.selectedIndex]);
					break;
				}
			}
		});
		b.appendChild(c);
	}
	div.appendChild(b);
	a.addEventListener("click", function(e) {
		/* When the select box is clicked, close any other select boxes,
		   and open/close the current select box: */
		e.stopPropagation();
		closeAllSelect();
		this.nextSibling.classList.toggle("select-hide");
	});

	function closeAllSelect() {
		div.querySelector('.select-items').classList.add('select-hide');
	}

	/* If the user clicks anywhere outside the select box,
	   then close all select boxes: */
	document.addEventListener("click", closeAllSelect); 
}
