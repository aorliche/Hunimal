<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
<head>
    <title>Hunimal</title>
    <!-- Generic Hunimal -->
    <? include('generic.php'); ?>
    <!-- Hunimal-specific -->
	<link rel="stylesheet" href="style/index.css">
	<script>
$ = q => document.querySelector(q);
$$ = q => [...document.querySelectorAll(q)];
window.addEventListener('load', e => {
	let hunNum2Words = null;
	let qTemp = $('#question');
	let optTemp = $('#option');
	let qnum = null;
	let qright = null;

	function randint(n, excl) {
		const idx = Math.floor(n*Math.random());
		return excl.indexOf(idx) == -1 ? idx : randint(n, excl);
	}

	function shuffle(n) {
		const idcs = [...new Array(n).keys()];
		for (let i=0; i<n; i++) {
			const idx = randint(n, []);
			[idcs[i],idcs[idx]] = [idcs[idx],idcs[i]];
		}
		return idcs;
	}

	function startQuiz() {
		qnum = 1;
		qright = 0;
	}

	function setCorrect() {
		$('#q-div').querySelector('.q-correct').innerText = `  (${(100*qright/(qnum-1)).toFixed(0)}%)`;
	}

    function twoPartHun(m2, m1) {
        let num = hunNum2Words[m1];
        if (m2 != 0) {
            num = `${hunNum2Words[m2]} ${num}`;
        }
        return num;
    }

    function dec2BigHun(n) {
        let num = null;
        for (let ion=0; ion<3; ion++) {
            const m = Math.floor(n / Math.pow(10000,ion));
            const m1 = m % 100;
            const m2 = Math.floor(m / 100) % 100;
            if (ion == 0) {
                num = twoPartHun(m2, m1);
            } else if (m != 0) {
                num = `${twoPartHun(m2, m1)} ${hunNum2Words[ion]}-ion ${num}`;
            }
        }
        return num;
    }

	function buildQuestion() {
		$('#q-div').innerHTML = '';
		let q = null;
		let ans = null;
        const rand = Math.random();  
		// hun2dec
		if (rand > 0.7) {   
			const n = randint(100,[]);
			q = `What is ${hunNum2Words[n]} in decimal?`;
			ans = [n];
			for (let i=0; i<4; i++) {
				ans.push(randint(100, ans));
			}
		// dec2hun
		} else if (rand > 0.3) {
			const n = randint(100,[]);
			q = `What is ${n} in hunimal?`;
			ans = [n];
			for (let i=0; i<4; i++) {
				ans.push(randint(100, ans));
			}
			ans = ans.map(n => hunNum2Words[n]);
        // oneion hun2dec
		} else if (Math.random() > 0.15) {
			const n = randint(1000000,[]);
            q = `What is ${dec2BigHun(n)} in decimal?`;
			ans = [n];
			for (let i=0; i<4; i++) {
				ans.push(randint(1000000, ans));
			}
        // oneion dec2hun
        } else {
			const n = randint(1000000,[]);
			q = `What is ${n} in hunimal?`;
			ans = [n];
			for (let i=0; i<4; i++) {
				ans.push(randint(1000000, ans));
			}
			ans = ans.map(n => dec2BigHun(n));
        }
		const idcs = shuffle(5);
		const opts = idcs.map(i => ans[i]);	
		//const corrIdx = idcs.indexOf(0);
		const qNode = qTemp.content.cloneNode(true);
		qNode.querySelector('.q').innerText = q;
		qNode.querySelector('.q-num').innerText = qnum;
		const optsNode = qNode.querySelector('.opts');
		opts.forEach(opt => {
			optNode = optTemp.content.cloneNode(true);
			optNode.querySelector('.opt-span').innerText = opt;
			optsNode.appendChild(optNode);
		});
		[...optsNode.querySelectorAll('input')][0].checked = true;
		qNode.querySelector('.submit').addEventListener('click', e => {
			e.preventDefault();
			if (e.target.innerText == "Next") {
				buildQuestion();
				return;
			}
			const a = optsNode.querySelector('input:checked').nextSibling.innerText;
			// qNode.querySelector doesn't work here for some reason
			const feed = $('#q-div').querySelector('.feedback');
			if (a == ans[0]) {
				feed.style.color = 'green';
				feed.innerText = 'Correct!';
				qright++;
			} else {
				feed.style.color = 'red';
				feed.innerText = `Incorrect (${ans[0]})`;
			}
			qnum++;
			setCorrect();
			e.target.innerText = 'Next';
		});
		$('#q-div').appendChild(qNode);
		if (qnum > 1) {
			setCorrect();
		}
	}

	fetch("words/hun.txt")
		.then(res => res.text())
		.then(data => {
			hunNum2Words = data.split('\r\n'); 
			startQuiz();
			buildQuestion();
		})
		.catch(err => console.log(err));
	});
	</script>
	<style>	
	.opt input {
		margin-left: 10px;	
	}
	.submit {
		margin-right: 10px;
	}
	</style>
</head>
<body>
	<template id='question'>
		<h4>Question <span class='q-num'></span> <span class='q-correct'></span></h4>
		<p class='q'></p>
		<p class='opts'></p>
		<button class='submit'>Submit</button>
		<span class='feedback'></span>
	</template>
	<template id='option'>
		<span class='opt'>
			<input type='radio' name='opts'><span class='opt-span'></span>
		</span>
	</template>
    <h1>Hunimal Quiz</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
			<p>How well do you know Hunimal? Try to answer all the questions correctly!</p>
			<div id='q-div'></div>	
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
