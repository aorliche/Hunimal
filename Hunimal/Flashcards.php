<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
<head>
    <title>Hunimal Flashcards</title>
    <!-- Generic Hunimal -->
    <? include('generic.php'); ?>
    <!-- Hunimal-specific -->
	<link rel="stylesheet" href="style/index.css">
	<script src="script/index.js"></script>
</head>
<body>
    <h1>Hunimal Flashcards</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
			<h2>Multiplication Flashcards</h2>
            <iframe src='/flashcards/' width='1600' height='600'></iframe>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
