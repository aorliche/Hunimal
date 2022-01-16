window.addEventListener("load", e => {
	const gcode = document.querySelector("#gcode-div");

	for (let i=0; i<100; i++) {
		let num = i.toString(10);
		if (i < 10) {
			num = "0" + num;
		}
		let atext = num + ".gcode"; 

		const numDiv = document.createElement("div");
		const numSpan = document.createElement("span");
		const numA = document.createElement("a");

		numSpan.appendChild(document.createTextNode(num));
		numA.appendChild(document.createTextNode(atext));
		numA.href = "gcode/" + atext;

		numDiv.appendChild(numSpan);
		numDiv.appendChild(document.createElement("br"));
		numDiv.appendChild(numA);
		
		gcode.appendChild(numDiv);
	}
}, false);
