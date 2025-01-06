function createRandomPattern(stripesOrDots, patternCb) {
	const canvas = document.querySelector("#stripesCanvas");
	const ctx = canvas.getContext('2d');
   
	const col = [];
	for (let i=0; i<2; i++) {
		const r = getRandomHexDigit();
		const g = getRandomHexDigit();
		const b = getRandomHexDigit();
		const c = '#' + r + g + b;
		col[i] = c;
	}

	const cw = Math.round(20*Math.random());
	const bw = Math.round(20*Math.random());
	const theta = Math.round(180*Math.random());

	const ds = Math.round(10+10*Math.random());
	const dp = Math.round(30+20*Math.random());

	ctx.save();
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.rotate(theta*Math.PI/180);
	if (stripesOrDots == 'stripes') {
		for (let i=0; (i*(cw+bw)) < canvas.height*4; i++) {
			ctx.fillStyle = col[i % col.length];
			ctx.fillRect(-2*canvas.width, i*(cw+bw)-2*canvas.height, 4*canvas.width, cw);
		}
	} else {
		for (let i=0; (i*dp) < canvas.height*4; i++) {
			for (let j=0; (j*dp) < canvas.width*4; j++) {
				ctx.fillStyle = col[(i+j) % col.length];
				ctx.beginPath();
				ctx.arc(j*dp-2*canvas.width, i*dp-2*canvas.height, ds, 0, 2*Math.PI);
				ctx.fill();
			}
		}
	}
	ctx.restore();

	canvas.toBlob((blob) => {
		const img = document.createElement('img');
		const url = URL.createObjectURL(blob);

		img.onload = () => {
			const pat = ctx.createPattern(img, "no-repeat");
			console.log(pat);
			patternCb(pat);
			URL.revokeObjectURL(url);
		};

		img.src = url;
	});
}
