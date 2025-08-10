<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
<head>
    <title>Arithmetic Game</title>
    <!-- Generic Hunimal -->
    <? include('generic.php'); ?>
    <!-- Hunimal-specific -->
	<link rel="stylesheet" href="style/index.css">
</head>
<body>
    <h1>Hunimal Arithmetic Game</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
			<p>How well can you do arithmetic in Hunimal? Try to beat the timer and get the best score!</p>
			<iframe src='/arithmetic-game/index.html' width=1050 height=700></iframe>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
