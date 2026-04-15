<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
    <head>
        <title>Omino Bridge</title>
        <!-- Generic Hunimal -->
        <? include('generic.php'); ?>
		<script src='omino-bridge/js/main2.js' type='module'></script>
        <link rel="stylesheet" type="text/css" href="omino-bridge/css/index.css">
    </head>
    <body>
        <h1>Omino Bridge</h1>
        <? include('menu.php'); ?>
        <div id="container">
            <? include('navbar.php'); ?>
            <div id="main">
                <h3>Complete the tessellation!</h3>
                <p>Drag ominos to complete the tesselation. 
                Once the omino is in the correct spot, the outline will become dark.
                Once all ominos are placed and have a dark outline, you have beaten the puzzle!</p>
                <canvas id='canvas' width='1000' height='600' tabindex=0></canvas>
            </div>
        </div>
        <? include('footer.php'); ?>
    </body>
</html>
