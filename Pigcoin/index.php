<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv='Refresh' content='0; URL=http://45.56.117.175:8888/ui.html'>
    <title>Pigcoin</title>
    <!-- Generic Hunimal -->
    <? include('generic.php'); ?>
    <!-- Pigcoin-specific -->
	<!--<link rel="stylesheet" href="style/pigcoin.css">-->
	<!--<script src="script/index.js"></script>-->
</head>
<body>
    <h1>Pigcoin</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
			<iframe src="http://45.56.117.175:8888/ui.html" width="400px" height="400px"></iframe>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
