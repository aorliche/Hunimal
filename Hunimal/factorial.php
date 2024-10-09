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
let hunNum2Words = null;

function factorial(n) {
    let prod = 1;
    for (let i=1; i<=n; i++) {
        prod *= i;
    }
    return prod;
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
    for (let ion=0; ion<20; ion++) {
        const m = Math.floor(n / Math.pow(10000,ion));
        const m1 = m % 100;
        const m2 = Math.floor(m / 100) % 100;
        if (ion == 0) {
            num = twoPartHun(m2, m1);
        } else if (m != 0) {
            num = `${twoPartHun(m2, m1)} ${hunNum2Words[ion]}-ion, ${num}`;
        }
    }
    return num;
}

function buildTable() {
    const tab = document.querySelector('#fact-table');
    const tr = document.createElement('tr');
    const td1 = document.createElement('th');
    const td2 = document.createElement('th');
    const td3 = document.createElement('th');
    td1.innerText = 'Number';
    td2.innerText = 'Factorial';
    td3.innerText = 'In Hunimal';
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tab.appendChild(tr);
    for (let i=0; i<=20; i++) {
        const tr = document.createElement('tr');
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        const td3 = document.createElement('td');
        td1.innerText = numToHunimal(i);
        td2.innerText = numToHunimal(factorial(i));
        td3.innerText = dec2BigHun(factorial(i));
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tab.appendChild(tr);
    }
}

fetch("words/hun.txt")
    .then(res => res.text())
    .then(data => {
        hunNum2Words = data.split('\r\n'); 
        buildTable();
    })
    .catch(err => console.log(err));

function numToHunimal(num) {
	if (num == 0) {
		return String.fromCharCode(0x5500);
	}
	let hun = "";
	while (num > 0) {
		let ones = num % 10;
		let tens = Math.floor(num/10) % 10;
		hun = `${String.fromCharCode(0x5500 + 0x10*tens + ones)}${hun}`;
        num = Math.floor(num/100);
	}
	return hun;
}

    </script>
    <style>
    #fact-table {
    border-collapse: collapse;
    }
    #fact-table td {
    border: 1px solid black;
    }

    </style>
</head>
<body>
    <h1>Hunimal Factorials</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
			<p>Factorials from zero to 20 in hunimal.</p>
            <table id='fact-table' class='hunimal-font'>
            </table>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
