<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
    <head>
        <title>JumPin MSPs</title>
        <!-- Generic Hunimal -->
        <? include('generic.php'); ?>
        <!-- MSP-specific -->
        <link rel="stylesheet" type="text/css" href="style/random.css">
        <script type="text/javascript" src="script/build_common.js"></script>
        <script type="text/javascript" src="script/build_random.js"></script>
        <script type="text/javascript" src="script/chains.js"></script>
        <script type="text/javascript" src="script/edge.js"></script>
        <script type="text/javascript" src="script/expand_common.js"></script>
        <script type="text/javascript" src="script/expand_random.js"></script>
        <script type="text/javascript" src="script/flips.js"></script>
        <script type="text/javascript" src="script/hole.js"></script>        
        <script type="text/javascript" src="script/msp.js"></script>
        <script type="text/javascript" src="script/rectangle.js"></script>
        <script type="text/javascript" src="script/rhombus.js"></script>
        <script type="text/javascript" src="script/util.js"></script>
        <script type="text/javascript" src="script/vertex.js"></script>
        <script type="text/javascript" src="script/jumpin/main.js"></script>
    </head>
    <body onload="jumpin_load()">
        <h1>JumPin Multi-Solu Puzzles</h1>
        <? include('menu.php'); ?>
        <div id="container">
            <? include('navbar.php'); ?>
            <div id="main" style="min-width: 650px;">
                <p>Jump over pins in the vertices of the MSP to remove pins.
                    You must jump from a vertex with a pin, to a vertex without a pin, over a vertex with a pin.
                    Try to remove all but one of the pins. You can only jump forwards!</p>
                <p>
                    <button onclick="jumpin_reload()">Reload MSP</button>
                    Difficulty: 
                    <input type="radio" id="easyRadio" name="difficulty" checked> Easy
                    <input type="radio" id="mediumRadio" name="difficulty"> Medium
                    <input type="radio" id="hardRadio" name="difficulty"> Hard
                </p>
                <div style="text-align: center;">
                    <canvas id="canvas" style="float: none; margin: 0 auto;" width="600" height="600" tabindex="0"></canvas>
                </div>
            </div>
        </div>
        <? include('footer.php'); ?>
    </body>
</html>
