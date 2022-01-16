<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
<head>
    <title>Hunimal Word Search</title>
    <!-- Generic Hunimal -->
    <? include('generic.php'); ?>
    <!-- MSP-specific -->
    <script type="text/javascript" src="script/build_common.js"></script>
    <script type="text/javascript" src="script/build_random.js"></script>
    <script type="text/javascript" src="script/chains.js"></script>
    <script type="text/javascript" src="script/edge.js"></script>
    <script type="text/javascript" src="script/expand_common.js"></script>
    <script type="text/javascript" src="script/expand_random.js"></script>
    <script type="text/javascript" src="script/flips.js"></script>
    <script type="text/javascript" src="script/hole.js"></script>    
    <script src="script/WordSearch/keyboard.js"></script>      <!-- modified to scale stroke parts to canvas size -->
    <script type="text/javascript" src="script/msp.js"></script>
    <script type="text/javascript" src="script/rectangle.js"></script>
    <script type="text/javascript" src="script/rhombus.js"></script>
    <script type="text/javascript" src="script/stroke.js"></script>
    <script type="text/javascript" src="script/util.js"></script>
    <script type="text/javascript" src="script/vertex.js"></script>
    <script src="script/WordSearch/main.js"></script>
    <link rel="stylesheet" href="style/WordSearch.css">
</head>
<body onload="init();">
    <h1>Hunimal Word Search</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
            <canvas width="100" height="100" id="msp-canvas"></canvas><br>
            <canvas width="600" height="600" id="word-search-canvas"></canvas>
            <div id="word-list-div">
                <h2>Words:</h2>
                <ul id="word-list"></ul>
                <span id="num-found-span"></span>/<span id="num-used-span"></span>
                <button onclick="location.reload();">Reload</button>
            </div>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>