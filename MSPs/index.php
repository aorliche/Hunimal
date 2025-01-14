<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
    <head>
        <title>MSP Creator</title>
        <!-- Generic Hunimal -->
        <? include('generic.php'); ?>
        <!-- MSP-specific -->
        <link rel="stylesheet" type="text/css" href="style/random.css">
        <script type="text/javascript" src="script/build_common.js"></script>
        <script type="text/javascript" src="script/build_flower.js"></script>
        <script type="text/javascript" src="script/build_random.js"></script>
        <script type="text/javascript" src="script/build_star.js"></script>
        <script type="text/javascript" src="script/canvas.js"></script>
        <script type="text/javascript" src="script/chains.js"></script>
        <script type="text/javascript" src="script/diagonalize.js"></script>
        <script type="text/javascript" src="script/divide.js"></script>
        <script type="text/javascript" src="script/edge.js"></script>
        <script type="text/javascript" src="script/expand_common.js"></script>
        <script type="text/javascript" src="script/expand_flower.js"></script>
        <script type="text/javascript" src="script/expand_random.js"></script>
        <script type="text/javascript" src="script/flips.js"></script>
        <script type="text/javascript" src="script/hole.js"></script>        
        <script type="text/javascript" src="script/keyboard.js"></script>        
        <script type="text/javascript" src="script/main.js"></script>
        <script type="text/javascript" src="script/msp.js"></script>
        <script type="text/javascript" src="script/rectangle.js"></script>
        <script type="text/javascript" src="script/rhombus.js"></script>
        <script type="text/javascript" src="script/squomino.js"></script>
        <script type="text/javascript" src="script/stretch.js"></script>
        <script type="text/javascript" src="script/stroke.js"></script>
        <script type="text/javascript" src="script/util.js"></script>
        <script type="text/javascript" src="script/vertex.js"></script>
        <script type="text/javascript" src="script/stripes.js"></script>
    </head>
    <body onload="onload()">
        <h1>Multi-Solution Puzzles</h1>
        <? include('menu.php'); ?>
            <div id="container">
            <? include('navbar.php'); ?>
            <div id="main">
                <div id="typing-area-div">
                    <textarea id="typing-area"></textarea>
                    <a href="#" class="a-never-visited" onclick="hideTypingArea()">Hide</a>
                </div>
                <p>Construct MSPs in random, star, or flower configurations.</p>
                <p>
                <a href="#" class="a-never-visited" onclick="displayTypingArea()">Display Typing Area</a> (For Tablets/Mobile)
                </p>
				<canvas id="canvas" width="800" height="800" tabindex="0"></canvas>
				<canvas id="stripesCanvas" width="800" height="800" style="display: none;"></canvas>
                <div id="right-of-canvas">
                    <div>
                        X: <input id="x-coord-field" size="4">
                        Y: <input id="y-coord-field" size="4">
                        <input type="button" value="Return to Center" onclick="returnToCenter()">
                        <input type="button" value="Reset" onclick="resetCanvas()">
                    </div>
                    <div class="action-group">
                        Select:<br>
                        <input type="radio" name="select-radio-group" id="select-msp-radio" checked> Select MSP (Move and Zoom)<br>
                        <input type="radio" name="select-radio-group" id="select-vertex-radio"> Select Vertex<br>
                        <input type="radio" name="select-radio-group" id="select-edge-radio"> Select Edge<br>
                        <input type="radio" name="select-radio-group" id="select-for-flip-radio"> Select For Flip<br>
                        <input type="radio" name="select-radio-group" id="select-for-coloring-radio"> Select For Coloring<br>
                        <input type="radio" name="select-radio-group" id="select-multiple-radio"> Select Multiple<br>
                    </div>
                    <div class="action-group">
                        Build MSP:
                        <div>
                            Side Length = <input type="text" value="40" id="side-length-field" size="4">
                        </div>
                        <div>
                            M = <input type="text" value="20" id="m-field" size="2">
                        </div>
                        <input type="button" value="Random MSP" onclick="buildRandomMSP()">
                        <input type="button" value="Star MSP" onclick="buildStarMSP()">
                        <input type="button" value="Flower MSP" onclick="buildFlowerMSP()">
                        <input type="button" value="Plane MSP" onclick="buildRandomMSP(false, false, true)">
                    </div>
                    <div class="action-group">
                        <input type="button" value="Save Canvas" onclick="saveCanvas()"><br>
                        Load File: <input type="file" id="canvas-file-input">
                    </div>
                    <div class="action-group">
                        <input type="button" value="Delete MSP" onclick="deleteMSP()">
                        <input type="button" value="Log Chains" onclick="doLogChains()">
                    </div>
                    <div class="action-group">
                        Split and Combine Rhombi:
                        <div>
                            Power = <input type="text" value="2" id="power-field" size="2">
                        </div>
                        <input type="button" value="Divide MSP" onclick="divideMSP()">
                        <input type="button" value="Split Rhombi" onclick="divideRhombus()">
                        <input type="button" value="Combine Rhombi" onclick="combineRhombi()">
                    </div>
                    <div class="action-group">
                        Flips = <input type="text" value="20" id="flips-field" size="2">
                        <input type="button" value="Random Flips" onclick="doRandomFlips()">
                    </div>
                    <div class="action-group">
                        Save and Restore MSPs:<br>
                        <input type="button" value="Save MSP" onclick="saveMSP()"><br>
                        <table id="saved-states-table"></table>
                        Load File: <input type="file" id="file-input">
                    </div>
                    <div class="action-group">
                        Recolor Selected Rhombi:<br>
                        <input type="checkbox" checked id="apply-color-checkbox">
                        Color: <input type="text" value="#000" id="color-field" size="8">
                        <input type="checkbox" checked id="apply-alpha-checkbox">
                        Alpha: <input type="text" value="1.0" id="alpha-field" size="8"><br>
                        <input type="button" value="Recolor" onclick="recolorSelectedRhombi()">
                        <input type="button" value="Recolor (Random Colors)" onclick="recolorSelectedRhombi(true)">
						<input type="button" value="Recolor (Stripes)" onclick="recolorSelectedRhombi('stripes')">
						<input type="button" value="Recolor (Dots)" onclick="recolorSelectedRhombi('dots')">
						<input type="button" value="Select All" onclick="selectAllForRecoloring()"><br>
                        <input type="checkbox" id="display-numbers-checkbox"> Display Numbers<br>
                        <input type="checkbox" id="display-lines-checkbox"> Display Lines
                    </div>
                    <div class="action-group">
                        Additional Colors and Backgrounds:<br>
                        Main Background: <input type="text" value="#000" id="background-color-field" size="8">
                        <input type="button" value="Change Background" onclick="changeBackground()">
                        <input type="button" value="Set MSP Background" onclick="setMSPBackground()"><br>
                        <input type="checkbox" id="font-color-checkbox">
                        Font Color: <input type="text" value="blue" id="font-color-field" size="8"><br>
                        <input type="checkbox" id="font-alpha-checkbox">
                        Font Alpha: <input type="text" value="1.0" id="font-alpha-field" size="8">
                    </div>
                    <div class="action-group">
                        Quadrilaterals and Triangles:<br>
                        <input type="button" value="Diagonalize" onclick="diagonalizeMultiple('Quads')">
                        <input type="button" value="Triangularize" onclick="diagonalizeMultiple('Tris')">
                        <input type="button" value="Clear" onclick="diagonalizeMultiple('Clear')">
                        <input type="button" value="Rhombi" onclick="diagonalizeMultiple('Rhombi')"><br>
    <!--                    <input type="button" value="Diagonalize" onclick="diagonalizeMSP()">
                        <input type="button" value="Triangularize" onclick="triangularizeMSP()">
                        <input type="button" value="Clear" onclick="clearDiagonalization()">
                        <input type="button" value="Rhombi" onclick="showRhombiNotDiagonalization()"><br>-->
                    </div>
                    <div class="action-group">
                        Embed Word: <input type="text" value="Word" id="embed-word-field">
                        <input type="button" value="Embed" onclick="embedWord()">
                    </div>
                    <div class="action-group">
                        Expand MSP:<br>
                        M = <input type="text" value="7" id="flower-m-field" size="2">
                        <input type="button" value="Flower Vertex" onclick="placeAndExpandFlower(selectedMSP)"><br>
                        <input type="button" value="Random Chain (No Fill)" 
                               onclick="doPlaceAndExpandRandomChain(false)">
                        <input type="button" value="Random Chain (Fill)"
                               onclick="doPlaceAndExpandRandomChain(true)"><br>
                        N = <input type="text" value="10" id="stretch-n-field" size="2">
                        <input type="button" value="Stretch MSP" onclick="doStretchMSP()">
                    </div>
                    <div class="action-group">
                        Strokes (Recoloring):<br>
                        <input type="button" value="Begin" onclick="beginStroke()">
                        <input type="button" value="End" onclick="endStroke()">
                        <input type="button" value="Display" onclick="displayStroke()">
                        <input type="button" value="Apply" onclick="applyStroke()">
                        <input type="button" value="Save" onclick="saveStroke()">
                        <input type="button" value="Invert" onclick="invertStroke()">
                        <table id="saved-stroke-table"></table>
                        Load File: <input type="file" id="stroke-file-input">
                    </div>
                    <div class="action-group">
                        Reflect and Rotate:<br>
                        <input type="button" value="Reflect X" onclick="doReflectX()">
                        <input type="button" value="Reflect Y" onclick="doReflectY()"><br>
                        Half SLs: 
                        <input type="text" size="2" value="2" id="rotate-hsl-field">
                        <input type="button" value="Rotate CW" onclick="doRotate(true)">
                        <input type="button" value="Rotate CCW" onclick="doRotate(false)">
                    </div>
                    <div class="action-group">
                        Keyboard:<br>
                        Size: <input type="text" value="80" size="3" id="keyboard-size-field">
                        XSpacing: <input type="text" value="90" size="3" id="keyboard-spacing-x-field">
                        YSpacing: <input type="text" value="90" size="3" id="keyboard-spacing-y-field">
                        <input type="button" value="Reset Canvas" onclick="resetCanvas()">
                    </div>
                    <div>
                        <div>
                            Define a squomino:<br>
                            <textarea id="squomino-text-area" rows="4" cols="20">0,1,2</textarea><br>
                            <input type="button" value="Create Squomino" onclick="createSquomino()"><br>
                            <input type="button" value="Flip Squomino" onclick="flipSquomino()"><br>
                            <input type="button" value="Rotate Squomino" onclick="rotateSquomino()"><br>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <? include('footer.php'); ?>
    </body>
</html>
