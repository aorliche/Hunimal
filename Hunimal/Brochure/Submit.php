<? set_include_path('/home3/calmprepared/public_html/'); ?>
<? $title = 'Brochure Contest: Submit'; ?>
<!DOCTYPE html>
<html>
<head>
    <title><? echo $title ?></title>
    <!-- Generic Hunimal -->
    <? include('generic.php'); ?>
    <!-- Hunimal-specific -->
	<!--<link rel="stylesheet" href="style/index.css">
	<script src="script/index.js"></script>-->
	<script>
window.addEventListener('load', e => {
	const fileInput = document.querySelector('#brochure');
	const previewDiv = document.querySelector('#preview');
	const name = document.querySelector('#name');
	const email = document.querySelector('form input[name=email]');
	const confirmEmail = document.querySelector('#confirm-email');
	const submit = document.querySelector('#submit');

	function displayMessage(div, msg) {
		div.innerHTML = '';
		const p = document.createElement('p');
		p.innerText = msg;
		div.appendChild(p);
	}

	fileInput.addEventListener('change', e => {
		const file = e.target.files[0];
		const maxSize = 5_000_000;

		if (file.size > maxSize) {
			displayMessage(previewDiv, 
				`File size cannot exceed ${maxSize} bytes, you uploaded ${file.size}`);
			// Remove file from file input
			fileInput.value = '';
			return;
		}

		previewDiv.innerHTML = '';

		const img = document.createElement('img');
		img.style.maxWidth = '600px';
		img.file = file;
		previewDiv.appendChild(img);

		const reader = new FileReader();
		reader.onload = (function(anImg) {
			return function(e) {
				anImg.src = e.target.result;
			};
		})(img);

		reader.readAsDataURL(file);
	});

	// Verify user inputs
	submit.addEventListener('click', e => {
		if (name.value.length == 0 || name.value.length > 100) {
			displayMessage(previewDiv, 'Bad name length');
			e.preventDefault();
			return;
		}
		if (email.value.length == 0 || email.value.length > 100 || 
			email.value != confirmEmail.value) {
			displayMessage(previewDiv, 'Bad email');
			e.preventDefault();
			return;
		}
		if (fileInput.files.length == 0) {
			displayMessage(previewDiv, 'You must upload an image');
			e.preventDefault();
			return;
		}
	});
});
	</script>
	<style>
form input {
	margin-bottom: 5px;
}
form label {
	display: inline-block;
	width: 140px;
}
form input[type=text] {
	width: 200px;
}
#preview img {
	margin-top: 10px;
}
	</style>
</head>
<body>
    <h1><? echo $title ?></h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
			<h2>Submit a brochure</h2>
			<form action='PostSubmit.php' method='post' enctype='multipart/form-data'>
				<label for='name'>Name:</label>
				<input type='text' id='name' name='name'><br>
				<label for='email'>Email:</label>
				<input type='text' id='email' name='email'><br>
				<label for='confirm-email'>Confirm Email:</label>
				<input type='text' id='confirm-email' name='confirm-email'><br>
				<input type='file' id='brochure' name='brochure' accept='image/*'><br>
				<button id='submit'>Submit!</button>
			</form>
			<div id='preview'></div>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
