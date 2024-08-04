<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
<head>
    <title>Hunimal</title>
    <!-- Generic Hunimal -->
    <? include('generic.php'); ?>
    <!-- Hunimal-specific -->
	<link rel="stylesheet" href="style/index.css">
</head>
<body>
    <h1>Hunimal Quiz Improved</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
			<p>How well do you know Hunimal? Try to answer all the questions correctly! <a href='scoreboard.php'>Scoreboard</a></p>
			<iframe src='/hunimal-quiz/index.php' width=600 height=600></iframe>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
