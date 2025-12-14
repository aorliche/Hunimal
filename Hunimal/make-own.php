<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
<head>
    <title>Make Your Own</title>
    <!-- Generic Hunimal -->
    <? include('generic.php'); ?>
    <!-- Hunimal-specific -->
	<link rel="stylesheet" href="style/index.css">
</head>
<body>
    <h1>Hunimal</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
			<h2>Make Your Own Hunimal</h2>
			<table id='ownTable' class='huntab'></table>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
