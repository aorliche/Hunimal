<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
<head>
    <title>Hunimal Poker</title>
    <!-- Generic Hunimal -->
    <? include('generic.php'); ?>
    <!-- Hunimal-specific -->
	<link rel="stylesheet" href="style/index.css">
	<script src="script/index.js"></script>
</head>
<body>
    <h1>Consecuprimes</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
			<h2>Prime Number Generation from Consecutive Digits</h2>
            <iframe src='/consecuprimes/' width='1000' height='800'></iframe>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
