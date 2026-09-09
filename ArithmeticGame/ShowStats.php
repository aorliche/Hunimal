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
			<iframe src='/arithmetic-game/show_stats2.php' width=1200 height=700></iframe>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
