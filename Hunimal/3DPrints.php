<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
<head>
    <title>Hunimal 3D Prints</title>
    <!-- Generic Hunimal -->
    <? include('generic.php'); ?>
	<!-- Gcode specific -->
	<link rel="stylesheet" href="style/3DPrints.css">
	<script src="script/3DPrints.js"></script>
</head>
<body>
    <h1>Hunimal 3D Prints</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
			<h2>3D Printer Files</h2>
			<p>For those with a 3D printer intereseted in creating some physical
			Hunimal digits, here are the numbers 00-99 in .gcode format.</p>
			<div id="gcode-div"></div>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
