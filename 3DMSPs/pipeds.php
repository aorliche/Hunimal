<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
    <head>
        <title>3D MSP Engine Test</title>
        <!-- Generic Hunimal -->
        <? include('generic.php'); ?>
        <!-- Pipeds-specific -->
		<link rel="stylesheet" type="text/css" href="css/pipeds.css">
		<script src="js/pipeds.js" type="module"></script>
	</head>
    <body>
        <h1>3D MSP Engine Test</h1>
        <? include('menu.php'); ?>
            <div id="container">
            <? include('navbar.php'); ?>
            <div id="main">
				<ul>
					<li>Click and drag to rotate the pipeds</li>
					<li>Click on a vertex and press the generate button to add pipeds</li>
					<li>See if you can break the 3D engine!</li>
				</ul>
				<div id='container2'>
					<canvas id="canvas" width="800" height="600"></canvas>
					<div id='controls'>
						<div>
                            <p>Click the button after you click and create a blue vertex to expand the pipeds</p>
							<button id='bGenFromV'>Generate from Outside Vertex</button>
						</div>
					</div>
				</div>
            </div>
        </div>
        <? include('footer.php'); ?>
    </body>
</html>
