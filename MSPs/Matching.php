<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
    <head>
        <title>Matching MSPs</title>
        <!-- Generic Hunimal -->
        <? include('generic.php'); ?>
        <!-- MSP-specific -->
        <link rel="stylesheet" type="text/css" href="style/matching.css">
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
        <script type="text/javascript" src="script/matching/main.js"></script>
    </head>
    <body onload="matching_load()">
        <h1>Matching Multi-Solu Puzzles</h1>
        <? include('menu.php'); ?>
        <div id="container">
            <? include('navbar.php'); ?>
            <div id="main">
                <p id="error-p">
                    No error
                </p>
                <p id="score-p">
                    Flips: <span id="flips-span">0</span> Goal: <span id="goal-span">0</span>
                </p>
                <p id="control-p">
                    <button onclick="matching_undo()">Undo Flip</button>
                    <button onclick="matching_reload()">Reload Puzzle</button>
                    Difficulty: <input type="text" id="difficulty-input" value="2">
                </p>
                <div>
                    <ul>
                        <li>Modify the MSP on the right to match the MSP on the left.</li>
                        <li>You modify the MSP by selecting three rhombi that together form a six-sided polygon.
                            <ul>
                                <li>Each of the three rhombi must share a side with the other two</li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div id="right-div">
                    <div style="position: relative; width: 0px; height: 0px;">
                        <div id="solved-message-div">You solved it!</div>
                        <div id="target-div">Target</div>
                        <div id="working-div">Work on this one</div>
                        <canvas id="canvas" width="800" height="400" tabindex="0"></canvas>
                    </div>
                </div>
            </div>
        </div>
        <? include('footer.php'); ?>
    </body>
</html>
